import { describe, expect, it } from 'vitest'
import { completeLesson, currentStreak, earnedFreeze, MAX_FREEZES, parseProgress } from '../src/domain/progress'
import { CONFIG, GOALS, MIXES } from '../src/domain/playground/config'
import { advance, buy, emptyPlayground, fund, netWorth, setGoal, valueOf, type PlaygroundState } from '../src/domain/playground/engine'
import { goalStatus } from '../src/domain/playground/insights'
import { parsePlayground } from '../src/domain/playground/persist'
import { pendingRecap, seeRecap, yearRecap } from '../src/domain/playground/recap'
import { rebalance } from '../src/domain/playground/rebalance'

const lesson = (n: number) => `investing/basics/l${n}`

describe('streak freezes', () => {
  it('a perfect first finish earns one, up to the maximum', () => {
    let p = parseProgress(null)
    const before = p
    p = completeLesson(p, 2, '2026-10-01', lesson(1), 2)
    expect(p.freezes).toBe(1)
    expect(earnedFreeze(before, p, '2026-10-01')).toBe(true)
    p = completeLesson(p, 1, '2026-10-01', lesson(2), 2) // not perfect
    expect(p.freezes).toBe(1)
    for (let i = 3; i < 8; i++) p = completeLesson(p, 2, '2026-10-01', lesson(i), 2)
    expect(p.freezes).toBe(MAX_FREEZES)
    expect(completeLesson(p, 2, '2026-10-01', lesson(1), 2).freezes).toBe(MAX_FREEZES) // a replay earns nothing
  })
  it('covers missed days: the streak shows and carries on, spending one freeze per missed day', () => {
    let p = completeLesson(parseProgress(null), 2, '2026-10-01', lesson(1), 2) // streak 1, one freeze
    expect(currentStreak(p.streak, '2026-10-03', p.freezes)).toBe(1) // missed the 2nd: still alive
    expect(currentStreak(p.streak, '2026-10-03', 0)).toBe(0)
    p = completeLesson(p, 0, '2026-10-03', lesson(2), 2)
    expect(p.streak).toEqual({ count: 2, lastDay: '2026-10-03' })
    expect(p.freezes).toBe(0)
  })
  it('a perfect finish that spends a freeze earns one back, and says so', () => {
    let p = parseProgress(null)
    for (let i = 1; i <= 2; i++) p = completeLesson(p, 2, '2026-10-01', lesson(i), 2)
    expect(p.freezes).toBe(MAX_FREEZES)
    const after = completeLesson(p, 2, '2026-10-03', lesson(3), 2) // missed the 2nd: spends one, earns one
    expect(after.freezes).toBe(MAX_FREEZES)
    expect(after.streak.count).toBe(2)
    expect(earnedFreeze(p, after, '2026-10-03')).toBe(true)
    // No missed day: already holding the most, so nothing is earned
    expect(earnedFreeze(p, completeLesson(p, 2, '2026-10-02', lesson(3), 2), '2026-10-02')).toBe(false)
  })
  it('without enough freezes the streak restarts and they are kept', () => {
    let p = completeLesson(parseProgress(null), 2, '2026-10-01', lesson(1), 2)
    p = completeLesson(p, 0, '2026-10-05', lesson(2), 2) // 3 missed days, 1 freeze
    expect(p.streak.count).toBe(1)
    expect(p.freezes).toBe(1)
  })
  it('old saved progress has none, and garbage is clamped', () => {
    expect(parseProgress(JSON.stringify({ bank: 5 })).freezes).toBe(0)
    expect(parseProgress(JSON.stringify({ freezes: 9 })).freezes).toBe(MAX_FREEZES)
  })
})

const T0 = 1_760_000_000_000
const running = (cash = 1000, seed = 5): PlaygroundState => {
  const r = buy(fund({ ...emptyPlayground, seed }, cash), 'savings', 100, T0)
  if (!r.ok) throw new Error('buy')
  return r.state
}
const weeks = (s: PlaygroundState, n: number) => {
  for (let i = 0; i < n; i++) s = advance(s)
  return s
}

describe('rebalancing', () => {
  it('moves the holdings to the target mix, close enough after the 1% fees, and sells what is not in it', () => {
    let s = running()
    const r0 = buy(s, 'crypto', 300, T0)
    if (r0.ok) s = r0.state
    s = weeks(s, 10)
    const total = netWorth(s)
    const r = rebalance(s, MIXES.balanced)
    expect(r.trades.length).toBeGreaterThan(0)
    expect(r.state.holdings.crypto).toBeUndefined()
    expect(r.fees).toBeGreaterThan(0)
    const share = (id: 'index' | 'bonds' | 'savings') => valueOf(r.state, id) / netWorth(r.state)
    expect(share('index')).toBeCloseTo(0.6, 1)
    expect(share('bonds')).toBeCloseTo(0.3, 1)
    expect(netWorth(r.state)).toBeGreaterThan(total * 0.97) // only fees are lost
    expect(r.state.cash).toBeGreaterThanOrEqual(0)
  })
  it('does nothing outside a running season, or when already on target', () => {
    expect(rebalance(fund(emptyPlayground, 100), MIXES.growth).trades).toEqual([])
    const once = rebalance(weeks(running(), 2), MIXES.cautious).state
    expect(rebalance(once, MIXES.cautious).trades.length).toBeLessThanOrEqual(1)
  })
})

