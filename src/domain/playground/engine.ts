// The Playground as pure functions: (state, market) → state. The UI only draws it and dispatches to it.
// Money is play money, rounded to cents. Nothing here touches React, storage or the clock.
import { ASSET_IDS, ASSETS, CONFIG, MS_PER_WEEK, WEEKS_PER_SEASON, type AssetId, type GoalId } from './config'
import type { EventId } from './events'
import { buildMarket, type Market } from './market'

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
  /** Bought by auto-invest, not by hand */
  auto?: true
}

/** A monthly buy the player set up: `amount` dollars of `asset`, every `CONFIG.autoInvestEveryWeeks` weeks. */
export interface AutoInvest {
  asset: AssetId
  amount: number
}

export interface PlaygroundState {
  /** 1, 2, 3 … */
  season: number
  seed: number
  status: Status
  /** Weeks since the season began (0 … WEEKS_PER_SEASON) */
  tick: number
  /** When the first buy started the season (epoch ms). Time then follows the real clock: one real week = one year. */
  startedAt: number
  /** The pace `startedAt` was measured at (real ms per simulated year): a season saved at an older pace is rebased
   *  when read (parsePlayground), so it keeps the week it had reached */
  msPerYear: number
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
  /** News that has landed (its week), and the stories the player has not read yet (time never waits for them) */
  seenEvents: number[]
  newsQueue: number[]
  /** Money moved in, and the week it came: what the "compare with" lines replay */
  deposits: { tick: number; amount: number }[]
  autoInvest: AutoInvest | null
  /** Dividends, rent and bond interest buy more of the same (no fee) instead of landing in cash */
  reinvest: boolean
  /** Dividends, rent and interest paid out this season */
  income: number
  /** The goal the player set for this season (checked on the summary) */
  goal: GoalId | null
  /** Simulated years whose recap card the player has seen */
  recapSeen: number
}

export const emptyPlayground: PlaygroundState = {
  season: 1,
  seed: 1,
  status: 'idle',
  tick: 0,
  startedAt: 0,
  msPerYear: CONFIG.msPerYear,
  cash: 0,
  holdings: {},
  trades: [],
  history: [],
  historyStart: 0,
  funded: 0,
  fees: 0,
  seenEvents: [],
  newsQueue: [],
  deposits: [],
  autoInvest: null,
  reinvest: true,
  income: 0,
  goal: null,
  recapSeen: 0,
}

export const cents = (n: number) => Math.round(n * 100) / 100
export const marketOf = (s: PlaygroundState): Market => buildMarket(s.seed)
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

