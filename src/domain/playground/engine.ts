// The Playground as pure functions: (state, market) → state. The UI only draws it and dispatches to it.
// Money is play money, rounded to cents. Nothing here touches React, storage or the clock.
import { ASSET_IDS, CONFIG, WEEKS_PER_SEASON, type AssetId } from './config'
import type { EventId } from './events'
import { buildMarket, type Market } from './market'

export type Speed = 0 | 1 | 2 | 4
export type Status = 'idle' | 'running' | 'ended'

export interface Holding {
  units: number
  /** Dollars put in (what the units cost, fees not counted): "−6% since you bought" compares value with this */
  cost: number
}

export interface Trade {
  tick: number
  asset: AssetId
  side: 'buy' | 'sell'
  /** Dollars bought or sold, before the fee */
  amount: number
  fee: number
  price: number
}

export interface SeasonResult {
  season: number
  years: number
  /** Dollars moved in this season, and what it was worth at the end (cash out) */
  funded: number
  ended: number
  /** `ended` in the dollars of the season's first week (inflation taken out) */
  endedReal: number
  fees: number
  trades: number
  /** Worst fall from a peak, as a fraction (0.12 = 12%) */
  maxDrawdown: number
}

export interface PlaygroundState {
  /** 1, 2, 3 … */
  season: number
  seed: number
  /** Whether this season has market news (decided when it starts, from the player's unlocks) */
  eventsOn: boolean
  status: Status
  /** Weeks since the season began (0 … WEEKS_PER_SEASON) */
  tick: number
  speed: Speed
  cash: number
  holdings: Partial<Record<AssetId, Holding>>
  trades: Trade[]
  /** Net worth at the end of each week since the first buy: history[tick - startTick] */
  history: number[]
  /** The week `history[0]` belongs to */
  historyStart: number
  /** Dollars moved in this season, and fees paid */
  funded: number
  fees: number
  /** News already shown, and news waiting for the player to press Continue (time is paused until then) */
  seenEvents: number[]
  pendingEvent?: EventId
  past: SeasonResult[]
}

export const emptyPlayground: PlaygroundState = {
  season: 1,
  seed: 1,
  eventsOn: false,
  status: 'idle',
  tick: 0,
  speed: 0,
  cash: 0,
  holdings: {},
  trades: [],
  history: [],
  historyStart: 0,
  funded: 0,
  fees: 0,
  seenEvents: [],
  past: [],
}

export const cents = (n: number) => Math.round(n * 100) / 100
export const marketOf = (s: PlaygroundState): Market => buildMarket(s.seed, s.eventsOn)
export const priceOf = (s: PlaygroundState, asset: AssetId, market: Market = marketOf(s)) => market.price[asset][s.tick]

export function valueOf(s: PlaygroundState, asset: AssetId, market: Market = marketOf(s)): number {
  const h = s.holdings[asset]
  return h ? cents(h.units * priceOf(s, asset, market)) : 0
}

export function netWorth(s: PlaygroundState, market: Market = marketOf(s)): number {
  return cents(s.cash + ASSET_IDS.reduce((n, a) => n + valueOf(s, a, market), 0))
}

/** Net worth minus the dollars moved in: what the season has gained (or lost) so far. */
export const gain = (s: PlaygroundState, market?: Market) => cents(netWorth(s, market) - s.funded)

/** Money from the bank into the Playground (the caller takes it out of the bank). */
export function fund(s: PlaygroundState, amount: number): PlaygroundState {
  if (!(amount > 0)) return s
  const a = cents(amount)
  const next = { ...s, cash: cents(s.cash + a), funded: cents(s.funded + a) }
  return s.status === 'running' ? { ...next, history: replaceLast(s.history, netWorth(next)) } : next
}

const replaceLast = (h: number[], v: number) => (h.length ? [...h.slice(0, -1), v] : h)

/** The most you can buy for `cash`: the amount plus its 1% fee must fit. */
export const feeFor = (amount: number) => cents(amount * CONFIG.feeRate)
export function maxBuy(cash: number): number {
  const a = Math.floor((cash / (1 + CONFIG.feeRate)) * 100) / 100
  const more = cents(a + 0.01) // the fee rounds to cents, so one cent more often still fits
  return more + feeFor(more) <= cash + 1e-9 ? more : a
}

export type TradeResult = { ok: true; state: PlaygroundState; trade: Trade } | { ok: false; reason: 'amount' | 'cash' | 'holding' | 'ended' }

/** Buy `amount` dollars of `asset`. The first buy starts the clock. */
export function buy(s: PlaygroundState, asset: AssetId, amount: number): TradeResult {
  if (s.status === 'ended') return { ok: false, reason: 'ended' }
  const a = cents(amount)
  if (!(a > 0)) return { ok: false, reason: 'amount' }
  const fee = feeFor(a)
  if (a + fee > s.cash + 1e-9) return { ok: false, reason: 'cash' }
  const price = priceOf(s, asset)
  const held = s.holdings[asset] ?? { units: 0, cost: 0 }
  const trade: Trade = { tick: s.tick, asset, side: 'buy', amount: a, fee, price }
  const next: PlaygroundState = {
    ...s,
    cash: cents(s.cash - a - fee),
    holdings: { ...s.holdings, [asset]: { units: held.units + a / price, cost: cents(held.cost + a) } },
    trades: [...s.trades, trade],
    fees: cents(s.fees + fee),
  }
  return { ok: true, trade, state: s.status === 'idle' ? start(next) : { ...next, history: replaceLast(next.history, netWorth(next)) } }
}

