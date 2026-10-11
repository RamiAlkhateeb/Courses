// Onboarding choices and the active trail, kept in this browser's localStorage (guest mode, no backend).
// Same external-store pattern as src/features/settings/store.ts. Learning progress itself stays in
// src/features/progress/store.ts.
import { useSyncExternalStore } from 'react'

export interface Profile {
  /** Finished the Welcome → Daily-time flow (or chose "I already have a path") */
  onboarded: boolean
  /** Why they came: `money` | `invest` | `accounting` | `business` */
  goal?: string
  /** The course ("trail") shown on Path; defaults to the first one with content */
  trail?: string
  /** Daily time goal in minutes */
  minutes: number
  /** Local day ('YYYY-MM-DD') the weekly rest day was last used (design 20) */
  restDayUsed?: string
}

const KEY = 'profile:v1'
const empty: Profile = { onboarded: false, minutes: 10 }

export function parseProfile(raw: string | null): Profile {
  if (!raw) return empty
  try {
    const d = JSON.parse(raw) as Record<string, unknown>
    return {
      onboarded: d.onboarded === true,
      minutes: typeof d.minutes === 'number' && d.minutes > 0 ? d.minutes : 10,
      ...(typeof d.goal === 'string' ? { goal: d.goal } : {}),
      ...(typeof d.trail === 'string' ? { trail: d.trail } : {}),
      ...(typeof d.restDayUsed === 'string' ? { restDayUsed: d.restDayUsed } : {}),
    }
  } catch {
    return empty
  }
}

let cache: Profile | undefined
const listeners = new Set<() => void>()

function load(): Profile {
  if (!cache) {
    try {
      cache = parseProfile(localStorage.getItem(KEY))
    } catch {
      cache = empty
    }
  }
  return cache
}

export function updateProfile(patch: Partial<Profile>) {
  cache = { ...load(), ...patch }
  try {
    localStorage.setItem(KEY, JSON.stringify(cache))
  } catch {
    // ignore (private mode): the choice lasts for this page view
  }
  listeners.forEach((l) => l())
}

const subscribe = (l: () => void) => {
  listeners.add(l)
  return () => listeners.delete(l)
}

export const useProfile = () => useSyncExternalStore(subscribe, load)

/** The trail each onboarding goal points to. */
export const GOAL_TRAIL: Record<string, string> = {
  money: 'personal-finance',
  invest: 'investing',
  accounting: 'accounting',
  business: 'marketing',
}
export const DEFAULT_TRAIL = 'investing'
