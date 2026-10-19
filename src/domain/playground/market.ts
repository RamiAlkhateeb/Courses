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

const STREAM = { rate: 0, inflation: 1, bonds: 2, index: 3, nile: 4, gold: 5, us500: 6, reit: 7, tech: 8, schedule: 9, crypto: 10 }
/** The assets that move partly with world stocks (`beta`): each shares the world-stocks weekly shock, plus its own. */
const FOLLOWERS = ['gold', 'us500', 'reit', 'tech', 'crypto'] as const
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

const memo = new Map<number, Market>()

/** The market for a seed (every season has market news). */
export function buildMarket(seed: number): Market {
  const hit = memo.get(seed)
  if (hit) return hit
  const T = WEEKS_PER_SEASON
  const W = CONFIG.weeksPerYear
  const events = scheduleEvents(seed)
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
    // Bonds pay the rate as interest in cash every quarter (see `payout` in engine.ts), so the price carries only the
    // rate moves and noise. Assets with a `yield` likewise drift up by that much less.
    const bondReturn = -CONFIG.bondDuration * (r1 - r0) + (CONFIG.bondWeeklyNoise / Math.sqrt(W)) * normal(seed, t, STREAM.bonds) + (e?.shock.bonds ?? 0)
    price.bonds.push(price.bonds[t - 1] * Math.exp(bondReturn))
    for (const id of ['index', 'nile'] as const) {
      const a = ASSETS[id]
      const logReturn = (a.mean - (a.yield ?? 0) - (a.vol * a.vol) / 2) / W + (a.vol / Math.sqrt(W)) * normal(seed, t, STREAM[id]) + (e?.shock[id] ?? 0)
      price[id].push(price[id][t - 1] * Math.exp(logReturn))
    }
    const marketShock = normal(seed, t, STREAM.index) // the same world-stocks move as `index` this week
    const marketVol = ASSETS.index.vol
    for (const id of FOLLOWERS) {
      const a = ASSETS[id]
      const beta = a.beta ?? 0
      const totalVar = beta * beta * marketVol * marketVol + a.vol * a.vol
      const logReturn =
        (a.mean - (a.yield ?? 0) - totalVar / 2) / W +
        ((beta * marketVol) / Math.sqrt(W)) * marketShock +
        (a.vol / Math.sqrt(W)) * normal(seed, t, STREAM[id]) +
        (a.rateSensitivity ?? 0) * (r1 - r0) +
        (e?.shock[id] ?? 0)
      price[id].push(price[id][t - 1] * Math.exp(logReturn))
    }
  }
  const market: Market = { seed, price, rate, inflation, cpi, events }
  if (memo.size > 8) memo.clear()
  memo.set(seed, market)
  return market
}