/** Sell `amount` dollars' worth of `asset` (at most what you hold). */
export function sell(s: PlaygroundState, asset: AssetId, amount: number): TradeResult {
  if (s.status === 'ended') return { ok: false, reason: 'ended' }
  const held = s.holdings[asset]
  if (!held) return { ok: false, reason: 'holding' }
  const price = priceOf(s, asset)
  const value = held.units * price
  const a = Math.min(cents(amount), cents(value))
  if (!(a > 0)) return { ok: false, reason: 'amount' }
  const fee = feeFor(a)
  const fraction = Math.min(1, a / value)
  const holdings = { ...s.holdings }
  if (fraction >= 0.9999) delete holdings[asset]
  else holdings[asset] = { units: held.units * (1 - fraction), cost: cents(held.cost * (1 - fraction)) }
  const trade: Trade = { tick: s.tick, asset, side: 'sell', amount: a, fee, price }
  const next: PlaygroundState = { ...s, cash: cents(s.cash + a - fee), holdings, trades: [...s.trades, trade], fees: cents(s.fees + fee) }
  return { ok: true, trade, state: { ...next, history: replaceLast(next.history, netWorth(next)) } }
}

/** The first buy: time starts, at 1x, and the chart begins. */
function start(s: PlaygroundState): PlaygroundState {
  return { ...s, status: 'running', speed: 1, historyStart: s.tick, history: [netWorth(s)] }
}

export function setSpeed(s: PlaygroundState, speed: Speed): PlaygroundState {
  return s.status === 'running' && s.speed !== speed ? { ...s, speed } : s
}

/** One week passes. Does nothing while news is waiting, or before the season starts or after it ends. */
export function advance(s: PlaygroundState): PlaygroundState {
  if (s.status !== 'running' || s.pendingEvent || s.tick >= WEEKS_PER_SEASON) return s
  const market = marketOf(s)
  const tick = s.tick + 1
  const moved = { ...s, tick }
  const event = market.events.find((e) => e.tick === tick && !s.seenEvents.includes(e.tick))
  const next: PlaygroundState = { ...moved, history: [...s.history, netWorth(moved, market)] }
  if (event) {
    next.seenEvents = [...s.seenEvents, event.tick]
    next.pendingEvent = event.id
  }
  if (tick >= WEEKS_PER_SEASON) {
    next.status = 'ended'
    next.speed = 0
  }
  return next
}

/** The player pressed Continue on the news: time runs again. */
export const dismissEvent = (s: PlaygroundState): PlaygroundState => (s.pendingEvent ? { ...s, pendingEvent: undefined } : s)

/** Money can only leave the Playground between seasons: before the first buy, or after the season ends. */
export const canWithdraw = (s: PlaygroundState) => s.status !== 'running'

/** Worst fall from a peak so far, as a fraction (0.12 = 12%), and the week it bottomed out. */
export function maxDrawdown(history: number[], start = 0): { fall: number; tick: number } {
  let peak = -Infinity
  let worst = { fall: 0, tick: start }
  history.forEach((v, i) => {
    peak = Math.max(peak, v)
    const fall = peak > 0 ? (peak - v) / peak : 0
    if (fall > worst.fall) worst = { fall, tick: start + i }
  })
  return worst
}

/** The net worth line in the dollars of the season's first week (inflation taken out), one value per history point. */
export const realHistory = (s: PlaygroundState, market: Market = marketOf(s)) =>
  s.history.map((v, i) => cents(v / (market.cpi[s.historyStart + i] / market.cpi[s.historyStart])))

export interface CashOut {
  /** What goes back to the bank */
  amount: number
  /** The fresh, idle Playground for the next season */
  state: PlaygroundState
}

/** Leave the Playground: everything is valued at today's prices (no fee), a finished season goes into `past`, and
 *  a new idle season starts with `nextSeed`. Only between seasons (`canWithdraw`). */
export function cashOut(s: PlaygroundState, nextSeed: number, nextEventsOn: boolean): CashOut | null {
  if (!canWithdraw(s)) return null
  const market = marketOf(s)
  const amount = netWorth(s, market)
  const past = [...s.past]
  if (s.status === 'ended') {
    const real = realHistory(s, market)
    past.push({
      season: s.season,
      years: CONFIG.seasonYears,
      funded: s.funded,
      ended: amount,
      endedReal: real[real.length - 1] ?? amount,
      fees: s.fees,
      trades: s.trades.length,
      maxDrawdown: maxDrawdown(s.history).fall,
    })
  }
  const nextSeason = s.status === 'ended' ? s.season + 1 : s.season
  return { amount, state: { ...emptyPlayground, season: nextSeason, seed: nextSeed, eventsOn: nextEventsOn, past } }
}
