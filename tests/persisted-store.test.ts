import { describe, expect, it, vi } from 'vitest'
import { createPersistedStore, type StorageLike } from '../src/state/createPersistedStore'

/** A fake localStorage shared between "tabs" (each tab is its own store instance over the same storage). */
const fakeStorage = (initial: Record<string, string> = {}): StorageLike & { data: Map<string, string> } => {
  const data = new Map(Object.entries(initial))
  return { data, getItem: (k) => data.get(k) ?? null, setItem: (k, v) => void data.set(k, v) }
}
const counter = { empty: { n: 0, tabs: [] as string[] }, parse: (raw: string | null) => (raw ? JSON.parse(raw) : { n: 0, tabs: [] }) }
type Value = { n: number; tabs: string[] }

describe('createPersistedStore', () => {
  it('starts from the saved value, falls back to empty on garbage, and saves updates', () => {
    const storage = fakeStorage({ k: JSON.stringify({ n: 3, tabs: [] }) })
    const store = createPersistedStore<Value>({ key: 'k', ...counter, parse: (r) => { try { return JSON.parse(r ?? '') } catch { return counter.empty } }, storage, target: new EventTarget() })
    expect(store.get().n).toBe(3)
    store.update((v) => ({ ...v, n: v.n + 1 }))
    expect(JSON.parse(storage.data.get('k')!).n).toBe(4)
    const broken = createPersistedStore<Value>({ key: 'x', ...counter, parse: (r) => { try { return JSON.parse(r ?? '') } catch { return counter.empty } }, storage: fakeStorage({ x: '{nope' }), target: new EventTarget() })
    expect(broken.get()).toBe(counter.empty)
  })

  it('keeps one object between changes and ignores no-op updates', () => {
    const store = createPersistedStore<Value>({ key: 'k', ...counter, storage: fakeStorage(), target: new EventTarget() })
    const first = store.get()
    expect(store.get()).toBe(first)
    const listener = vi.fn()
    store.subscribe(listener)
    store.update((v) => v)
    expect(listener).not.toHaveBeenCalled()
    store.update((v) => ({ ...v, n: 1 }))
    expect(listener).toHaveBeenCalledTimes(1)
    expect(store.get()).not.toBe(first)
  })

  it('does not overwrite another tab\'s change (the two-tabs bug)', () => {
    const storage = fakeStorage()
    const tabA = createPersistedStore<Value>({ key: 'k', ...counter, storage, target: new EventTarget() })
    const tabB = createPersistedStore<Value>({ key: 'k', ...counter, storage, target: new EventTarget() })
    expect(tabB.get().n).toBe(0) // tab B loaded before tab A saved anything
    tabA.update((v) => ({ n: v.n + 1, tabs: [...v.tabs, 'A'] }))
    tabB.update((v) => ({ n: v.n + 1, tabs: [...v.tabs, 'B'] })) // starts from A's saved value, not B's stale copy
    expect(JSON.parse(storage.data.get('k')!)).toEqual({ n: 2, tabs: ['A', 'B'] })
  })

  it('refreshes and notifies when another tab changes the saved value', () => {
    const storage = fakeStorage()
    const target = new EventTarget()
    const store = createPersistedStore<Value>({ key: 'k', ...counter, storage, target })
    const listener = vi.fn()
    store.subscribe(listener)
    expect(store.get().n).toBe(0)
    storage.setItem('k', JSON.stringify({ n: 7, tabs: ['other'] })) // what the other tab wrote
    target.dispatchEvent(Object.assign(new Event('storage'), { key: 'k' }))
    expect(store.get().n).toBe(7)
    expect(listener).toHaveBeenCalledTimes(1)
    target.dispatchEvent(Object.assign(new Event('storage'), { key: 'unrelated' })) // other keys are ignored
    expect(listener).toHaveBeenCalledTimes(1)
    target.dispatchEvent(Object.assign(new Event('storage'), { key: 'k' })) // same text: nothing to do
    expect(listener).toHaveBeenCalledTimes(1)
  })

  it('imports from a legacy key once the new key is empty (version bump)', () => {
    const storage = fakeStorage({ 'k:v1': JSON.stringify({ n: 5, tabs: [] }) })
    const store = createPersistedStore<Value>({ key: 'k:v2', legacyKeys: ['k:v1'], ...counter, storage, target: new EventTarget() })
    expect(store.get().n).toBe(5)
    store.update((v) => ({ ...v, n: v.n + 1 }))
    expect(JSON.parse(storage.data.get('k:v2')!).n).toBe(6) // the new key now owns the value
  })

  it('keeps values in memory when storage is blocked, and reset works as a bare callback', () => {
    const blocked: StorageLike = { getItem() { throw new Error('blocked') }, setItem() { throw new Error('blocked') } }
    const store = createPersistedStore<Value>({ key: 'k', ...counter, storage: blocked, target: new EventTarget() })
    store.update((v) => ({ ...v, n: 9 }))
    expect(store.get().n).toBe(9)
    const { reset } = store // detached, as `onClick={store.reset}` would be
    reset()
    expect(store.get()).toBe(counter.empty)
  })
})
