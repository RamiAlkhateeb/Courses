import { CONFIG } from './config'
import { marketOf, type PlaygroundState } from './engine'
import type { EventId } from './events'
import type { Market } from './market'

export interface YearRecap {
  year: number
  /** Net worth at the start and end of the year (the start is the first week on the chart if the season began later) */
  start: number
  end: number
  /** The year's news, oldest first */
  news: EventId[]
  /** The US 500 Index ETF's price move and inflation over the same weeks (fractions: 0.08 = 8%) */
  us500: number
  inflation: number
}

const W = CONFIG.weeksPerYear

/** Whole simulated years gone this season (0 … seasonYears). */
export const yearsDone = (s: PlaygroundState) => Math.min(CONFIG.seasonYears, Math.floor(s.tick / W))

/** What happened in simulated `year` (1-based): money, news, the market and prices. Derived, never advice. */
export function yearRecap(s: PlaygroundState, year: number, market: Market = marketOf(s)): YearRecap {
  const from = Math.max(s.historyStart, (year - 1) * W)
  const to = Math.min(s.tick, year * W)
  const at = (tick: number) => s.history[Math.max(0, Math.min(s.history.length - 1, tick - s.historyStart))] ?? 0
  return {
    year,
    start: at(from),
    end: at(to),
    news: market.events.filter((e) => e.tick > from && e.tick <= to && s.seenEvents.includes(e.tick)).map((e) => e.id),
    us500: market.price.us500[to] / market.price.us500[from] - 1,
    inflation: market.cpi[to] / market.cpi[from] - 1,
  }
}

/** The year whose recap is waiting: the latest finished year not seen yet. Not after the last year (the season
 *  summary covers it), and not for years before the season started. */
export function pendingRecap(s: PlaygroundState): number | null {
  if (s.status !== 'running') return null
  const done = yearsDone(s)
  return done > s.recapSeen && done >= 1 && done * W > s.historyStart ? done : null
}

/** The player closed the recap: every finished year counts as seen (several years can pass while the app is closed). */
export const seeRecap = (s: PlaygroundState): PlaygroundState => ({ ...s, recapSeen: yearsDone(s) })

/** Net worth seven real days ago (seven simulated years, the time follows the real clock), or the first point on the
 *  chart if the season is younger: the "portfolio this week" figure on Me. Null before the season starts. */
export function netWorthWeekAgo(s: PlaygroundState): number | null {
  if (s.status === 'idle' || s.history.length === 0) return null
  const weekAgo = s.tick - 7 * CONFIG.weeksPerYear
  return s.history[Math.max(0, weekAgo - s.historyStart)]
}
