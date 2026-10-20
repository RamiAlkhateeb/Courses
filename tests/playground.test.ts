import { describe, expect, it } from 'vitest'
import { ASSET_IDS, ASSETS, CONFIG, DAY_MS, MS_PER_WEEK, WEEKS_PER_SEASON, type AssetId } from '../src/domain/playground/config'
import { advance, benchmark, buy as buyAt, canWithdraw, setAutoInvest, setReinvest, cashOut, catchUp, emptyPlayground, fund, gain, maxBuy, maxDrawdown, msToNextWeek, netWorth, nextNews, readNews, realHistory, sell, weekAt, type PlaygroundState } from '../src/domain/playground/engine'
import { direction, EVENTS } from '../src/domain/playground/events'
import { buildMarket } from '../src/domain/playground/market'
import { normal, uniform } from '../src/domain/playground/prng'
import { insights, unitsAt, wasSpread } from '../src/domain/playground/insights'
import { allocation, biggestBet } from '../src/domain/playground/risk'

const funded = (cash = 1000, seed = 7): PlaygroundState => fund({ ...emptyPlayground, seed }, cash)
/** The moment of the first buy in these tests (time follows the real clock from there) */
const T0 = 1_760_000_000_000
const YEAR = CONFIG.msPerYear
const buy = (s: PlaygroundState, asset: AssetId, amount: number) => buyAt(s, asset, amount, T0)
const must = <T extends { ok: boolean }>(r: T) => {
  expect(r.ok).toBe(true)
  return r as Extract<T, { ok: true }>
}

describe('seeded randomness', () => {
  it('gives the same numbers for the same seed, week and stream, and different ones otherwise', () => {
    expect(uniform(5, 10, 1)).toBe(uniform(5, 10, 1))
    expect(uniform(5, 10, 1)).not.toBe(uniform(6, 10, 1))
    expect(uniform(5, 10, 1)).not.toBe(uniform(5, 11, 1))
    expect(uniform(5, 10, 1)).not.toBe(uniform(5, 10, 2))
  })
  it('draws roughly standard normal numbers', () => {
    const xs = Array.from({ length: 4000 }, (_, i) => normal(3, i, 0))
    const mean = xs.reduce((a, b) => a + b, 0) / xs.length
    const sd = Math.sqrt(xs.reduce((a, b) => a + (b - mean) ** 2, 0) / xs.length)
    expect(Math.abs(mean)).toBeLessThan(0.08)
    expect(sd).toBeGreaterThan(0.93)
    expect(sd).toBeLessThan(1.07)
  })
})