/** Money from the bank into the Playground: the starting wallet, and lesson rewards earned mid-season (the caller takes it out of the bank). */
export function fund(s: PlaygroundState, amount: number): PlaygroundState {
  if (!(amount > 0)) return s
  const a = cents(amount)
  const next = { ...s, cash: cents(s.cash + a), funded: cents(s.funded + a), deposits: [...s.deposits, { tick: s.tick, amount: a }] }
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

/** Buy `amount` dollars of `asset` at time `now` (epoch ms). The first buy starts the clock. */
export function buy(s: PlaygroundState, asset: AssetId, amount: number, now: number): TradeResult {
  const r = buyNow(s, asset, amount)
  if (!r.ok) return r
  return { ...r, state: s.status === 'idle' ? start(r.state, now) : { ...r.state, history: replaceLast(r.state.history, netWorth(r.state)) } }
}

/** The buy itself, at this week's price (the chart is the caller's job). */
function buyNow(s: PlaygroundState, asset: AssetId, amount: number, auto = false): TradeResult {
  if (s.status === 'ended') return { ok: false, reason: 'ended' }
  const a = cents(amount)
  if (!(a > 0)) return { ok: false, reason: 'amount' }
  const fee = feeFor(a)
  if (a + fee > s.cash + 1e-9) return { ok: false, reason: 'cash' }
  const price = priceOf(s, asset)
  const held = s.holdings[asset] ?? { units: 0, cost: 0 }
  const trade: Trade = { tick: s.tick, asset, side: 'buy', amount: a, fee, price, ...(auto ? { auto: true as const } : {}) }
  const state: PlaygroundState = {
    ...s,
    cash: cents(s.cash - a - fee),
    holdings: { ...s.holdings, [asset]: { units: held.units + a / price, cost: cents(held.cost + a) } },
    trades: [...s.trades, trade],
    fees: cents(s.fees + fee),
  }
  return { ok: true, trade, state }
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

/** The first buy: time starts now, on the real clock, and the chart begins. */
function start(s: PlaygroundState, now: number): PlaygroundState {
  return { ...s, status: 'running', startedAt: now - s.tick * MS_PER_WEEK, historyStart: s.tick, history: [netWorth(s)] }
}

/** The week the season has reached at time `now` (one real week = one simulated year). */
export const weekAt = (s: PlaygroundState, now: number) =>
  s.status === 'idle' ? s.tick : Math.max(s.tick, Math.min(WEEKS_PER_SEASON, Math.floor((now - s.startedAt) / MS_PER_WEEK + 1e-9)))

/** Brings the season up to time `now`, week by week (so history and news are the same as if you had watched). */
export function catchUp(s: PlaygroundState, now: number): PlaygroundState {
  const target = weekAt(s, now)
  let next = s
  while (next.status === 'running' && next.tick < target) next = advance(next)
  return next
}

/** Real milliseconds until the next market update (the next simulated week), or 0 when the season is not running. */
export const msToNextWeek = (s: PlaygroundState, now: number) =>
  s.status !== 'running' ? 0 : Math.max(0, s.startedAt + (s.tick + 1) * MS_PER_WEEK - now)

/** One week passes. Does nothing before the season starts or after it ends. News lands in the queue; time never waits. */
export function advance(s: PlaygroundState): PlaygroundState {
  if (s.status !== 'running' || s.tick >= WEEKS_PER_SEASON) return s
  const market = marketOf(s)
  const tick = s.tick + 1
  let moved: PlaygroundState = { ...s, tick }
  if (tick % CONFIG.payoutEveryWeeks === 0) moved = payout(moved, market)
  if (s.autoInvest && tick % CONFIG.autoInvestEveryWeeks === 0 && tick < WEEKS_PER_SEASON) { // not in the last week: a fee for nothing
    const r = buyNow(moved, s.autoInvest.asset, s.autoInvest.amount, true)
    if (r.ok) moved = r.state // not enough cash: this month is skipped
  }
  const event = market.events.find((e) => e.tick === tick && !s.seenEvents.includes(e.tick))
  const next: PlaygroundState = { ...moved, history: [...s.history, netWorth(moved, market)] }
  if (event) {
    next.seenEvents = [...s.seenEvents, event.tick]
    next.newsQueue = [...s.newsQueue, event.tick]
  }
  if (tick >= WEEKS_PER_SEASON) next.status = 'ended'
  return next
}

/** A year's payout rate of an asset in week `tick`: its dividend yield, or for bonds the interest rate. */
export const yieldOf = (asset: AssetId, tick: number, market: Market) => (asset === 'bonds' ? market.rate[tick] : (ASSETS[asset].yield ?? 0))

/** The quarter's dividends, rent and bond interest: into cash, or (with `reinvest`) more of the same, without a fee. */
function payout(s: PlaygroundState, market: Market): PlaygroundState {
  const share = CONFIG.payoutEveryWeeks / CONFIG.weeksPerYear
  const holdings = { ...s.holdings }
  let cash = s.cash
  let income = 0
  for (const id of ASSET_IDS) {
    const h = holdings[id]
    const rate = yieldOf(id, s.tick, market)
    if (!h || !(rate > 0)) continue
    const price = market.price[id][s.tick]
    const paid = cents(h.units * price * rate * share)
    if (!(paid > 0)) continue
    income += paid
    if (s.reinvest) holdings[id] = { ...h, units: h.units + paid / price }
    else cash += paid
  }
  return income > 0 ? { ...s, holdings, cash: cents(cash), income: cents(s.income + income) } : s
}

export const setAutoInvest = (s: PlaygroundState, autoInvest: AutoInvest | null): PlaygroundState => ({ ...s, autoInvest })
export const setReinvest = (s: PlaygroundState, reinvest: boolean): PlaygroundState => ({ ...s, reinvest })
export const setGoal = (s: PlaygroundState, goal: GoalId | null): PlaygroundState => ({ ...s, goal })

/** What the same money would be worth all in `asset`: each deposit bought (with the 1% fee) the week it came in, or
 *  when the season started, and held, payouts reinvested. One value per point of `history`, for the chart. */
export function benchmark(s: PlaygroundState, asset: AssetId, market: Market = marketOf(s)): number[] {
  const p = market.price[asset]
  const y = ASSETS[asset].yield ?? 0
  return s.history.map((_, i) => {
    const week = s.historyStart + i
    let v = 0
    for (const d of s.deposits) {
      const from = Math.max(d.tick, s.historyStart)
      if (from <= week) v += (d.amount / (1 + CONFIG.feeRate)) * (p[week] / p[from]) * Math.exp((y * (week - from)) / CONFIG.weeksPerYear)
    }
    return cents(v)
  })
}

/** The player read the oldest unread story. */
export const readNews = (s: PlaygroundState): PlaygroundState => (s.newsQueue.length ? { ...s, newsQueue: s.newsQueue.slice(1) } : s)

/** The unread story at the front of the queue, if any. */
export function nextNews(s: PlaygroundState, market: Market = marketOf(s)): { tick: number; id: EventId } | undefined {
  const tick = s.newsQueue[0]
  return tick === undefined ? undefined : market.events.find((e) => e.tick === tick)
}

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

/** Leave the Playground: everything is valued at today's prices (no fee), and a new idle season starts with `nextSeed`.
 *  Only between seasons (`canWithdraw`). */
export function cashOut(s: PlaygroundState, nextSeed: number): CashOut | null {
  if (!canWithdraw(s)) return null
  const amount = netWorth(s)
  // Auto-invest, reinvest and the goal are the player's choices: they carry into the next season.
  const state = { ...emptyPlayground, season: s.status === 'ended' ? s.season + 1 : s.season, seed: nextSeed, autoInvest: s.autoInvest, reinvest: s.reinvest, goal: s.goal }
  return { amount, state }
}
