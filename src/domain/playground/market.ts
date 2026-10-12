import { ASSET_IDS, ASSETS, CONFIG, WEEKS_PER_SEASON, type AssetId } from './config'
import { EVENT_IDS, EVENTS, type EventId } from './events'
import { normal, uniform } from './prng'

export interface ScheduledEvent {
  /** The week the news lands in (1-based: it moves prices from this week on) */
  tick: number
  id: EventId
}

/** One whole season of fictional markets, derived from the seed alone (the player's trades never move prices). */
export interface Market {
  seed: number
  /** price[asset][week], week 0..WEEKS_PER_SEASON */
  price: Record<AssetId, number[]>
  /** Annual rates and the price level (cpi[0] = 1), per week */
  rate: number[]
  inflation: number[]
  cpi: number[]
  events: ScheduledEvent[]
}

const STREAM = { rate: 0, inflation: 1, bonds: 2, index: 3, nile: 4, schedule: 9 }
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v))

/** When the season's news lands and what it is: spread over the season, never repeating a kind. */
export function scheduleEvents(seed: number): ScheduledEvent[] {
  const n = CONFIG.eventsPerSeason
  const slot = WEEKS_PER_SEASON / (n + 1)
  const pool = [...EVENT_IDS]
  const out: ScheduledEvent[] = []
  for (let i = 0; i < n; i++) {
    const jitter = (uniform(seed, i, STREAM.schedule) - 0.5) * slot * 0.5
    const tick = Math.round(slot * (i + 1) + jitter)
    const pick = Math.floor(uniform(seed, i + 100, STREAM.schedule) * pool.length)
    out.push({ tick, id: pool.splice(pick, 1)[0] })
  }
  return out
}

const memo = new Map<string, Market>()

/** The market for a seed. `withEvents: false` is a season with no news (the player has not unlocked it yet). */
export function buildMarket(seed: number, withEvents: boolean): Market {
  const key = `${seed}:${withEvents}`
  const hit = memo.get(key)
  if (hit) return hit
  const T = WEEKS_PER_SEASON
  const W = CONFIG.weeksPerYear
  const events = withEvents ? scheduleEvents(seed) : []
  const price = {} as Record<AssetId, number[]>
  for (const id of ASSET_IDS) price[id] = [ASSETS[id].startPrice]
  const rate = [CONFIG.startRate]
  const inflation = [CONFIG.startInflation]
  const cpi = [1]

  for (let t = 1; t <= T; t++) {
    const ev = events.find((e) => e.tick === t)
    const e = ev ? EVENTS[ev.id] : undefined
    const r0 = rate[t - 1]
    const r1 = clamp(
      r0 + CONFIG.rateWeeklyVol * normal(seed, t, STREAM.rate) + CONFIG.reversion * (CONFIG.startRate - r0) / W + (e?.rate ?? 0),
      0.005,
      0.09,
    )
    rate.push(r1)
    const i1 = clamp(
      inflation[t - 1] + CONFIG.inflationWeeklyVol * normal(seed, t, STREAM.inflation) + CONFIG.reversion * (CONFIG.startInflation - inflation[t - 1]) + (e?.inflation ?? 0),
      0,
      0.1,
    )
    inflation.push(i1)
    cpi.push(cpi[t - 1] * (1 + i1 / W))

    price.savings.push(price.savings[t - 1] * (1 + Math.max(CONFIG.savingsFloor, r1 - CONFIG.savingsSpread) / W))
    const bondReturn = r0 / W - CONFIG.bondDuration * (r1 - r0) + (CONFIG.bondWeeklyNoise / Math.sqrt(W)) * normal(seed, t, STREAM.bonds) + (e?.shock.bonds ?? 0)
    price.bonds.push(price.bonds[t - 1] * Math.exp(bondReturn))
    for (const id of ['index', 'nile'] as const) {
      const a = ASSETS[id]
      const logReturn = (a.mean - (a.vol * a.vol) / 2) / W + (a.vol / Math.sqrt(W)) * normal(seed, t, STREAM[id]) + (e?.shock[id] ?? 0)
      price[id].push(price[id][t - 1] * Math.exp(logReturn))
    }
  }
  const market: Market = { seed, price, rate, inflation, cpi, events }
  if (memo.size > 8) memo.clear()
  memo.set(key, market)
  return market
}
