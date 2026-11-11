import { describe, expect, it } from 'vitest'
import {
  addDays,
  completeLesson,
  dueQuestions,
  nextStreakMilestone,
  parseProgress,
  recordAnswer,
  recordReview,
  streakAtRisk,
  studiedToday,
  visitPortfolio,
  MAX_RUN_SECONDS,
} from '../src/domain/progress'
import { chestAmount, claimChest, questsFor, questsToday } from '../src/domain/quests'
import { mergeProgress } from '../src/domain/sync'

const D = '2026-11-10'
const lesson = (n: number) => `investing/basics/l${n}`

describe('daily goal', () => {
  it('adds the time of each run to the day, capped per run', () => {
    let p = completeLesson(parseProgress(null), 2, D, lesson(1), 2, 150)
    p = completeLesson(p, 0, D, undefined, 0, 90) // a review run counts too
    expect(studiedToday(p, D)).toBe(240)
    p = completeLesson(p, 2, D, lesson(2), 2, 99_999)
    expect(studiedToday(p, D)).toBe(240 + MAX_RUN_SECONDS)
    expect(studiedToday(p, '2026-11-11')).toBe(0)
  })
})

describe('streak extras', () => {
  it('keeps the best streak, also for progress saved before it existed', () => {
    let p = parseProgress(null)
    for (let i = 0; i < 4; i++) p = completeLesson(p, 1, addDays(D, i), lesson(i))
    expect(p.bestStreak).toBe(4)
    p = completeLesson(p, 1, addDays(D, 10), lesson(9)) // a gap: the streak restarts, the best stays
    expect(p.streak.count).toBe(1)
    expect(p.bestStreak).toBe(4)
    expect(parseProgress(JSON.stringify({ streak: { count: 6, lastDay: D } })).bestStreak).toBe(6)
  })
  it('is at risk in the evening when today has no lesson yet', () => {
    const p = completeLesson(parseProgress(null), 1, D, lesson(1))
    const tomorrow = addDays(D, 1)
    expect(streakAtRisk(p, tomorrow, 17)).toBe(false)
    expect(streakAtRisk(p, tomorrow, 18)).toBe(true)
    expect(streakAtRisk(p, D, 22)).toBe(false) // done today
    expect(streakAtRisk(p, addDays(D, 5), 22)).toBe(false) // already lost
    expect(streakAtRisk(parseProgress(null), D, 22)).toBe(false) // nothing to lose
  })
  it('names the next milestone', () => {
    expect([0, 2, 3, 7, 29, 100, 250].map(nextStreakMilestone)).toEqual([3, 3, 7, 14, 30, 200, 300])
  })
})

describe('daily review', () => {
  it('a wrong answer is due at once; a right one comes back after 1, 2, 4 … days', () => {
    let p = recordReview(parseProgress(null), 'a', false, D)
    p = recordReview(p, 'b', true, D)
    expect(dueQuestions(['a', 'b', 'c'], p, D)).toEqual(['a'])
    expect(dueQuestions(['a', 'b', 'c'], p, addDays(D, 1))).toEqual(['a', 'b'])
    p = recordReview(p, 'b', true, addDays(D, 1)) // box 2: two days on
    expect(p.due.b).toBe(addDays(D, 3))
    p = recordReview(p, 'a', true, addDays(D, 1))
    expect(dueQuestions(['a', 'b'], p, addDays(D, 1))).toEqual([])
  })
  it('old progress without due days reviews its wrong answers', () => {
    const p = recordAnswer(recordAnswer(parseProgress(null), 'a', 1, false), 'b', 0, true)
    expect(dueQuestions(['a', 'b'], p, D)).toEqual(['a'])
  })
  it('adds days across months', () => {
    expect(addDays('2026-01-31', 1)).toBe('2026-02-01')
    expect(addDays('2026-12-30', 16)).toBe('2027-01-15')
  })
})

describe('daily quests', () => {
  const ctx = { portfolio: true, goalSeconds: 600 }
  it('are three a day, always with "finish a lesson", the same for a given day', () => {
    for (let i = 0; i < 40; i++) {
      const day = addDays(D, i)
      const q = questsFor(day, ctx)
      expect(q).toHaveLength(3)
      expect(q[0]).toBe('lesson')
      expect(new Set(q).size).toBe(3)
      expect(questsFor(day, ctx)).toEqual(q)
      expect(questsFor(day, { portfolio: false })).not.toContain('portfolio')
    }
    // they change from day to day
    expect(new Set(Array.from({ length: 10 }, (_, i) => questsFor(addDays(D, i), ctx).join())).size).toBeGreaterThan(1)
  })
  it('count what was done today, and start again the next day', () => {
    let p = recordReview(parseProgress(null), 'q1', true, D)
    p = completeLesson(p, 2, D, lesson(1), 2, 700)
    p = visitPortfolio(p, D)
    expect(p.daily).toEqual({ day: D, lessons: 1, correct: 1, perfect: 1, portfolio: true, claimed: false })
    const tomorrow = addDays(D, 1)
    expect(questsToday(p, tomorrow, ctx).quests.every((q) => q.value === 0 && !q.done)).toBe(true)
    expect(completeLesson(p, 0, tomorrow, lesson(2), 2).daily).toMatchObject({ day: tomorrow, lessons: 1, perfect: 0 })
  })
  it('the chest pays $5 to $25 once, only when every quest is done', () => {
    for (let i = 0; i < 30; i++) {
      const a = chestAmount(addDays(D, i))
      expect(a % 5).toBe(0)
      expect(a).toBeGreaterThanOrEqual(5)
      expect(a).toBeLessThanOrEqual(25)
    }
    const empty = parseProgress(null)
    expect(claimChest(empty, D, ctx)).toBe(empty)
    // Do everything any quest could ask for
    let p = empty
    for (let i = 0; i < 5; i++) p = recordReview(p, `q${i}`, true, D)
    p = completeLesson(p, 2, D, lesson(1), 2, 400)
    p = completeLesson(p, 2, D, lesson(2), 2, 400)
    p = visitPortfolio(p, D)
    const today = questsToday(p, D, ctx)
    expect(today.chestReady).toBe(true)
    const paid = claimChest(p, D, ctx)
    expect(paid.bank).toBe(p.bank + chestAmount(D))
    expect(paid.activity[D]).toBe(p.activity[D] + chestAmount(D))
    expect(paid.badges.chest).toBe(D) // the first chest is a badge
    expect(claimChest(paid, D, ctx)).toBe(paid) // once
    expect(questsToday(paid, D, ctx)).toMatchObject({ chestReady: false, claimed: true })
  })
})

describe('sync of the daily fields', () => {
  it('keeps the longer time, the best streak, the later due day and the newer day of quests', () => {
    const a = { ...parseProgress(null), time: { [D]: 100 }, bestStreak: 3, due: { q: D }, daily: { day: D, lessons: 1, correct: 0, perfect: 0, portfolio: false, claimed: false } }
    const b = { ...parseProgress(null), time: { [D]: 300 }, bestStreak: 9, due: { q: addDays(D, 2) }, daily: { day: addDays(D, 1), lessons: 0, correct: 2, perfect: 0, portfolio: false, claimed: false } }
    const m = mergeProgress(a, b, 'local')
    expect(m.time[D]).toBe(300)
    expect(m.bestStreak).toBe(9)
    expect(m.due.q).toBe(addDays(D, 2))
    expect(m.daily.day).toBe(addDays(D, 1))
  })
})
