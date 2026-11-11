import { describe, expect, it } from 'vitest'
import { awardBadges, BADGES, badgeShelf, newBadges, playgroundFacts, unitFacts, type BadgeFacts } from '../src/domain/badges'
import { levelFor, levelPoints, levelUp, LEVELS } from '../src/domain/levels'
import { completeLesson, doubleToday, finishedOn, parseProgress, payoutFor } from '../src/domain/progress'
import { emptyPlayground } from '../src/domain/playground/engine'
import { mergeProgress } from '../src/domain/sync'

const none: BadgeFacts = { lessons: 0, bestStreak: 0, perfect: 0, unitsDone: 0, courseDone: false, chestOpened: false, firstBuy: false, firstPayout: false, seasonDone: false, goalMet: false }

describe('badges', () => {
  it('have unique ids, and nothing is earned at the start', () => {
    expect(new Set(BADGES.map((b) => b.id)).size).toBe(BADGES.length)
    expect(BADGES.length).toBeGreaterThanOrEqual(15)
    expect(newBadges(parseProgress(null), none)).toEqual([])
  })

  it('are saved with the day they were earned, and never taken away', () => {
    const p = parseProgress(null)
    const a = awardBadges(p, { ...none, lessons: 1, bestStreak: 3 }, '2026-11-01')
    expect(a.badges).toEqual({ 'first-lesson': '2026-11-01', 'streak-3': '2026-11-01' })
    // The streak breaks later: the badge stays, with its first day
    const b = awardBadges(a, { ...none, lessons: 2, bestStreak: 0 }, '2026-11-05')
    expect(b).toBe(a)
    expect(awardBadges(a, { ...none, lessons: 10, bestStreak: 3 }, '2026-11-09').badges['lessons-10']).toBe('2026-11-09')
  })

  it('shelf: earned with their days, then the next locked ones', () => {
    const p = { badges: { 'first-lesson': '2026-11-01' } }
    const shelf = badgeShelf(p, 2)
    expect(shelf.earned.map((b) => [b.id, b.day])).toEqual([['first-lesson', '2026-11-01']])
    expect(shelf.locked.map((b) => b.id)).toEqual(['streak-3', 'perfect-1'])
  })

  it('count finished units and the whole course', () => {
    const units = [['c/a/1', 'c/a/2'], ['c/b/1']]
    expect(unitFacts(units, ['c/a/1'])).toEqual({ unitsDone: 0, courseDone: false })
    expect(unitFacts(units, ['c/a/1', 'c/a/2'])).toEqual({ unitsDone: 1, courseDone: false })
    expect(unitFacts(units, ['c/a/1', 'c/a/2', 'c/b/1'])).toEqual({ unitsDone: 2, courseDone: true })
    expect(unitFacts([], [])).toEqual({ unitsDone: 0, courseDone: false })
  })

  it('read simulator firsts from the season', () => {
    expect(playgroundFacts(emptyPlayground)).toEqual({ firstBuy: false, firstPayout: false, seasonDone: false, goalMet: false })
    expect(playgroundFacts({ ...emptyPlayground, season: 2 })).toMatchObject({ firstBuy: true, seasonDone: true })
    expect(playgroundFacts({ ...emptyPlayground, income: 3 }).firstPayout).toBe(true)
  })
})

describe('levels', () => {
  it('grow with lessons and right answers, from level 1', () => {
    expect(levelFor(0)).toEqual({ level: 1, points: 0, from: 0, to: LEVELS[1] })
    expect(levelFor(LEVELS[1]).level).toBe(2)
    expect(levelFor(10_000)).toMatchObject({ level: LEVELS.length, to: null })
    const p = { lessonsDone: ['a', 'b'], answers: { q1: { selected: 0, correct: true }, q2: { selected: 1, correct: false } } }
    expect(levelPoints(p)).toBe(21)
  })

  it('say when a lesson brings a new level', () => {
    const before = { lessonsDone: ['a', 'b', 'c'], answers: {} }
    expect(levelUp(before, { lessonsDone: [...before.lessonsDone, 'd'], answers: {} })).toBe(2)
    expect(levelUp(before, { lessonsDone: before.lessonsDone, answers: { q: { selected: 0, correct: true } } })).toBeNull()
  })
})

describe('2× today, completion dates', () => {
  const streak3 = { ...parseProgress(null), streak: { count: 3, lastDay: '2026-11-10' } }

  it('the first lesson of the day pays double once a 3-day streak is alive', () => {
    expect(doubleToday(streak3, '2026-11-11')).toBe(true)
    expect(payoutFor(streak3, 2, 'c/m/l', '2026-11-11')).toBe(40)
    expect(payoutFor(streak3, 2, 'c/m/l')).toBe(20) // without a day, the plain rate
    const after = completeLesson(streak3, 2, '2026-11-11', 'c/m/l', 2)
    expect(after.bank).toBe(1040)
    expect(doubleToday(after, '2026-11-11')).toBe(false) // once a day
    expect(completeLesson(after, 2, '2026-11-11', 'c/m/l2', 2).bank).toBe(1060)
    expect(doubleToday({ ...streak3, streak: { count: 2, lastDay: '2026-11-10' } }, '2026-11-11')).toBe(false)
  })

  it('keeps the day each lesson was first finished, and the day a set was all finished', () => {
    const p = completeLesson(parseProgress(null), 1, '2026-11-01', 'c/m/a')
    const q = completeLesson(completeLesson(p, 1, '2026-11-03', 'c/m/b'), 1, '2026-11-05', 'c/m/a') // a replay keeps the first day
    expect(q.completed).toEqual({ 'c/m/a': '2026-11-01', 'c/m/b': '2026-11-03' })
    expect(finishedOn(q, ['c/m/a', 'c/m/b'])).toBe('2026-11-03')
    expect(finishedOn(q, ['c/m/a', 'c/m/c'])).toBe('')
    expect(parseProgress(JSON.stringify({ completed: { x: '2026-01-02', y: 5, z: 'soon' } })).completed).toEqual({ x: '2026-01-02' })
  })

  it('sync keeps the earlier day for completions and badges', () => {
    const a = { ...parseProgress(null), completed: { k: '2026-11-03' }, badges: { 'first-lesson': '2026-11-03' } }
    const b = { ...parseProgress(null), completed: { k: '2026-11-01', j: '2026-11-02' }, badges: { 'first-lesson': '2026-11-05' } }
    const m = mergeProgress(a, b, 'local')
    expect(m.completed).toEqual({ k: '2026-11-01', j: '2026-11-02' })
    expect(m.badges).toEqual({ 'first-lesson': '2026-11-03' })
  })
})