describe('the market', () => {
  it('is the same for the same seed (so a season can be replayed) and differs between seeds', () => {
    const a = buildMarket(11)
    const b = buildMarket(11)
    expect(a.price.index).toEqual(b.price.index)
    expect(buildMarket(12).price.index).not.toEqual(a.price.index)
  })
  it('covers the whole season and starts at the configured prices', () => {
    const m = buildMarket(21)
    for (const id of ASSET_IDS) {
      expect(m.price[id]).toHaveLength(WEEKS_PER_SEASON + 1)
      expect(m.price[id][0]).toBe(ASSETS[id].startPrice)
    }
    expect(m.cpi[0]).toBe(1)
    expect(m.cpi[WEEKS_PER_SEASON]).toBeGreaterThan(1)
  })
  it('Safe Savings never loses', () => {
    for (let seed = 1; seed <= 20; seed++) {
      const p = buildMarket(seed).price.savings
      for (let t = 1; t < p.length; t++) expect(p[t]).toBeGreaterThanOrEqual(p[t - 1])
    }
  })
  it('index and single-company returns are in a believable range over many seasons', () => {
    let index = 0
    let nile = 0
    const n = 60
    for (let seed = 1; seed <= n; seed++) {
      const m = buildMarket(seed)
      index += Math.log(m.price.index[WEEKS_PER_SEASON] / m.price.index[0]) / CONFIG.seasonYears
      nile += Math.log(m.price.nile[WEEKS_PER_SEASON] / m.price.nile[0]) / CONFIG.seasonYears
    }
    expect(index / n).toBeGreaterThan(0.03)
    expect(index / n).toBeLessThan(0.11)
    expect(nile / n).toBeGreaterThan(-0.02)
    expect(nile / n).toBeLessThan(0.14)
  })
  it('has a few distinct news events spread over the season', () => {
    const ev = buildMarket(3).events
    expect(ev).toHaveLength(CONFIG.eventsPerSeason)
    expect(new Set(ev.map((e) => e.id)).size).toBe(ev.length)
    expect(ev.map((e) => e.tick)).toEqual(ev.map((e) => e.tick).sort((a, b) => a - b))
    expect(ev[0].tick).toBeGreaterThan(0)
    expect(ev[ev.length - 1].tick).toBeLessThan(WEEKS_PER_SEASON)
  })
  it('bonds fall when rates rise: the rates-rise week is a drop for bonds', () => {
    for (let seed = 1; seed <= 200; seed++) {
      const m = buildMarket(seed)
      const e = m.events.find((x) => x.id === 'rates-rise')
      if (!e) continue
      expect(m.price.bonds[e.tick]).toBeLessThan(m.price.bonds[e.tick - 1])
      return
    }
    throw new Error('no season had a rates-rise event')
  })
  it('points the news arrows the right way', () => {
    expect(direction(EVENTS['rates-rise'], 'savings')).toBe('up')
    expect(direction(EVENTS['rates-rise'], 'bonds')).toBe('down')
    expect(direction(EVENTS['rates-rise'], 'nile')).toBe('down')
    expect(direction(EVENTS['rates-rise'], 'index')).toBe('flat')
    expect(direction(EVENTS.scandal, 'nile')).toBe('down')
    expect(direction(EVENTS.scandal, 'index')).toBe('flat')
    expect(direction(EVENTS.recession, 'bonds')).toBe('up')
    expect(direction(EVENTS.recession, 'gold')).toBe('up')
    expect(direction(EVENTS.recession, 'tech')).toBe('down')
    expect(direction(EVENTS.recession, 'crypto')).toBe('down')
    expect(direction(EVENTS['rates-rise'], 'reit')).toBe('down')
    expect(direction(EVENTS.inflation, 'gold')).toBe('up')
    expect(direction(EVENTS['crypto-crash'], 'crypto')).toBe('down')
    expect(direction(EVENTS['crypto-crash'], 'savings')).toBe('flat')
  })
  it('has nine investments, safest first, with fictional ones marked', () => {
    expect(ASSET_IDS).toHaveLength(9)
    const risks = ASSET_IDS.map((id) => ASSETS[id].risk)
    expect(risks).toEqual([...risks].sort((a, b) => a - b))
    expect(ASSET_IDS.filter((id) => ASSETS[id].fictional)).toEqual(['nile', 'crypto'])
  })
  it('the new investments behave believably over many seasons', () => {
    const n = 80
    const yearly = (id: AssetId, m: ReturnType<typeof buildMarket>) => Math.log(m.price[id][WEEKS_PER_SEASON] / m.price[id][0]) / CONFIG.seasonYears
    const avg: Record<string, number> = {}
    const corr = { gold: 0, us500: 0 }
    for (let seed = 1; seed <= n; seed++) {
      const m = buildMarket(seed)
      for (const id of ['gold', 'us500', 'reit', 'tech', 'crypto'] as const) avg[id] = (avg[id] ?? 0) + yearly(id, m) / n
      // weekly moves: US 500 moves with world stocks, gold barely does
      const r = (id: AssetId) => m.price[id].slice(1).map((p, t) => Math.log(p / m.price[id][t]))
      const c = (a: number[], b: number[]) => {
        const ma = a.reduce((x, y) => x + y) / a.length
        const mb = b.reduce((x, y) => x + y) / b.length
        const cov = a.reduce((x, y, i) => x + (y - ma) * (b[i] - mb), 0)
        return cov / Math.sqrt(a.reduce((x, y) => x + (y - ma) ** 2, 0) * b.reduce((x, y) => x + (y - mb) ** 2, 0))
      }
      corr.us500 += c(r('us500'), r('index')) / n
      corr.gold += c(r('gold'), r('index')) / n
    }
    expect(avg.us500).toBeGreaterThan(0.02)
    expect(avg.us500).toBeLessThan(0.12)
    expect(avg.gold).toBeGreaterThan(-0.03)
    expect(avg.gold).toBeLessThan(0.09)
    expect(avg.crypto).toBeGreaterThan(-0.25)
    expect(avg.crypto).toBeLessThan(0.25)
    expect(corr.us500).toBeGreaterThan(0.8)
    expect(Math.abs(corr.gold)).toBeLessThan(0.3)
  })
  it('crypto swings far more than world stocks', () => {
    const m = buildMarket(5)
    const sd = (p: number[]) => {
      const r = p.slice(1).map((x, t) => Math.log(x / p[t]))
      const mean = r.reduce((a, b) => a + b) / r.length
      return Math.sqrt(r.reduce((a, b) => a + (b - mean) ** 2, 0) / r.length)
    }
    expect(sd(m.price.crypto)).toBeGreaterThan(3 * sd(m.price.index))
  })
})

