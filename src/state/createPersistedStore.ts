// One implementation of "a value kept in localStorage that React components can subscribe to", used for progress,
// profile, settings and language. It replaces four hand-copied versions and fixes their shared flaw: each kept a
// private cache that was never refreshed, so with two tabs open the second tab's next save overwrote the first
// tab's progress. Here every update starts from what is *currently saved*, and a `storage` event from another tab
// refreshes the cache and re-renders subscribers.
//
// Versioning: bump the key suffix ('progress:v2') and list the old key in `legacyKeys`; `parse` (the migration) is
// then run on the old value the first time the new key is empty. Backend sync (docs/SUPABASE-INTEGRATION.md)
// hooks in here too: `subscribe` sees every local and remote change.

export interface StorageLike {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
}

export interface PersistedStoreOptions<T> {
  /** localStorage key, e.g. 'progress:v1' */
  key: string
  /** Older keys to import from (through `parse`) when `key` has no value yet */
  legacyKeys?: string[]
  /** Value when nothing is saved or the saved text is unreadable */
  empty: T
  /** Saved text (or null) → value. Must tolerate old shapes and garbage: this is where migrations live. */
  parse(raw: string | null): T
  /** Value → saved text. Default: JSON */
  serialize?(value: T): string
  /** Where to save. Default: window.localStorage (absent or blocked, e.g. private mode: values live in memory) */
  storage?: StorageLike
  /** Where 'storage' events (changes made by other tabs) arrive. Default: window */
  target?: Pick<EventTarget, 'addEventListener'>
}

export interface PersistedStore<T> {
  /** Current value. The same object until the value changes, so it is safe for useSyncExternalStore. */
  get(): T
  /** Replace the value with `fn(latest saved value)`. Returning the same object is a no-op. */
  update(fn: (current: T) => T): void
  /** Back to `empty` */
  reset(): void
  subscribe(listener: () => void): () => void
}

function browserStorage(): StorageLike | undefined {
  try {
    return typeof window === 'undefined' ? undefined : window.localStorage
  } catch {
    return undefined // access blocked (some privacy modes throw on touching localStorage)
  }
}

export function createPersistedStore<T>(options: PersistedStoreOptions<T>): PersistedStore<T> {
  const { key, legacyKeys = [], empty, parse, serialize = JSON.stringify } = options
  const storage = options.storage ?? browserStorage()
  const target = options.target ?? (typeof window === 'undefined' ? undefined : window)
  const listeners = new Set<() => void>()

  let cache: T | undefined
  /** The saved text `cache` was built from (or written as), to tell whether storage changed underneath us */
  let lastRaw: string | null | undefined

  function read(k: string): string | null {
    try {
      return storage?.getItem(k) ?? null
    } catch {
      return null
    }
  }

  function readSaved(): string | null {
    let raw = read(key)
    if (raw === null) {
      for (const old of legacyKeys) {
        raw = read(old)
        if (raw !== null) break
      }
    }
    return raw
  }

  /** Re-read storage; re-parse only if the saved text changed since we last looked. Returns the latest value. */
  function refresh(): T {
    const raw = readSaved()
    if (cache === undefined || raw !== lastRaw) {
      lastRaw = raw
      cache = raw === null ? empty : parse(raw)
    }
    return cache
  }

  const notify = () => listeners.forEach((l) => l())

  target?.addEventListener('storage', (event) => {
    const e = event as StorageEvent
    if (e.key !== null && e.key !== key) return // some other key (null: storage.clear())
    const before = cache
    if (refresh() !== before) notify()
  })

  function update(fn: (current: T) => T) {
    const base = refresh()
    const next = fn(base)
    if (next === base) return
    cache = next
    const text = serialize(next)
    try {
      storage?.setItem(key, text)
      lastRaw = text
    } catch {
      // Quota exceeded or storage blocked: the value lives in memory for this page view.
    }
    notify()
  }

  // Methods use the closure, never `this`, so they are safe to pass around bare (`onClick={store.reset}`).
  return {
    get: () => cache ?? refresh(),
    update,
    reset: () => update(() => empty),
    subscribe(listener) {
      listeners.add(listener)
      return () => {
        listeners.delete(listener)
      }
    },
  }
}
