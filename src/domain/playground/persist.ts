import { ASSET_IDS, MS_PER_WEEK } from './config'
import { emptyPlayground, type PlaygroundState } from './engine'
import { EVENT_IDS } from './events'

const isRecord = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v)
const num = (v: unknown, d: number) => (typeof v === 'number' && Number.isFinite(v) ? v : d)
const numbers = (v: unknown) => (Array.isArray(v) ? v.filter((x): x is number => typeof x === 'number' && Number.isFinite(x)) : [])

/** Reads a saved Playground, tolerating garbage and missing fields (anything unreadable is a fresh, empty Playground).
 *  Seasons saved before time followed the real clock (no `startedAt`, a `speed`, a `pendingEvent`) carry on from the
 *  week they were at: `now` places their start in the past. */
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
    const seenEvents = numbers(d.seenEvents)
    // An old season's unread story was its `pendingEvent`: the last news it saw
    const oldPending = typeof d.pendingEvent === 'string' && (EVENT_IDS as string[]).includes(d.pendingEvent) && seenEvents.length ? [seenEvents[seenEvents.length - 1]] : []
    return {
      season: Math.max(1, Math.floor(num(d.season, 1))),
      seed: Math.floor(num(d.seed, 1)),
      status,
      tick,
      startedAt: typeof d.startedAt === 'number' && Number.isFinite(d.startedAt) ? d.startedAt : status === 'idle' ? 0 : now - tick * MS_PER_WEEK,
      cash: Math.max(0, num(d.cash, 0)),
      holdings,
      trades: Array.isArray(d.trades) ? (d.trades.filter(isRecord) as unknown as PlaygroundState['trades']) : [],
      history: numbers(d.history),
      historyStart: Math.max(0, Math.floor(num(d.historyStart, 0))),
      funded: Math.max(0, num(d.funded, 0)),
      fees: Math.max(0, num(d.fees, 0)),
      seenEvents,
      newsQueue: Array.isArray(d.newsQueue) ? numbers(d.newsQueue).filter((t) => seenEvents.includes(t)) : oldPending,
    }
  } catch {
    return emptyPlayground
  }
}