describe('funding and trading', () => {
  it('fund adds cash and counts as money moved in', () => {
    const s = funded(1000)
    expect(s.cash).toBe(1000)
    expect(s.funded).toBe(1000)
    expect(fund(s, 0)).toBe(s)
    expect(fund(s, -5)).toBe(s)
  })
  it('charges a 1% fee on top of a buy, and cash left matches the design (186 − 150 − 1.50 = 34.50)', () => {
    const s = funded(186)
    const r = must(buy(s, 'index', 150))
    expect(r.trade.fee).toBe(1.5)
    expect(r.state.cash).toBe(34.5)
    expect(r.state.fees).toBe(1.5)
  })
  it('rejects what cannot be afforded, and the most you can buy still fits with its fee', () => {
    const s = funded(100)
    expect(buy(s, 'index', 100)).toEqual({ ok: false, reason: 'cash' }) // 100 + 1 fee > 100
    expect(maxBuy(100)).toBe(99.01)
    must(buy(s, 'index', maxBuy(100)))
    expect(buy(s, 'index', 0)).toEqual({ ok: false, reason: 'amount' })
  })
  it('the first buy starts the clock (now, on the real clock) and the chart; later buys do not restart it', () => {
    const s = funded(1000)
    expect(s.status).toBe('idle')
    const a = must(buy(s, 'savings', 100)).state
    expect(a.status).toBe('running')
    expect(a.startedAt).toBe(T0)
    expect(a.history).toHaveLength(1)
    const b = must(buyAt(a, 'index', 100, T0 + YEAR)).state
    expect(b.startedAt).toBe(T0)
    expect(b.history).toHaveLength(1)
  })
  it('selling returns the amount minus the 1% fee and keeps the cost basis in proportion', () => {
    let s = must(buy(funded(1000), 'index', 400)).state
    const value = 400 // nothing has moved yet
    const r = must(sell(s, 'index', value / 2))
    expect(r.trade.fee).toBe(2)
    expect(r.state.cash).toBeCloseTo(1000 - 400 - 4 + 200 - 2, 2)
    expect(r.state.holdings.index!.cost).toBe(200)
    s = must(sell(r.state, 'index', 1e9)).state // selling "all" is capped at what is held
    expect(s.holdings.index).toBeUndefined()
    expect(sell(s, 'index', 10)).toEqual({ ok: false, reason: 'holding' })
  })
  it('only money you moved in can be lost: net worth never drops below zero and the gain is value minus funded', () => {
    let s = must(buy(funded(500), 'nile', 400)).state
    for (let i = 0; i < 80; i++) s = advance(s)
    expect(netWorth(s)).toBeGreaterThanOrEqual(0)
    expect(gain(s)).toBe(Math.round((netWorth(s) - 500) * 100) / 100)
  })
})

