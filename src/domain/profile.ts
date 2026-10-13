// Onboarding choices and the active trail: the shape, how it is read from saved text, and the goal → trail map.
// Saving and subscribing live in src/state/profile.ts; learning progress is in src/domain/progress.ts.

export interface Profile {
  /** Finished the Welcome → Daily-time flow (or chose "I already have a path") */
  onboarded: boolean
  /** Why they came: `money` | `invest` | `accounting` | `business` */
  goal?: string
  /** The course ("trail") shown on Path; defaults to the first one with content */
  trail?: string
  /** Daily time goal in minutes */
  minutes: number
}

/** A first-time visitor. Also what unreadable saved text parses to. */
export const emptyProfile: Profile = { onboarded: false, minutes: 10 }

export function parseProfile(raw: string | null): Profile {
  if (!raw) return emptyProfile
  try {
    const d = JSON.parse(raw) as Record<string, unknown>
    return {
      onboarded: d.onboarded === true,
      minutes: typeof d.minutes === 'number' && d.minutes > 0 ? d.minutes : 10,
      ...(typeof d.goal === 'string' ? { goal: d.goal } : {}),
      ...(typeof d.trail === 'string' ? { trail: d.trail } : {}),
    }
  } catch {
    return emptyProfile
  }
}

/** Every goal leads to the one trail there is for now. */
export const DEFAULT_TRAIL = 'investing'
