// Weekly challenges: one habit to practise in each simulated year (one real week, since time follows the real clock).
// Habits only, never returns or rankings, and judged from the trades alone, so a year that passed while the app was
// closed is still judged fairly. Meeting one earns a badge (src/domain/badges.ts).
import { CONFIG } from './config'
import type { PlaygroundState } from './engine'

export const CHALLENGE_IDS = ['low-fees', 'steady-hands', 'every-quarter', 'three-kinds'] as const
export type ChallengeId = (typeof CHALLENGE_IDS)[number]

/** Targets, in one place */
export const CHALLENGE = { maxFees: 10, maxHandTrades: 2, quarters: 4, kinds: 3 } as const

const W = CONFIG.weeksPerYear

/** The challenge of `year` (1-based) in `season`: rotates so the next week brings a different one. */
export const challengeFor = (season: number, year: number): ChallengeId => CHALLENGE_IDS[(season * 3 + year - 1) % CHALLENGE_IDS.length]

/** The simulated year now running (1 … seasonYears). */
export const currentYear = (s: PlaygroundState) => Math.min(CONFIG.seasonYears, Math.floor(s.tick / W) + 1)

export interface ChallengeStatus {
  id: ChallengeId
  year: number
  /** Where it stands: fees paid, hand trades made, quarters with a buy, or kinds bought */
  value: number
  target: number
  /** Met so far (for "under" challenges: still within the limit) */
  met: boolean
  /** The year is over, so `met` is final */
  final: boolean
}

/** How `year`'s challenge stands, from the trades made in that year. */
export function challengeStatus(s: PlaygroundState, year: number): ChallengeStatus {
  const id = challengeFor(s.season, year)
  const from = (year - 1) * W
  const to = year * W
  const trades = s.trades.filter((t) => t.tick >= from && t.tick < to)
  const final = s.status === 'ended' || s.tick >= to
  const at = (value: number, target: number, met: boolean): ChallengeStatus => ({ id, year, value, target, met, final })
  switch (id) {
    case 'low-fees': {
      const fees = Math.round(trades.reduce((n, t) => n + t.fee, 0) * 100) / 100
      return at(fees, CHALLENGE.maxFees, fees < CHALLENGE.maxFees)
    }
    case 'steady-hands': {
      const hand = trades.filter((t) => !t.auto).length
      return at(hand, CHALLENGE.maxHandTrades, hand <= CHALLENGE.maxHandTrades)
    }
    case 'every-quarter': {
      const quarters = new Set(trades.filter((t) => t.side === 'buy').map((t) => Math.floor((t.tick - from) / (W / 4)))).size
      return at(quarters, CHALLENGE.quarters, quarters >= CHALLENGE.quarters)
    }
    case 'three-kinds': {
      const kinds = new Set(trades.filter((t) => t.side === 'buy').map((t) => t.asset)).size
      return at(kinds, CHALLENGE.kinds, kinds >= CHALLENGE.kinds)
    }
  }
}

/** Has any finished year of this season met its challenge? Only years the player was invested in count (an "under"
 *  challenge is easy to meet by doing nothing at all). */
export function challengeMet(s: PlaygroundState): boolean {
  if (s.status === 'idle') return false
  const done = s.status === 'ended' ? CONFIG.seasonYears : Math.floor(s.tick / W)
  for (let year = 1; year <= done; year++) {
    if (year * W <= s.historyStart) continue // the season had not started for the player yet
    if (!s.trades.some((t) => t.tick < year * W)) continue // nothing invested by the end of that year
    if (challengeStatus(s, year).met) return true
  }
  return false
}
