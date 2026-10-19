// Keeps a signed-in learner's progress, profile and Playground in step with their account (the `user_state` table,
// supabase/migrations/0001_user_state.sql). The three local stores stay the source the screens read, so everything is
// instant and works offline; this file only copies changes up and merges the account's copy in. The merge rules are
// pure and live in src/domain/sync.ts.
//
//   signed in  → pull (merge the account's rows into the local stores) → push whatever differs
//   a store changes → mark it dirty → push after a short delay (Playground ticks are batched: it changes every second)
//   offline or failing → stay dirty, retry when the browser is back online and on the next change
//   signed out → stop; this device keeps its data as guest progress and remembers whose it was (`owner`)
import { emptyPlayground } from '../domain/playground/engine'
import { parsePlayground } from '../domain/playground/persist'
import { emptyProfile, parseProfile } from '../domain/profile'
import { emptyProgress, parseProgress } from '../domain/progress'
import { mergeProfile, mergeProgress, parsePrefs, signInPlan, walletSide, type Prefs } from '../domain/sync'
import { loadSupabase } from './supabase'
import { authStore, type AuthUser } from './auth'
import { createPersistedStore } from './createPersistedStore'
import { playgroundStore } from './playground'
import { profileStore } from './profile'
import { progressStore } from './progress'
import { useStore } from './useStore'
import { settingsStore } from './settings'
import { languageStore } from './language'

type Key = 'progress' | 'profile' | 'playground' | 'settings'
const KEYS: Key[] = ['progress', 'profile', 'playground', 'settings']

/** Sound and language as one synced value (two local stores, so each keeps its own saved format). */
const prefsStore = {
  get: (): Prefs => ({ sound: settingsStore.get().sound, lang: languageStore.get() }),
  update(fn: (p: Prefs) => Prefs) {
    const next = fn(prefsStore.get())
    settingsStore.update((s) => (s.sound === next.sound ? s : { ...s, sound: next.sound }))
    languageStore.update(() => next.lang)
  },
  subscribe(listener: () => void) {
    const a = settingsStore.subscribe(listener)
    const b = languageStore.subscribe(listener)
    return () => {
      a()
      b()
    }
  },
}
const stores = { progress: progressStore, profile: profileStore, playground: playgroundStore, settings: prefsStore }

interface Meta {
  /** The account this device's data last belonged to (null: a pure guest) */
  owner: string | null
  /** When each store last changed on this device, or last matched the server (ISO), to tell which copy is newer */
  modified: Partial<Record<Key, string>>
}
const metaStore = createPersistedStore<Meta>({
  key: 'sync:meta',
  empty: { owner: null, modified: {} },
  parse(raw) {
    try {
      const d = JSON.parse(raw ?? '') as Partial<Meta>
      return { owner: typeof d.owner === 'string' ? d.owner : null, modified: d.modified && typeof d.modified === 'object' ? d.modified : {} }
    } catch {
      return { owner: null, modified: {} }
    }
  },
})
const setMeta = (fn: (m: Meta) => Meta) => metaStore.update(fn)

export type SyncStatus = 'off' | 'syncing' | 'synced' | 'offline' | 'error'
let status: SyncStatus = 'off'
const listeners = new Set<() => void>()
const setStatus = (s: SyncStatus) => {
  if (s === status) return
  status = s
  listeners.forEach((l) => l())
}
export const syncStatusStore = {
  get: () => status,
  subscribe(l: () => void) {
    listeners.add(l)
    return () => {
      listeners.delete(l)
    }
  },
}
export const useSyncStatus = () => useStore(syncStatusStore)

const dirty = new Set<Key>()
let applying = false // true while the merge is writing into the stores, so it is not mistaken for the learner's own change
let timer: ReturnType<typeof setTimeout> | undefined
let lastPull = 0
let user: AuthUser | null = null
const lastMark: Partial<Record<Key, number>> = {}
const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b)

