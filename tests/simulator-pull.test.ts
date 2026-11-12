import { describe, expect, it } from 'vitest'
import { AWAY_MIN_WEEKS, awaySummary, snapshotOf, somethingNew } from '../src/domain/playground/away'
import { CHALLENGE_IDS, challengeFor, challengeMet, challengeStatus, currentYear } from '../src/domain/playground/challenges'
import { emptyPlayground, type PlaygroundState, type Trade } from '../src/domain/playground/engine'

const D = '2026-11-12'
const running = (over: Partial<PlaygroundState> = {}): PlaygroundState => ({ ...emptyPlayground, status: 'running', cash: 500, funded: 500, ...over })
const trade = (tick: number, over: Partial<Trade> = {}): Trade => ({ tick, asset: 'index', side: 'buy', amount: 100, fee: 1, price: 10, ...over }) as Trade

describe('while you were away', () => {
  it('says nothing without a snapshot, too soon, for another season, or twice a day', () => {
    const s = running({ tick: 10 })
    expect(awaySummary(null, s, D)).toBeNull()
    expect(awaySummary(snapshotOf(running({ tick: 10 - AWAY_MIN_WEEKS + 1 }), ''), s, D)).toBeNull()
    expect(awaySummary({ ...snapshotOf(running({ tick: 0 }), ''), season: 2 }, s, D)).toBeNull()
    expect(awaySummary(snapshotOf(running({ tick: 0 }), D), s, D)).toBeNull() // already seen today
    expect(awaySummary(snapshotOf(running({ tick: 0 }), ''), { ...s, status: 'idle' }, D)).toBeNull()
  })

  it('counts weeks, market moves (not money moved in), payouts and waiting news', () => {
    const before = running({ tick: 2, cash: 500, income: 1 })
    const after = running({ tick: 20, cash: 640, income: 6, deposits: [{ tick: 10, amount: 100 }], newsQueue: [12] })
    expect(awaySummary(snapshotOf(before, '2026-11-11'), after, D)).toEqual({ weeks: 18, change: 40, income: 5, news: 1 })
  })

  it('the portfolio row has something new: unread news or a recap', () => {
    expect(somethingNew(running({ newsQueue: [3] }), false)).toBe(true)
    expect(somethingNew(running(), true)).toBe(true)
    expect(somethingNew(running(), false)).toBe(false)
    expect(somethingNew({ ...emptyPlayground, newsQueue: [3] }, false)).toBe(false)
  })
})

describe('weekly challenges', () => {
  it('rotate year by year, all four in turn', () => {
    const ids = [1, 2, 3, 4].map((y) => challengeFor(1, y))
    expect(new Set(ids)).toEqual(new Set(CHALLENGE_IDS))
    expect(currentYear(running({ tick: 0 }))).toBe(1)
    expect(currentYear(running({ tick: 52 }))).toBe(2)
    expect(currentYear(running({ tick: 9999 }))).toBe(10)
  })

  it('are judged from the trades of that year only', () => {
    // Find a year with each challenge in season 1
    const year = (id: string) => [1, 2, 3, 4].find((y) => challengeFor(1, y) === id)!
    const y3 = year('three-kinds')
    const from = (y3 - 1) * 52
    const s = running({ tick: from + 10, trades: [trade(from + 1, { asset: 'index' }), trade(from + 2, { asset: 'bonds' }), trade(from - 5, { asset: 'gold' })] as Trade[] })
    expect(challengeStatus(s, y3)).toMatchObject({ id: 'three-kinds', value: 2, target: 3, met: false, final: false })
    const fees = year('low-fees')
    const f0 = (fees - 1) * 52
    const pricey = running({ tick: f0 + 60, trades: [trade(f0 + 1, { fee: 6 }), trade(f0 + 2, { fee: 5 })] })
    expect(challengeStatus(pricey, fees)).toMatchObject({ value: 11, met: false, final: true })
    const q = year('every-quarter')
    const q0 = (q - 1) * 52
    expect(challengeStatus(running({ tick: q0 + 52, trades: [0, 13, 26, 39].map((w) => trade(q0 + w, { auto: true })) }), q).met).toBe(true)
  })

  it('a met challenge in a finished, invested year earns the badge; doing nothing does not', () => {
    const fees = [1, 2, 3, 4].find((y) => challengeFor(1, y) === 'low-fees')!
    const f0 = (fees - 1) * 52
    expect(challengeMet(running({ tick: fees * 52 + 1 }))).toBe(false) // never invested
    expect(challengeMet(running({ tick: fees * 52 + 1, trades: [trade(f0 + 1, { fee: 2 })] }))).toBe(true)
    expect(challengeMet(running({ tick: f0 + 5, trades: [trade(f0 + 1, { fee: 2 })] }))).toBe(false) // the year is not over
  })
})