describe('time', () => {
  it('does nothing before the first buy', () => {
    const s = funded(1000)
    expect(advance(s)).toBe(s)
  })
  it('advances one week at a time and records net worth', () => {
    let s = must(buy(funded(1000), 'savings', 500)).state
    s = advance(s)
    s = advance(s)
    expect(s.tick).toBe(2)
    expect(s.history).toHaveLength(3)
    expect(netWorth(s)).toBeGreaterThan(990) // savings earn interest; the fee cost $5
  })
  it('follows the real clock: one real week is one simulated year, one week every ~3.2 hours', () => {
    expect(MS_PER_WEEK).toBeCloseTo((7 * 24 * 60 * 60 * 1000) / 52, 5)
    const s = must(buy(funded(1000), 'savings', 500)).state
    expect(weekAt(s, T0 + MS_PER_WEEK - 1)).toBe(0)
    expect(weekAt(s, T0 + MS_PER_WEEK)).toBe(1)
    expect(weekAt(s, T0 + YEAR)).toBe(CONFIG.weeksPerYear)
    expect(msToNextWeek(s, T0 + 1000)).toBeCloseTo(MS_PER_WEEK - 1000, 0)
    expect(catchUp(funded(1000), T0 + YEAR)).toEqual(funded(1000)) // nothing moves before the first buy
  })
  it('catches up after the app was closed, week by week, with every history point and the news queued', () => {
    const start = must(buy(funded(1000, 9), 'index', 300)).state
    const later = catchUp(start, T0 + 2 * YEAR) // two real weeks away: two simulated years
    expect(later.tick).toBe(2 * CONFIG.weeksPerYear)
    expect(later.history).toHaveLength(2 * CONFIG.weeksPerYear + 1)
    let stepped = start
    for (let i = 0; i < 2 * CONFIG.weeksPerYear; i++) stepped = advance(stepped)
    expect(later).toEqual(stepped) // the same as watching every week
    const landed = buildMarket(9).events.filter((e) => e.tick <= later.tick)
    expect(later.newsQueue).toEqual(landed.map((e) => e.tick))
  })
  it('never waits for the news: unread stories queue up and are read one at a time', () => {
    let s = must(buy(funded(1000, 9), 'index', 300)).state
    const first = buildMarket(9).events[0]
    for (let i = 0; i < first.tick; i++) s = advance(s)
    expect(nextNews(s)!.id).toBe(first.id)
    expect(advance(s).tick).toBe(first.tick + 1) // time keeps running with news unread
    s = readNews(s)
    expect(s.newsQueue).toEqual([])
    expect(nextNews(s)).toBeUndefined()
    expect(readNews(s)).toBe(s)
  })
  it('ends after ten years (ten real weeks) and stops', () => {
    const s = catchUp(must(buy(funded(1000), 'savings', 500)).state, T0 + 30 * YEAR)
    expect(s.tick).toBe(WEEKS_PER_SEASON)
    expect(s.status).toBe('ended')
    expect(msToNextWeek(s, T0 + 30 * YEAR)).toBe(0)
    expect(buyAt(s, 'index', 10, T0 + 30 * YEAR)).toEqual({ ok: false, reason: 'ended' })
  })
  it('is deterministic: the same seed and trades give the same season', () => {
    const run = () => {
      let s = must(buy(funded(1000, 42), 'index', 600)).state
      for (let i = 0; i < 120; i++) s = advance(s)
      return netWorth(s)
    }
    expect(run()).toBe(run())
  })
})