describe('yearly recap', () => {
  it('waits after each finished year, once, and covers the year in money, news, the market and prices', () => {
    let s = running(1000, 9)
    expect(pendingRecap(s)).toBeNull()
    s = weeks(s, CONFIG.weeksPerYear)
    expect(pendingRecap(s)).toBe(1)
    const r = yearRecap(s, 1)
    expect(r.start).toBe(s.history[0])
    expect(r.end).toBe(netWorth(s))
    expect(Number.isFinite(r.us500) && Number.isFinite(r.inflation)).toBe(true)
    s = seeRecap(s)
    expect(pendingRecap(s)).toBeNull()
    s = weeks(s, CONFIG.weeksPerYear * 2) // two years pass while away: one recap, the latest
    expect(pendingRecap(s)).toBe(3)
    expect(pendingRecap(seeRecap(s))).toBeNull()
  })
  it('old running seasons count the years already gone as seen', () => {
    const p = parsePlayground(JSON.stringify({ status: 'running', tick: 120, seed: 3, startedAt: T0 }), T0)
    expect(p.recapSeen).toBe(2)
  })
})

describe('season goal', () => {
  it('is checked from the season itself', () => {
    let s = setGoal(running(), 'income')
    expect(goalStatus(s)).toMatchObject({ goal: 'income', met: false, value: 0 })
    s = { ...s, income: GOALS.incomeTarget }
    expect(goalStatus(s)?.met).toBe(true)
    expect(goalStatus(setGoal(weeks(running(), 5), 'steady'))?.goal).toBe('steady')
    expect(goalStatus({ ...s, goal: null })).toBeNull()
    expect(parsePlayground(JSON.stringify({ goal: 'nope' })).goal).toBeNull()
    expect(parsePlayground(JSON.stringify({ goal: 'steady' })).goal).toBe('steady')
  })
})

describe('synced preferences', async () => {
  const { parsePrefs } = await import('../src/domain/sync')
  it('reads sound and language from an account row, tolerating garbage', () => {
    expect(parsePrefs({ sound: false, lang: 'ar' })).toEqual({ sound: false, lang: 'ar' })
    expect(parsePrefs({})).toEqual({ sound: true, lang: 'en' })
    expect(parsePrefs(null)).toBeNull()
    expect(parsePrefs('x')).toBeNull()
  })
})

describe('weekly recap on Me', async () => {
  const { weekSummary } = await import('../src/domain/progress')
  const { portfolioWeekMove } = await import('../src/domain/playground/recap')
  const { MS_PER_WEEK } = await import('../src/domain/playground/config')
  it('counts the last seven days of learning and what they paid', () => {
    const activity = { '2026-10-20': 20, '2026-10-18': 0, '2026-10-14': 30, '2026-10-13': 50 }
    expect(weekSummary(activity, '2026-10-20')).toEqual({ days: 3, earned: 50 })
    expect(weekSummary({}, '2026-10-20')).toEqual({ days: 0, earned: 0 })
  })
  it('the portfolio move over the last seven real days counts market moves, not money moved in', () => {
    const nowOf = (st: PlaygroundState) => st.startedAt + st.tick * MS_PER_WEEK
    expect(portfolioWeekMove(emptyPlayground, T0)).toBeNull()
    let s = weeks(running(1000, 3), 10)
    // Younger than a week: measured from the first point
    expect(portfolioWeekMove(s, nowOf(s))).toBeCloseTo(netWorth(s) - s.history[0], 6)
    s = weeks(s, 7 * CONFIG.weeksPerYear)
    const before = s.history[s.tick - 7 * CONFIG.weeksPerYear - s.historyStart]
    const move = portfolioWeekMove(s, nowOf(s))!
    expect(move).toBeCloseTo(netWorth(s) - before, 6)
    // A lesson reward moved in this week is not growth
    expect(portfolioWeekMove(fund(s, 50), nowOf(s))).toBeCloseTo(move, 6)
    // A season that ended more than a week ago no longer moves
    const ended = weeks(s, 10 * CONFIG.weeksPerYear)
    expect(portfolioWeekMove(ended, nowOf(ended) + 8 * CONFIG.msPerYear)).toBeNull()
  })
})
