import { emptyPlayground, type PlaygroundState } from './engine'

const isRecord = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v)
const num = (v: unknown, d: number) => (typeof v === 'number' && Number.isFinite(v) ? v : d)
const numbers = (v: unknown) => (Array.isArray(v) ? v.filter((x): x is number => typeof x === 'number' && Number.isFinite(x)) : [])

/** Reads a saved Playground, tolerating garbage and missing fields (anything unreadable is a fresh, empty Playground). */
export function parsePlayground(raw: string | null): PlaygroundState {
  if (!raw) return emptyPlayground
  try {
    const d = JSON.parse(raw) as unknown
    if (!isRecord(d)) return emptyPlayground
    const status = d.status === 'running' || d.status === 'ended' ? d.status : 'idle'
    const speed = d.speed === 1 || d.speed === 2 || d.speed === 3 ? d.speed : 0
    const holdings: PlaygroundState['holdings'] = {}
    if (isRecord(d.holdings)) {
      for (const id of ['savings', 'index', 'bonds', 'nile'] as const) {
        const h = d.holdings[id]
        if (isRecord(h) && num(h.units, 0) > 0) holdings[id] = { units: num(h.units, 0), cost: num(h.cost, 0) }
      }
    }
    const events = ['rates-rise', 'rates-fall', 'recession', 'scandal', 'inflation', 'boom']
    return {
      season: Math.max(1, Math.floor(num(d.season, 1))),
      seed: Math.floor(num(d.seed, 1)),
      status,
      tick: Math.max(0, Math.floor(num(d.tick, 0))),
      speed,
      cash: Math.max(0, num(d.cash, 0)),
      holdings,
      trades: Array.isArray(d.trades) ? (d.trades.filter(isRecord) as unknown as PlaygroundState['trades']) : [],
      history: numbers(d.history),
      historyStart: Math.max(0, Math.floor(num(d.historyStart, 0))),
      funded: Math.max(0, num(d.funded, 0)),
      fees: Math.max(0, num(d.fees, 0)),
      seenEvents: numbers(d.seenEvents),
      ...(typeof d.pendingEvent === 'string' && events.includes(d.pendingEvent) ? { pendingEvent: d.pendingEvent as PlaygroundState['pendingEvent'] } : {}),
    }
  } catch {
    return emptyPlayground
  }
}