describe('leaving the Playground', () => {
  it('money can only come back between seasons', () => {
    const idle = funded(300)
    expect(canWithdraw(idle)).toBe(true)
    const running = must(buy(idle, 'index', 100)).state
    expect(canWithdraw(running)).toBe(false)
    expect(cashOut(running, 5)).toBeNull()
  })
  it('cashing out before the first buy returns the cash and keeps the season number', () => {
    const out = cashOut(funded(300), 5)!
    expect(out.amount).toBe(300)
    expect(out.state.season).toBe(1)
    expect(out.state.cash).toBe(0)
  })
  it('cashing out a finished season values everything and starts the next', () => {
    let s = must(buy(funded(1000, 4), 'index', 800)).state
    for (let i = 0; i < WEEKS_PER_SEASON; i++) s = advance(s)
    const out = cashOut(s, 99)!
    expect(out.amount).toBe(netWorth(s))
    expect(out.state.season).toBe(2)
    expect(out.state.seed).toBe(99)
    expect(out.state.status).toBe('idle')
    expect(out.state.cash).toBe(0)
  })
  it('lesson rewards earned mid-season join the Playground cash and count as money moved in', () => {
    const s = must(buy(funded(1000), 'savings', 500)).state
    const topped = fund(s, 40)
    expect(topped.cash).toBe(s.cash + 40)
    expect(topped.funded).toBe(1040)
    expect(topped.history[topped.history.length - 1]).toBe(netWorth(topped))
  })
})

describe('charts and risk', () => {
  it('finds the worst fall from a peak', () => {
    expect(maxDrawdown([100, 120, 90, 110, 80, 130]).fall).toBeCloseTo((120 - 80) / 120)
    expect(maxDrawdown([100, 120, 90, 110, 80, 130]).tick).toBe(4)
    expect(maxDrawdown([1, 2, 3]).fall).toBe(0)
    expect(maxDrawdown([]).fall).toBe(0)
  })
  it('deflates the net worth line by inflation', () => {
    let s = must(buy(funded(1000), 'savings', 900)).state
    for (let i = 0; i < 100; i++) s = advance(s)
    const real = realHistory(s)
    expect(real).toHaveLength(s.history.length)
    expect(real[real.length - 1]).toBeLessThan(s.history[s.history.length - 1])
    expect(real[0]).toBe(s.history[0])
  })
  it('measures allocation and the biggest bet', () => {
    let s = funded(1000)
    s = must(buy(s, 'index', 500)).state
    s = must(buy(s, 'nile', 200)).state
    const a = allocation(s)
    expect(a.cash.share + a.assets.reduce((n, x) => n + x.share, 0)).toBeCloseTo(1, 5)
    expect(biggestBet(s)!.id).toBe('index')
    expect(biggestBet(funded(1000))).toBeNull()
  })
})

