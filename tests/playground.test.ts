import { describe, expect, it } from 'vitest'
import { ASSET_IDS, ASSETS, CONFIG, WEEKS_PER_SEASON } from '../src/domain/playground/config'
import { advance, buy, canWithdraw, cashOut, dismissEvent, emptyPlayground, fund, gain, maxBuy, maxDrawdown, netWorth, realHistory, sell, setSpeed, type PlaygroundState } from '../src/domain/playground/engine'
import { direction, EVENTS } from '../src/domain/playground/events'
import { buildMarket } from '../src/domain/playground/market'
import { normal, uniform } from '../src/domain/playground/prng'
import { rewind } from '../src/domain/playground/rewind'
import { allocation, biggestBet, riskLevel, stressLoss } from '../src/domain/playground/risk'
import { eventsUnlocked, unlockedAssets } from '../src/domain/playground/unlocks'

const funded = (cash = 1000, seed = 7, eventsOn = false): PlaygroundState => fund({ ...emptyPlayground, seed, eventsOn }, cash)
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
    const a = buildMarket(11, true)
    const b = buildMarket(11, true)
    expect(a.price.index).toEqual(b.price.index)
    expect(buildMarket(12, true).price.index).not.toEqual(a.price.index)
  })
  it('covers the whole season and starts at the configured prices', () => {
    const m = buildMarket(21, true)
    for (const id of ASSET_IDS) {
      expect(m.price[id]).toHaveLength(WEEKS_PER_SEASON + 1)
      expect(m.price[id][0]).toBe(ASSETS[id].startPrice)
    }
    expect(m.cpi[0]).toBe(1)
    expect(m.cpi[WEEKS_PER_SEASON]).toBeGreaterThan(1)
  })
  it('Safe Savings never loses', () => {
    for (let seed = 1; seed <= 20; seed++) {
      const p = buildMarket(seed, true).price.savings
      for (let t = 1; t < p.length; t++) expect(p[t]).toBeGreaterThanOrEqual(p[t - 1])
    }
  })
  it('index and single-company returns are in a believable range over many seasons', () => {
    let index = 0
    let nile = 0
    const n = 60
    for (let seed = 1; seed <= n; seed++) {
      const m = buildMarket(seed, false)
      index += Math.log(m.price.index[WEEKS_PER_SEASON] / m.price.index[0]) / CONFIG.seasonYears
      nile += Math.log(m.price.nile[WEEKS_PER_SEASON] / m.price.nile[0]) / CONFIG.seasonYears
    }
    expect(index / n).toBeGreaterThan(0.03)
    expect(index / n).toBeLessThan(0.11)
    expect(nile / n).toBeGreaterThan(-0.02)
    expect(nile / n).toBeLessThan(0.14)
  })
  it('has no news when news is off, and a few distinct events spread over the season when on', () => {
    expect(buildMarket(3, false).events).toEqual([])
    const ev = buildMarket(3, true).events
    expect(ev).toHaveLength(CONFIG.eventsPerSeason)
    expect(new Set(ev.map((e) => e.id)).size).toBe(ev.length)
    expect(ev.map((e) => e.tick)).toEqual(ev.map((e) => e.tick).sort((a, b) => a - b))
    expect(ev[0].tick).toBeGreaterThan(0)
    expect(ev[ev.length - 1].tick).toBeLessThan(WEEKS_PER_SEASON)
  })
  it('bonds fall when rates rise: the rates-rise week is a drop for bonds', () => {
    for (let seed = 1; seed <= 200; seed++) {
      const m = buildMarket(seed, true)
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
  it('the first buy starts the clock at 1x and the chart; later buys do not restart it', () => {
    const s = funded(1000)
    expect(s.status).toBe('idle')
    const a = must(buy(s, 'savings', 100)).state
    expect(a.status).toBe('running')
    expect(a.speed).toBe(1)
    expect(a.history).toHaveLength(1)
    const b = must(buy(setSpeed(a, 4), 'index', 100)).state
    expect(b.speed).toBe(4)
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
    for (let i = 0; i < 80; i++) s = advance(dismissEvent(s))
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
  it('pauses on news until Continue is pressed, then carries on', () => {
    let s = must(buy(funded(1000, 9, true), 'index', 300)).state
    const first = buildMarket(9, true).events[0]
    for (let i = 0; i < first.tick - 1; i++) s = advance(s)
    expect(s.pendingEvent).toBeUndefined()
    s = advance(s)
    expect(s.tick).toBe(first.tick)
    expect(s.pendingEvent).toBe(first.id)
    expect(advance(s)).toBe(s) // time is stopped while the news is up
    s = advance(dismissEvent(s))
    expect(s.tick).toBe(first.tick + 1)
    expect(s.pendingEvent).toBeUndefined()
  })
  it('ends after five years and stops the clock', () => {
    let s = must(buy(funded(1000), 'savings', 500)).state
    for (let i = 0; i < WEEKS_PER_SEASON + 10; i++) s = advance(dismissEvent(s))
    expect(s.tick).toBe(WEEKS_PER_SEASON)
    expect(s.status).toBe('ended')
    expect(s.speed).toBe(0)
    expect(buy(s, 'index', 10)).toEqual({ ok: false, reason: 'ended' })
  })
  it('is deterministic: the same seed and trades give the same season', () => {
    const run = () => {
      let s = must(buy(funded(1000, 42, true), 'index', 600)).state
      for (let i = 0; i < 120; i++) s = advance(dismissEvent(s))
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
    expect(cashOut(running, 5, false)).toBeNull()
  })
  it('cashing out before the first buy returns the cash and keeps the season number', () => {
    const out = cashOut(funded(300), 5, false)!
    expect(out.amount).toBe(300)
    expect(out.state.season).toBe(1)
    expect(out.state.cash).toBe(0)
    expect(out.state.past).toEqual([])
  })
  it('cashing out a finished season values everything, records it and starts the next', () => {
    let s = must(buy(funded(1000, 4), 'index', 800)).state
    for (let i = 0; i < WEEKS_PER_SEASON; i++) s = advance(s)
    const out = cashOut(s, 99, true)!
    expect(out.amount).toBe(netWorth(s))
    expect(out.state.season).toBe(2)
    expect(out.state.seed).toBe(99)
    expect(out.state.eventsOn).toBe(true)
    expect(out.state.status).toBe('idle')
    expect(out.state.past).toHaveLength(1)
    expect(out.state.past[0]).toMatchObject({ season: 1, funded: 1000, ended: out.amount, trades: 1 })
    expect(out.state.past[0].endedReal).toBeLessThan(out.amount) // inflation takes some of it
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
  it('measures allocation, risk level, the biggest bet and the stress test', () => {
    let s = funded(1000)
    s = must(buy(s, 'index', 500)).state
    s = must(buy(s, 'nile', 200)).state
    const a = allocation(s)
    expect(a.cash.share + a.assets.reduce((n, x) => n + x.share, 0)).toBeCloseTo(1, 5)
    expect(riskLevel(s)).toBeGreaterThanOrEqual(2)
    expect(biggestBet(s)!.id).toBe('index')
    // funds −20% of 500 and the company −40% of 200 = 100 + 80
    expect(stressLoss(s)).toBeCloseTo(180, 0)
    expect(riskLevel(funded(1000))).toBe(1)
    expect(biggestBet(funded(1000))).toBeNull()
  })
  it('replays the same seed with one index buy-and-hold', () => {
    const r = rewind(4, false, 1000)
    expect(r.trades).toBe(1)
    expect(r.fees).toBeCloseTo(9.9, 1)
    const m = buildMarket(4, false)
    expect(r.ended).toBeCloseTo((990.1 / m.price.index[0]) * m.price.index[WEEKS_PER_SEASON], 0)
  })
})

describe('unlocks', () => {
  it('opens assets as lessons are finished, and news at the unit checkpoint', () => {
    expect(unlockedAssets(0)).toEqual([])
    expect(unlockedAssets(1)).toEqual(['savings'])
    expect(unlockedAssets(2)).toEqual(['savings', 'index'])
    expect(unlockedAssets(4)).toEqual(['savings', 'index', 'nile'])
    expect(unlockedAssets(5)).toEqual(['savings', 'index', 'bonds', 'nile'])
    expect(eventsUnlocked(3, 4)).toBe(false)
    expect(eventsUnlocked(4, 4)).toBe(true)
    expect(eventsUnlocked(0, 0)).toBe(false)
  })
})

describe('saved Playground', () => {
  it('reads nothing, garbage and partial values as a fresh, empty Playground', async () => {
    const { parsePlayground } = await import('../src/domain/playground/persist')
    expect(parsePlayground(null)).toEqual(emptyPlayground)
    expect(parsePlayground('{nope')).toEqual(emptyPlayground)
    expect(parsePlayground('[]')).toEqual(emptyPlayground)
    const p = parsePlayground(JSON.stringify({ season: 3, cash: 12.5, status: 'running', speed: 2, holdings: { index: { units: 4, cost: 90 }, junk: { units: 1 } }, pendingEvent: 'nope' }))
    expect(p).toMatchObject({ season: 3, cash: 12.5, status: 'running', speed: 2, holdings: { index: { units: 4, cost: 90 } } })
    expect(p.pendingEvent).toBeUndefined()
  })
  it('round-trips a real season through JSON', async () => {
    const { parsePlayground } = await import('../src/domain/playground/persist')
    let s = must(buy(funded(1000, 8, true), 'index', 400)).state
    for (let i = 0; i < 30; i++) s = advance(dismissEvent(s))
    expect(parsePlayground(JSON.stringify(s))).toEqual(s)
  })
})

describe('season missions and insights', () => {
  const finish = (s: PlaygroundState) => {
    for (let i = 0; i < WEEKS_PER_SEASON; i++) s = advance(dismissEvent(s))
    return s
  }

  it('unlocks missions with lessons', async () => {
    const { missionsUnlocked } = await import('../src/domain/playground/missions')
    expect(missionsUnlocked(0)).toEqual([])
    expect(missionsUnlocked(2)).toEqual(['rate-rise'])
    expect(missionsUnlocked(4)).toEqual(['rate-rise', 'spread'])
    expect(missionsUnlocked(5)).toEqual(['beat-inflation', 'rate-rise', 'spread'])
  })

  it('picks missions only before the season starts', async () => {
    const { setMissions } = await import('../src/domain/playground/engine')
    const idle = funded(500)
    expect(setMissions(idle, ['spread']).missions).toEqual(['spread'])
    const running = must(buy(idle, 'index', 100)).state
    expect(setMissions(running, ['spread'])).toBe(running)
  })

  it('replays holdings from the trades: "spread" needs three kinds at once', async () => {
    const { unitsAt, wasSpread } = await import('../src/domain/playground/missions')
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

  it('meets "beat inflation" when the season ends above the start in first-week dollars', async () => {
    const { metMissions } = await import('../src/domain/playground/missions')
    let s = { ...must(buy({ ...funded(1000, 3), missions: ['beat-inflation'] }, 'savings', 900)).state }
    s = finish(s)
    expect(metMissions(s)).toEqual([]) // savings pays about 2%, inflation about 3%, minus the fee
    let t: PlaygroundState = { ...funded(1000, 3), missions: ['beat-inflation'] }
    t = finish(must(buy(t, 'index', 900)).state)
    const real = realHistory(t)
    expect(metMissions(t).length).toBe(real[real.length - 1] > 1000 ? 1 : 0)
  })

  it('meets "stay through the news" only if invested when each event landed', async () => {
    const { metMissions } = await import('../src/domain/playground/missions')
    const base = { ...funded(1000, 9, true), missions: ['rate-rise' as const] }
    expect(metMissions(finish(must(buy(base, 'index', 500)).state))).toEqual(['rate-rise'])
    const cashOnly = must(buy(base, 'index', 100)).state
    const sold = must(sell(cashOnly, 'index', 1e9)).state // out of everything before any news
    expect(metMissions(finish(sold))).toEqual([])
  })

  it('says what helped and what hurt without ever advising', async () => {
    const { insights } = await import('../src/domain/playground/missions')
    let s = must(buy(funded(1000, 5, true), 'index', 800)).state
    s = finish(s)
    const { helped, hurt, habit } = insights(s)
    expect(hurt.some((i) => i.key === 'fees')).toBe(true)
    expect(helped.length).toBeLessThanOrEqual(3)
    expect(['', 'stayed', 'spread', 'beat']).toContain(habit)
    // an all-in single company is flagged as a big bet
    const bet = insights(finish(must(buy(funded(1000, 5, true), 'nile', 900)).state))
    expect(bet.hurt.some((i) => i.key === 'big_bet')).toBe(true)
  })

  it('records the missions, habit and market in the past seasons, and replays buy-and-hold as a line', async () => {
    const { metMissions, insights } = await import('../src/domain/playground/missions')
    const { rewindSeries } = await import('../src/domain/playground/rewind')
    const s = finish(must(buy({ ...funded(1000, 6, true), missions: ['spread'] }, 'index', 800)).state)
    const out = cashOut(s, 77, true, { met: metMissions(s), habit: insights(s).habit })!
    const r = out.state.past[0]
    expect(r).toMatchObject({ seed: 6, eventsOn: true, missions: ['spread'], met: [] })
    expect(r.history).toHaveLength(WEEKS_PER_SEASON + 1)
    const line = rewindSeries(6, true, 1000)
    expect(line).toHaveLength(WEEKS_PER_SEASON + 1)
    expect(line[0]).toBeCloseTo(1000 - 9.9, 0)
    expect(line[WEEKS_PER_SEASON]).toBe(rewind(6, true, 1000).ended)
    expect(out.state.missions).toEqual([])
  })
})
