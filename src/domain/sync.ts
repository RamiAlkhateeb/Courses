// How a learner's data from this browser and from their account are combined when they sign in (or come back to
// the app). Pure functions only: no network, no storage, so the rules are unit-tested directly. The plumbing is in
// src/state/sync.ts.
//
// The rules, in one place:
//  - Learning is additive: finished lessons, sections read and answers from both sides are kept; review boxes take
//    the higher box; the streak with the later day wins; per-day earnings take the larger value.
//  - Money is not additive. The bank and the Playground are two halves of one wallet (moving $500 in lowers the
//    bank and raises the Playground), so they are taken together from ONE side, the one saved more recently.
//    Adding or taking the max of the two banks would create or destroy play money.
//  - The profile (onboarding choices) comes from the newer side, except "finished onboarding" which sticks.
//  - Preferences (sound, language) come whole from the newer side.
import type { Profile } from './profile'
import type { Progress } from './progress'

const union = <T>(a: T[], b: T[]): T[] => [...new Set([...a, ...b])]

function mergeRecords<T>(a: Record<string, T>, b: Record<string, T>, pick: (x: T, y: T) => T): Record<string, T> {
  const out: Record<string, T> = { ...a }
  for (const [k, v] of Object.entries(b)) out[k] = k in a ? pick(a[k], v) : v
  return out
}

/** Combine two copies of the same learner's progress. `bankFrom` says which side's bank to keep (see the header). */
export function mergeProgress(local: Progress, remote: Progress, bankFrom: 'local' | 'remote'): Progress {
  const newer = remote.streak.lastDay > local.streak.lastDay || (remote.streak.lastDay === local.streak.lastDay && remote.streak.count > local.streak.count) ? remote : local
  return {
    answers: mergeRecords(local.answers, remote.answers, (x, y) => (x.correct === y.correct ? y : x.correct ? x : y)), // a right answer outranks an older wrong one
    sectionsRead: mergeRecords(local.sectionsRead, remote.sectionsRead, (x, y) => union(x, y)),
    bank: bankFrom === 'remote' ? remote.bank : local.bank,
    streak: newer.streak,
    boxes: mergeRecords(local.boxes, remote.boxes, (x, y) => Math.max(x, y)),
    lessonsDone: union(remote.lessonsDone, local.lessonsDone),
    ...(newer.lastLesson ?? local.lastLesson ?? remote.lastLesson ? { lastLesson: newer.lastLesson ?? local.lastLesson ?? remote.lastLesson } : {}),
    activity: mergeRecords(local.activity, remote.activity, (x, y) => Math.max(x, y)),
    perfect: Math.max(local.perfect, remote.perfect),
    freezes: newer.freezes, // spent and earned together with the streak, so they come from the same side
  }
}

export function mergeProfile(local: Profile, remote: Profile, remoteIsNewer: boolean): Profile {
  const base = remoteIsNewer ? { ...local, ...remote } : { ...remote, ...local }
  return { ...base, onboarded: local.onboarded || remote.onboarded }
}

/** Which side holds the wallet (bank + Playground): the one saved more recently. Ties and unknowns keep this device's. */
export function walletSide(localModifiedAt: string | undefined, remoteUpdatedAt: string | undefined): 'local' | 'remote' {
  if (!remoteUpdatedAt) return 'local'
  if (!localModifiedAt) return 'remote' // nothing was ever done on this device since it last synced
  return remoteUpdatedAt > localModifiedAt ? 'remote' : 'local'
}

/** Signing in: if this device last belonged to a different account, that account's local data must not leak into
 *  this one, so the new account's data replaces it. Otherwise (a guest, or the same account) the two are merged. */
export function signInPlan(owner: string | null, userId: string): 'merge' | 'replace' {
  return owner !== null && owner !== userId ? 'replace' : 'merge'
}

/** Has the learner done anything worth keeping? A pristine guest has nothing to lose or to upload. */
export const progressIsEmpty = (p: Progress) => p.lessonsDone.length === 0 && Object.keys(p.answers).length === 0 && Object.keys(p.sectionsRead).length === 0

/** Preferences that follow the account: sound and language (news alerts stay per device: each browser asks its own
 *  permission). The newer side wins, like the profile. */
export interface Prefs {
  sound: boolean
  lang: 'en' | 'ar'
}

export function parsePrefs(data: unknown): Prefs | null {
  if (typeof data !== 'object' || data === null) return null
  const d = data as Record<string, unknown>
  return { sound: d.sound !== false, lang: d.lang === 'ar' ? 'ar' : 'en' }
}