describe('auto-invest, payouts and the compare line', () => {
  const weeks = (s: PlaygroundState, n: number) => {
    for (let i = 0; i < n; i++) s = advance(s)
    return s
  }
  it('auto-invest buys once a month, with the 1% fee, as a normal trade, and skips a month it cannot afford', () => {
    let s = setAutoInvest(must(buy(funded(260), 'savings', 100)).state, { asset: 'index', amount: 50 })
    s = weeks(s, CONFIG.autoInvestEveryWeeks - 1)
    expect(s.trades).toHaveLength(1)
    s = advance(s)
    const auto = s.trades[1]
    expect(auto).toMatchObject({ asset: 'index', side: 'buy', amount: 50, fee: 0.5, auto: true, tick: CONFIG.autoInvestEveryWeeks })
    expect(s.cash).toBeCloseTo(260 - 101 - 50.5, 2)
    s = weeks(s, CONFIG.autoInvestEveryWeeks * 3) // cash for two more buys (108.50 → 58 → 7.50), then a month skipped
    expect(s.trades.filter((t) => t.auto)).toHaveLength(3)
    expect(s.cash).toBeCloseTo(7.5, 2)
  })
  it('the chart point of an auto-buy week is that week (it never rewrites the week before)', () => {
    let s = setAutoInvest(must(buy(funded(500), 'savings', 100)).state, { asset: 'index', amount: 100 })
    const before = weeks(s, CONFIG.autoInvestEveryWeeks - 1)
    s = advance(before)
    expect(s.history.slice(0, -1)).toEqual(before.history)
    expect(s.history[s.history.length - 1]).toBe(netWorth(s))
  })
  it('dividends and bond interest arrive every quarter: reinvested (no fee) or as cash, and are counted as income', () => {
    const start = must(buy(must(buy(funded(1000), 'index', 500)).state, 'bonds', 300)).state
    const kept = weeks(start, CONFIG.payoutEveryWeeks)
    const cashed = weeks(setReinvest(start, false), CONFIG.payoutEveryWeeks)
    expect(kept.income).toBeGreaterThan(0)
    expect(kept.income).toBeCloseTo(cashed.income, 1)
    expect(kept.cash).toBe(start.cash)
    expect(cashed.cash).toBeCloseTo(start.cash + cashed.income, 2)
    expect(kept.holdings.index!.units).toBeGreaterThan(start.holdings.index!.units)
    expect(kept.fees).toBe(start.fees)
    // A quarter of world stocks' 2% a year on about $500: about $2.50
    expect(kept.income).toBeGreaterThan(2)
    expect(kept.income).toBeLessThan(6)
    expect(weeks(start, CONFIG.payoutEveryWeeks - 1).income).toBe(0)
    // Safe Savings, gold and fictional assets pay nothing out (savings grows in its price)
    expect(weeks(must(buy(funded(1000), 'gold', 500)).state, CONFIG.payoutEveryWeeks).income).toBe(0)
  })
  it('with payouts reinvested, world stocks still return about their mean over many seasons', () => {
    const years: number[] = []
    for (let seed = 1; seed <= 40; seed++) {
      let s = must(buy(funded(1000, seed), 'index', 990)).state
      s = weeks(s, WEEKS_PER_SEASON)
      years.push(Math.pow(netWorth(s) / 1000, 1 / CONFIG.seasonYears) - 1)
    }
    const avg = years.reduce((a, b) => a + b, 0) / years.length
    expect(avg).toBeGreaterThan(0.03)
    expect(avg).toBeLessThan(0.11)
  })
  it('the compare line replays the money moved in, all in one asset, from the week it came', () => {
    let s = must(buy(funded(1000), 'index', 500)).state
    s = weeks(s, 20)
    s = fund(s, 200)
    s = weeks(s, 20)
    const line = benchmark(s, 'savings')
    expect(line).toHaveLength(s.history.length)
    expect(line[0]).toBeCloseTo(1000 / 1.01, 2)
    const p = buildMarket(s.seed).price.savings
    expect(line[20]).toBeCloseTo(line[19] * (p[20] / p[19]) + 200 / 1.01, 1) // the $200 came in week 20
    expect(line[line.length - 1]).toBeGreaterThan(1200 / 1.01)
    expect(benchmark(s, 'us500')).toHaveLength(s.history.length)
  })
  it('cashing out keeps the auto-invest and reinvest choices for the next season', () => {
    const s = setReinvest(setAutoInvest(funded(100), { asset: 'us500', amount: 25 }), false)
    const out = cashOut(s, 3)!
    expect(out.state).toMatchObject({ autoInvest: { asset: 'us500', amount: 25 }, reinvest: false, deposits: [], income: 0 })
  })
})

