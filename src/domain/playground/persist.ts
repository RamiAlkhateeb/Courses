import { ASSET_IDS, CONFIG, DAY_MS, GOAL_IDS, MS_PER_WEEK, WEEKS_PER_SEASON, type AssetId, type GoalId } from './config'
import { emptyPlayground, type PlaygroundState } from './engine'
import { EVENT_IDS } from './events'

const isRecord = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v)
const num = (v: unknown, d: number) => (typeof v === 'number' && Number.isFinite(v) ? v : d)
const numbers = (v: unknown) => (Array.isArray(v) ? v.filter((x): x is number => typeof x === 'number' && Number.isFinite(x)) : [])

/** Reads a saved Playground, tolerating garbage and missing fields (anything unreadable is a fresh, empty Playground).
 *  Seasons saved before time followed the real clock (no `startedAt`, a `speed`, a `pendingEvent`) carry on from the
 *  week they were at: `now` places their start in the past. Seasons saved at another pace (before one real week was one
 *  year, one real day was) keep the week they had reached by `now`, and go on at today's pace. */
export function parsePlayground(raw: string | null, now: number = Date.now()): PlaygroundState {
  if (!raw) return emptyPlayground
  try {
    const d = JSON.parse(raw) as unknown
    if (!isRecord(d)) return emptyPlayground
    const status = d.status === 'running' || d.status === 'ended' ? d.status : 'idle'
    const holdings: PlaygroundState['holdings'] = {}
    if (isRecord(d.holdings)) {
      for (const id of ASSET_IDS) {
        const h = d.holdings[id]
        if (isRecord(h) && num(h.units, 0) > 0) holdings[id] = { units: num(h.units, 0), cost: num(h.cost, 0) }
      }
    }
    const tick = Math.max(0, Math.floor(num(d.tick, 0)))
    // The start, measured at today's pace. Saves from before `msPerYear` ran at one real day per year.
    const pace = num(d.msPerYear, DAY_MS)
    const saved = typeof d.startedAt === 'number' && Number.isFinite(d.startedAt)
    let startedAt = saved ? (d.startedAt as number) : status === 'idle' ? 0 : now - tick * MS_PER_WEEK
    if (saved && status === 'running' && pace !== CONFIG.msPerYear && pace > 0) {
      const reached = Math.max(tick, Math.min(WEEKS_PER_SEASON, Math.floor((now - startedAt) / (pace / CONFIG.weeksPerYear) + 1e-9)))
      startedAt = now - reached * MS_PER_WEEK
    }
    const seenEvents = numbers(d.seenEvents)
    // An old season's unread story was its `pendingEvent`: the last news it saw
    const oldPending = typeof d.pendingEvent === 'string' && (EVENT_IDS as string[]).includes(d.pendingEvent) && seenEvents.length ? [seenEvents[seenEvents.length - 1]] : []
    return {
      season: Math.max(1, Math.floor(num(d.season, 1))),
      seed: Math.floor(num(d.seed, 1)),
      status,
      tick,
      startedAt,
      msPerYear: CONFIG.msPerYear,
      cash: Math.max(0, num(d.cash, 0)),
      holdings,
      trades: Array.isArray(d.trades) ? (d.trades.filter(isRecord) as unknown as PlaygroundState['trades']) : [],
      history: numbers(d.history),
      historyStart: Math.max(0, Math.floor(num(d.historyStart, 0))),
      funded: Math.max(0, num(d.funded, 0)),
      fees: Math.max(0, num(d.fees, 0)),
      seenEvents,
      newsQueue: Array.isArray(d.newsQueue) ? numbers(d.newsQueue).filter((t) => seenEvents.includes(t)) : oldPending,
      // Seasons from before the deposit log: all the money as if it came in when the season started
      deposits: Array.isArray(d.deposits)
        ? d.deposits.filter(isRecord).map((x) => ({ tick: Math.max(0, Math.floor(num(x.tick, 0))), amount: num(x.amount, 0) })).filter((x) => x.amount > 0)
        : num(d.funded, 0) > 0
          ? [{ tick: Math.max(0, Math.floor(num(d.historyStart, 0))), amount: num(d.funded, 0) }]
          : [],
      autoInvest:
        isRecord(d.autoInvest) && (ASSET_IDS as unknown[]).includes(d.autoInvest.asset) && num(d.autoInvest.amount, 0) > 0
          ? { asset: d.autoInvest.asset as AssetId, amount: num(d.autoInvest.amount, 0) }
          : null,
      reinvest: d.reinvest !== false,
      income: Math.max(0, num(d.income, 0)),
      goal: (GOAL_IDS as unknown[]).includes(d.goal) ? (d.goal as GoalId) : null,
      // Seasons from before the yearly recap: the years already gone count as seen
      recapSeen: Math.max(0, Math.floor(num(d.recapSeen, Math.floor(tick / CONFIG.weeksPerYear)))),
    }
  } catch {
    return emptyPlayground
  }
}
