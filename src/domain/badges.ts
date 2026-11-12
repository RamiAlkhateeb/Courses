// Badges: small, durable rewards for learning habits and simulator firsts. Earned once and saved with the day
// (`badges` in progress), so a broken streak never takes one away. Pure rules; the facts come from progress, the
// course's units (src/state/useTrail.ts) and the simulator (src/domain/playground/). Never about returns or rankings.
import type { Progress } from './progress'
import type { PlaygroundState } from './playground/engine'
import { goalStatus } from './playground/insights'
import { challengeMet } from './playground/challenges'

/** What the badges look at. */
export interface BadgeFacts {
  lessons: number
  bestStreak: number
  perfect: number
  /** Units (modules) with every lesson finished */
  unitsDone: number
  /** Every lesson of the course finished */
  courseDone: boolean
  /** Today's chest of play money was opened */
  chestOpened: boolean
  /** The simulator has a first buy (this season or an earlier one) */
  firstBuy: boolean
  /** A dividend, rent or interest payout has arrived */
  firstPayout: boolean
  /** A simulator season has run to the end */
  seasonDone: boolean
  /** A finished season met the goal set for it */
  goalMet: boolean
  /** A finished simulated year met its weekly challenge (src/domain/playground/challenges.ts) */
  challengeMet: boolean
}

export type BadgeIcon = 'sprout' | 'book' | 'flame' | 'star' | 'flag' | 'gem' | 'chest' | 'trend' | 'coins' | 'chart' | 'shield'

export interface Badge {
  id: string
  icon: BadgeIcon
  earned: (f: BadgeFacts) => boolean
}

/** Every badge, in the order Me shows them (the first locked ones are "next up"). Ids are saved: never rename. */
export const BADGES: Badge[] = [
  { id: 'first-lesson', icon: 'sprout', earned: (f) => f.lessons >= 1 },
  { id: 'streak-3', icon: 'flame', earned: (f) => f.bestStreak >= 3 },
  { id: 'perfect-1', icon: 'star', earned: (f) => f.perfect >= 1 },
  { id: 'first-buy', icon: 'trend', earned: (f) => f.firstBuy },
  { id: 'chest', icon: 'chest', earned: (f) => f.chestOpened },
  { id: 'unit-1', icon: 'flag', earned: (f) => f.unitsDone >= 1 },
  { id: 'streak-7', icon: 'flame', earned: (f) => f.bestStreak >= 7 },
  { id: 'lessons-10', icon: 'book', earned: (f) => f.lessons >= 10 },
  { id: 'first-payout', icon: 'coins', earned: (f) => f.firstPayout },
  { id: 'perfect-10', icon: 'star', earned: (f) => f.perfect >= 10 },
  { id: 'units-3', icon: 'flag', earned: (f) => f.unitsDone >= 3 },
  { id: 'lessons-25', icon: 'book', earned: (f) => f.lessons >= 25 },
  { id: 'season', icon: 'chart', earned: (f) => f.seasonDone },
  { id: 'goal-met', icon: 'shield', earned: (f) => f.goalMet },
  { id: 'streak-30', icon: 'flame', earned: (f) => f.bestStreak >= 30 },
  { id: 'course', icon: 'gem', earned: (f) => f.courseDone },
  { id: 'challenge', icon: 'flag', earned: (f) => f.challengeMet },
]

/** The learning facts progress alone can tell (the rest default to "not yet"). */
export const progressFacts = (p: Progress, today: string): Pick<BadgeFacts, 'lessons' | 'bestStreak' | 'perfect' | 'chestOpened'> => ({
  lessons: p.lessonsDone.length,
  bestStreak: p.bestStreak,
  perfect: p.perfect,
  chestOpened: p.daily.day === today && p.daily.claimed,
})

/** Badges the facts earn that progress does not hold yet, in BADGES order. */
export const newBadges = (p: Pick<Progress, 'badges'>, f: BadgeFacts): string[] =>
  BADGES.filter((b) => !p.badges[b.id] && b.earned(f)).map((b) => b.id)

/** Save newly earned badges with `today`; the same object when nothing is new. Earned badges are never removed. */
export function awardBadges<P extends Pick<Progress, 'badges'>>(p: P, f: BadgeFacts, today: string): P {
  const fresh = newBadges(p, f)
  if (!fresh.length) return p
  return { ...p, badges: { ...p.badges, ...Object.fromEntries(fresh.map((id) => [id, today])) } }
}

/** Me's badge shelf: the earned ones (with their day), then the next `upNext` still locked. */
export function badgeShelf(p: Pick<Progress, 'badges'>, upNext = 3) {
  const earned = BADGES.filter((b) => p.badges[b.id]).map((b) => ({ ...b, day: p.badges[b.id] }))
  const locked = BADGES.filter((b) => !p.badges[b.id]).slice(0, upNext)
  return { earned, locked, total: BADGES.length }
}

/** Units finished and whether the whole course is: `units` holds each unit's lesson keys. */
export function unitFacts(units: string[][], lessonsDone: string[]): Pick<BadgeFacts, 'unitsDone' | 'courseDone'> {
  const done = new Set(lessonsDone)
  const finished = units.filter((keys) => keys.length > 0 && keys.every((k) => done.has(k))).length
  return { unitsDone: finished, courseDone: units.length > 0 && finished === units.length }
}

/** Simulator firsts. A later season means an earlier one ran to the end. */
export function playgroundFacts(s: PlaygroundState): Pick<BadgeFacts, 'firstBuy' | 'firstPayout' | 'seasonDone' | 'goalMet' | 'challengeMet'> {
  const ended = s.status === 'ended'
  return {
    firstBuy: s.trades.length > 0 || s.season > 1,
    firstPayout: s.income > 0,
    seasonDone: ended || s.season > 1,
    goalMet: ended && goalStatus(s)?.met === true,
    challengeMet: challengeMet(s),
  }
}
