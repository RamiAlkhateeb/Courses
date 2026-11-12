// "While you were away": what the simulator did since the player last looked. Time follows the real clock, so the
// portfolio moves while the app is closed; Learn says what happened, at most once a day. Pure; the snapshot is kept
// in src/state/away.ts. Derived from the season, never advice.
import { netWorth, type PlaygroundState } from './engine'

/** What the player saw last time: taken when they open the portfolio or close the card. */
export interface AwaySnapshot {
  season: number
  tick: number
  netWorth: number
  income: number
  /** The local day the card was last closed or acted on ('' = never): it shows at most once a day */
  day: string
}

/** Simulated weeks that must pass before the card is worth showing (4 weeks: about 13 real hours) */
export const AWAY_MIN_WEEKS = 4

export const snapshotOf = (s: PlaygroundState, day: string): AwaySnapshot => ({ season: s.season, tick: s.tick, netWorth: netWorth(s), income: s.income, day })

export interface AwaySummary {
  /** Simulated weeks since the snapshot */
  weeks: number
  /** Market moves since then (money moved in from lessons is not counted as growth) */
  change: number
  /** Dividends, rent and interest paid since then */
  income: number
  /** News stories waiting to be read */
  news: number
}

/** What happened since `snap`, or null when there is nothing to say: no snapshot, a different or idle season, too little
 *  time, or the card was already seen today. */
export function awaySummary(snap: AwaySnapshot | null, s: PlaygroundState, today: string): AwaySummary | null {
  if (!snap || snap.day === today || s.status === 'idle' || snap.season !== s.season) return null
  const weeks = s.tick - snap.tick
  if (weeks < AWAY_MIN_WEEKS) return null
  const movedIn = s.deposits.filter((d) => d.tick > snap.tick).reduce((n, d) => n + d.amount, 0)
  return {
    weeks,
    change: Math.round((netWorth(s) - snap.netWorth - movedIn) * 100) / 100,
    income: Math.round((s.income - snap.income) * 100) / 100,
    news: s.newsQueue.length,
  }
}

/** The portfolio row on Learn: is there something new to see (unread news or a yearly recap)? */
export const somethingNew = (s: PlaygroundState, recapWaiting: boolean) => s.status === 'running' && (s.newsQueue.length > 0 || recapWaiting)