async function pull(u: AuthUser) {
  setStatus('syncing')
  const sb = await loadSupabase()
  const { data, error } = await sb.from('user_state').select('key,data,updated_at')
  if (error) throw error
  const rows = Object.fromEntries((data ?? []).map((r: { key: Key; data: unknown; updated_at: string }) => [r.key, r]))
  const meta = metaStore.get()
  const replace = signInPlan(meta.owner, u.id) === 'replace'
  const localProgress = replace ? emptyProgress : progressStore.get()
  const localProfile = replace ? emptyProfile : profileStore.get()
  const localPlayground = replace ? emptyPlayground : playgroundStore.get()

  const remoteProgress = rows.progress ? parseProgress(JSON.stringify(rows.progress.data)) : null
  const remotePlayground = rows.playground ? parsePlayground(JSON.stringify(rows.playground.data)) : null
  const remoteProfile = rows.profile ? parseProfile(JSON.stringify(rows.profile.data)) : null

  // The wallet (bank + Playground) comes whole from the newer side.
  const side = replace && remoteProgress ? 'remote' : remoteProgress ? walletSide(meta.modified.progress, rows.progress.updated_at) : 'local'
  const progress = remoteProgress ? mergeProgress(localProgress, remoteProgress, side) : localProgress
  const playground = side === 'remote' && remoteProgress ? (remotePlayground ?? emptyPlayground) : localPlayground
  const profileNewer = rows.profile ? !meta.modified.profile || rows.profile.updated_at > meta.modified.profile : false
  const profile = remoteProfile ? mergeProfile(localProfile, remoteProfile, replace || profileNewer) : localProfile
  const remotePrefs = rows.settings ? parsePrefs(rows.settings.data) : null
  const prefsNewer = rows.settings ? replace || !meta.modified.settings || rows.settings.updated_at > meta.modified.settings : false
  const prefs = remotePrefs && prefsNewer ? remotePrefs : prefsStore.get()

  applying = true
  try {
    if (!same(progress, progressStore.get())) progressStore.update(() => progress)
    if (!same(profile, profileStore.get())) profileStore.update(() => profile)
    if (!same(playground, playgroundStore.get())) playgroundStore.update(() => playground)
    if (!same(prefs, prefsStore.get())) prefsStore.update(() => prefs)
  } finally {
    applying = false
  }
  setMeta((m) => ({ ...m, owner: u.id }))
  // Push whatever the server does not already have in this exact form.
  if (!rows.progress || !same(progress, remoteProgress)) dirty.add('progress')
  if (!rows.profile || !same(profile, remoteProfile)) dirty.add('profile')
  if (!rows.playground || !same(playground, remotePlayground)) dirty.add('playground')
  if (!rows.settings || !same(prefs, remotePrefs)) dirty.add('settings')
  lastPull = Date.now()
}

/** Send the dirty stores in one request, so the bank and the Playground always reach the server together.
 *  Preferences go on their own: a project that has not run migration 0003 yet refuses that row, and that must never
 *  hold back the learner's progress. */
async function push(u: AuthUser) {
  if (dirty.has('settings')) {
    const sb = await loadSupabase()
    const { data } = await sb.from('user_state').upsert([{ user_id: u.id, key: 'settings', data: prefsStore.get() }], { onConflict: 'user_id,key' }).select('key,updated_at')
    dirty.delete('settings') // sent, or refused by an older table: either way, not retried in a loop
    const at = (data as { updated_at: string }[] | null)?.[0]?.updated_at
    if (at) setMeta((m) => ({ ...m, modified: { ...m.modified, settings: at } }))
  }
  if (dirty.size === 0) return
  const keys = [...dirty]
  const sb = await loadSupabase()
  const { data, error } = await sb
    .from('user_state')
    .upsert(keys.map((key) => ({ user_id: u.id, key, data: stores[key].get() })), { onConflict: 'user_id,key' })
    .select('key,updated_at')
  if (error) throw error
  const times = Object.fromEntries((data ?? []).map((r: { key: Key; updated_at: string }) => [r.key, r.updated_at]))
  keys.forEach((k) => dirty.delete(k))
  setMeta((m) => ({ ...m, modified: { ...m.modified, ...times } })) // now this device and the server hold the same copy
}

async function cycle(withPull: boolean) {
  const u = user
  if (!u) return
  try {
    if (withPull) await pull(u)
    if (user?.id !== u.id) return
    await push(u)
    setStatus(dirty.size ? 'syncing' : 'synced')
  } catch {
    setStatus(typeof navigator !== 'undefined' && navigator.onLine === false ? 'offline' : 'error')
    schedule(30_000)
  }
}

function schedule(delay: number) {
  clearTimeout(timer)
  timer = setTimeout(() => void cycle(false), delay)
}

function onLocalChange(key: Key) {
  if (applying) return
  // Remember when this device last changed, signed in or not: a guest's money must be able to beat an older account copy.
  const now = Date.now()
  if (key !== 'playground' || now - (lastMark[key] ?? 0) > 5000) {
    lastMark[key] = now
    setMeta((m) => ({ ...m, modified: { ...m.modified, [key]: new Date(now).toISOString() } }))
  }
  if (!user) return
  dirty.add(key)
  // The Playground changes every second while a season runs: batch it. Anything else goes up after a moment.
  schedule(key === 'playground' && dirty.size === 1 ? 10_000 : 2_000)
}

let started = false
/** Wire the stores to the account. Safe to call once at startup; does nothing when accounts are not configured. */
export function startSync() {
  if (started) return
  started = true
  for (const key of KEYS) stores[key].subscribe(() => onLocalChange(key))
  authStore.subscribe(() => {
    const s = authStore.get()
    const next = s.status === 'signedIn' ? s.user : null
    if (next?.id === user?.id) return
    user = next
    clearTimeout(timer)
    dirty.clear()
    if (user) void cycle(true)
    else setStatus('off')
  })
  if (typeof window !== 'undefined') {
    window.addEventListener('online', () => user && void cycle(dirty.size === 0))
    document.addEventListener('visibilitychange', () => {
      if (!user) return
      if (document.hidden) void cycle(false) // leaving: send what is pending
      else if (Date.now() - lastPull > 60_000) void cycle(true) // coming back: pick up changes made on another device
    })
  }
  const s = authStore.get()
  if (s.status === 'signedIn' && s.user) {
    user = s.user
    void cycle(true)
  }
}