describe('saved Playground', () => {
  it('reads nothing, garbage and partial values as a fresh, empty Playground', async () => {
    const { parsePlayground } = await import('../src/domain/playground/persist')
    expect(parsePlayground(null)).toEqual(emptyPlayground)
    expect(parsePlayground('{nope')).toEqual(emptyPlayground)
    expect(parsePlayground('[]')).toEqual(emptyPlayground)
    const p = parsePlayground(JSON.stringify({ season: 3, cash: 12.5, status: 'running', tick: 10, speed: 2, holdings: { index: { units: 4, cost: 90 }, junk: { units: 1 } }, pendingEvent: 'nope' }), T0)
    expect(p).toMatchObject({ season: 3, cash: 12.5, status: 'running', tick: 10, holdings: { index: { units: 4, cost: 90 } }, newsQueue: [] })
    expect('speed' in p).toBe(false)
  })
  it('carries an old season (saved before time followed the real clock) on from the week it was at', async () => {
    const { parsePlayground } = await import('../src/domain/playground/persist')
    const old = { season: 2, seed: 9, status: 'running', tick: 60, speed: 1, cash: 5, holdings: {}, history: [1], historyStart: 0, funded: 5, fees: 0, seenEvents: [40], pendingEvent: 'recession' }
    const p = parsePlayground(JSON.stringify(old), T0)
    expect(p.startedAt).toBe(T0 - 60 * MS_PER_WEEK)
    expect(weekAt(p, T0)).toBe(60)
    expect(weekAt(p, T0 + MS_PER_WEEK)).toBe(61)
    expect(p.newsQueue).toEqual([40]) // the story it was showing stays unread
    expect(p).toMatchObject({ deposits: [{ tick: 0, amount: 5 }], autoInvest: null, reinvest: true, income: 0 })
  })
  it('keeps the week a season had reached at the old pace (one real day per year) and goes on at one real week', async () => {
    const { parsePlayground } = await import('../src/domain/playground/persist')
    const dayWeek = DAY_MS / CONFIG.weeksPerYear
    // Saved at week 30 when the old clock had already reached week 70
    const old = { season: 1, seed: 4, status: 'running', tick: 30, startedAt: T0 - 70 * dayWeek, cash: 5, history: [5], historyStart: 0 }
    const p = parsePlayground(JSON.stringify(old), T0)
    expect(p.msPerYear).toBe(CONFIG.msPerYear)
    expect(weekAt(p, T0)).toBe(70)
    expect(weekAt(p, T0 + MS_PER_WEEK)).toBe(71)
    // Saved at today's pace: read as is
    const now = { ...old, msPerYear: CONFIG.msPerYear, startedAt: T0 - 70 * MS_PER_WEEK }
    expect(parsePlayground(JSON.stringify(now), T0).startedAt).toBe(now.startedAt)
  })
  it('round-trips a real season through JSON', async () => {
    const { parsePlayground } = await import('../src/domain/playground/persist')
    let s = must(buy(funded(1000, 8), 'index', 400)).state
    s = setAutoInvest(s, { asset: 'reit', amount: 25 })
    for (let i = 0; i < 30; i++) s = advance(s)
    expect(s.income).toBeGreaterThan(0)
    expect(parsePlayground(JSON.stringify(s))).toEqual(s)
  })
})

describe('season insights', () => {
  const finish = (s: PlaygroundState) => {
    for (let i = 0; i < WEEKS_PER_SEASON; i++) s = advance(s)
    return s
  }

  it('replays holdings from the trades: "spread" needs three kinds at once', () => {
    let s = funded(1000)
    s = must(buy(s, 'savings', 100)).state
    s = must(buy(s, 'index', 100)).state
    expect(wasSpread(s.trades)).toBe(false)
    s = must(buy(s, 'nile', 100)).state
    expect(wasSpread(s.trades)).toBe(true)
    expect(Object.keys(unitsAt(s.trades, 0))).toHaveLength(3)
    const sold = must(sell(s, 'savings', 1e9)).state
    expect(wasSpread(sold.trades)).toBe(true) // it was true at some point
  })

  it('says what helped and what hurt without ever advising', () => {
    const { helped, hurt } = insights(finish(must(buy(funded(1000, 5), 'index', 800)).state))
    expect(hurt.some((i) => i.key === 'fees')).toBe(true)
    expect(helped.length).toBeLessThanOrEqual(3)
    // an all-in single company is flagged as a big bet
    const bet = insights(finish(must(buy(funded(1000, 5), 'nile', 900)).state))
    expect(bet.hurt.some((i) => i.key === 'big_bet')).toBe(true)
  })
})
