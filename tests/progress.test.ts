import { describe, expect, it } from 'vitest'
import {
  bumpStreak,
  completeLesson,
  currentStreak,
  daysBetween,
  payoutFor,
  localDay,
  markRead,
  MAX_BOX,
  addActivity,
  mistakes,
  parseProgress,
  pickLessonQuestions,
  recordAnswer,
  recordReview,
} from '../src/domain/progress'

const EMPTY = { answers: {}, sectionsRead: {}, bank: 1000, streak: { count: 0, lastDay: '' }, boxes: {}, lessonsDone: [], activity: {}, perfect: 0, freezes: 0 }

describe('progress store helpers', () => {
  it('parses missing or corrupt storage as empty progress', () => {
    expect(parseProgress(null)).toEqual(EMPTY)
    expect(parseProgress('{not json')).toEqual(EMPTY)
  })

  it('reads progress saved before lessons existed, filling the new fields with defaults', () => {
    const old = JSON.stringify({ answers: { 'net-q001': { selected: 0, correct: true } }, sectionsRead: {} })
    expect(parseProgress(old)).toEqual({ ...EMPTY, bank: 1010, answers: { 'net-q001': { selected: 0, correct: true } } })
  })

  it('ignores wrongly typed lesson fields', () => {
    expect(parseProgress(JSON.stringify({ xp: 'lots', streak: [], boxes: null, lessonsDone: 'x' }))).toEqual(EMPTY)
    expect(parseProgress(JSON.stringify({ lessonsDone: ['a/b/c', 3] })).lessonsDone).toEqual(['a/b/c'])
  })

  it('records the latest answer per question without mutating', () => {
    const empty = parseProgress(null)
    const first = recordAnswer(empty, 'net-q001', 1, false)
    const second = recordAnswer(first, 'net-q001', 0, true)
    expect(empty.answers).toEqual({})
    expect(second.answers['net-q001']).toEqual({ selected: 0, correct: true })
  })

  it('marks a section read once and returns the same object when nothing changes', () => {
    const p = markRead(parseProgress(null), 'tech-interview/resume', 'template')
    expect(markRead(p, 'tech-interview/resume', 'template')).toBe(p)
    expect(markRead(p, 'tech-interview/resume', 'content').sectionsRead['tech-interview/resume']).toEqual(['template', 'content'])
  })
})

describe('lesson helpers', () => {
  it('formats the local day and counts days across month and year ends', () => {
    expect(localDay(new Date(2026, 0, 5))).toBe('2026-01-05')
    expect(daysBetween('2026-02-28', '2026-03-01')).toBe(1)
    expect(daysBetween('2025-12-31', '2026-01-01')).toBe(1)
    expect(daysBetween('', '2026-01-01')).toBeNaN()
  })

  it('starts, keeps, extends and restarts the streak', () => {
    const none = { count: 0, lastDay: '' }
    const day1 = bumpStreak(none, '2026-10-01')
    expect(day1).toEqual({ count: 1, lastDay: '2026-10-01' })
    expect(bumpStreak(day1, '2026-10-01')).toBe(day1)
    const day2 = bumpStreak(day1, '2026-10-02')
    expect(day2).toEqual({ count: 2, lastDay: '2026-10-02' })
    expect(bumpStreak(day2, '2026-10-05')).toEqual({ count: 1, lastDay: '2026-10-05' })
  })

  it('shows the streak until the day after the last lesson, then 0', () => {
    const s = { count: 3, lastDay: '2026-10-02' }
    expect(currentStreak(s, '2026-10-02')).toBe(3)
    expect(currentStreak(s, '2026-10-03')).toBe(3)
    expect(currentStreak(s, '2026-10-04')).toBe(0)
    expect(currentStreak({ count: 0, lastDay: '' }, '2026-10-04')).toBe(0)
  })

  it('pays $10 per correct answer, only the first time a roadmap lesson is finished', () => {
    const fresh = parseProgress(null)
    const key = 'investing/basics/why'
    expect(payoutFor(fresh, 4, key)).toBe(40)
    expect(payoutFor(fresh, 0, key)).toBe(0)
    expect(payoutFor(fresh, 5)).toBe(0) // practice and review runs have no lesson key: no pay
    const done = completeLesson(fresh, 4, '2026-10-06', key)
    expect(payoutFor(done, 5, key)).toBe(0) // a replay
  })

  it('completes a lesson: pays the bank and bumps the streak', () => {
    const p = completeLesson(parseProgress(null), 4, '2026-10-06', 'investing/basics/why')
    expect(p.bank).toBe(1040)
    expect(p.streak).toEqual({ count: 1, lastDay: '2026-10-06' })
    expect(completeLesson(p, 5, '2026-10-06', 'investing/basics/why').bank).toBe(1040) // replay pays nothing
    expect(completeLesson(p, 5, '2026-10-06', 'investing/basics/risk').bank).toBe(1090)
  })

  it('marks a roadmap lesson done once', () => {
    const p = completeLesson(parseProgress(null), 1, '2026-10-06', 'tech-interview/resume/template')
    expect(p.lessonsDone).toEqual(['tech-interview/resume/template'])
    expect(completeLesson(p, 2, '2026-10-07', 'tech-interview/resume/template').lessonsDone).toBe(p.lessonsDone)
    expect(completeLesson(p, 2, '2026-10-07').lessonsDone).toEqual(['tech-interview/resume/template'])
  })

  it('moves Leitner boxes up on a right answer (capped) and back to 1 on a wrong one', () => {
    let p = parseProgress(null)
    for (let i = 0; i < MAX_BOX + 2; i++) p = recordReview(p, 'q', true)
    expect(p.boxes.q).toBe(MAX_BOX)
    expect(recordReview(p, 'q', false).boxes.q).toBe(1)
  })

  it('picks unseen and low-box questions first, up to the lesson size', () => {
    const boxes = { a: 3, b: 1, c: 5 }
    expect(pickLessonQuestions(['a', 'b', 'c', 'd'], boxes, 3, () => 0.5)).toEqual(['d', 'b', 'a'])
    expect(pickLessonQuestions(['a', 'b'], {}, 10)).toHaveLength(2)
  })
})

describe('dashboard data', () => {
  it('records the finished lesson and the day’s earnings', () => {
    const p = completeLesson(parseProgress(null), 2, '2026-10-08', 'tech-interview/resume/template')
    expect(p.lastLesson).toBe('tech-interview/resume/template')
    expect(p.activity).toEqual({ '2026-10-08': 20 })
    const practice = completeLesson(p, 1, '2026-10-08') // Practice: no lesson key, pays nothing
    expect(practice.lastLesson).toBe('tech-interview/resume/template')
    expect(practice.activity['2026-10-08']).toBe(20)
    expect(completeLesson(parseProgress(null), 3, '2026-10-09').activity).toEqual({ '2026-10-09': 0 }) // the day still counts
  })

  it('keeps 60 days of activity', () => {
    const a = addActivity({ '2026-08-01': 10, '2026-09-01': 20 }, '2026-10-08', 5)
    expect(a).toEqual({ '2026-09-01': 20, '2026-10-08': 5 })
  })

  it('parses saved progress without the dashboard fields', () => {
    const p = parseProgress(JSON.stringify({ lastLesson: 3, activity: [] }))
    expect(p.lastLesson).toBeUndefined()
    expect(p.activity).toEqual({})
  })

  it('lists questions whose latest answer was wrong, in the given order', () => {
    const answers = { b: { selected: 1, correct: false }, a: { selected: 0, correct: false }, c: { selected: 0, correct: true } }
    expect(mistakes(['a', 'b', 'c', 'd'], answers)).toEqual(['a', 'b'])
  })
})

describe('progress v1 → v2 migration', () => {
  const v1 = JSON.stringify({
    answers: { a: { selected: 0, correct: true }, b: { selected: 1, correct: false }, c: { selected: 2, correct: true } },
    xp: 540,
    streak: { count: 4, lastDay: '2026-10-07' },
    lessonsDone: ['investing/basics/why'],
    activity: { '2026-10-07': 35 },
  })

  it('gives the starting bank plus $10 per answer that is right, and drops the XP', () => {
    const p = parseProgress(v1)
    expect(p.bank).toBe(1020)
    expect('xp' in p).toBe(false)
  })

  it('keeps everything else', () => {
    const p = parseProgress(v1)
    expect(p.streak).toEqual({ count: 4, lastDay: '2026-10-07' })
    expect(p.lessonsDone).toEqual(['investing/basics/why'])
    expect(p.activity).toEqual({ '2026-10-07': 35 })
    expect(Object.keys(p.answers)).toHaveLength(3)
  })

  it('does not migrate twice: a saved bank wins', () => {
    const v2 = JSON.stringify({ ...JSON.parse(v1), bank: 1500 })
    expect(parseProgress(v2).bank).toBe(1500)
  })

  it('treats a player with no answers as new', () => {
    expect(parseProgress(JSON.stringify({ xp: 0 })).bank).toBe(1000)
  })
})

describe('progress store key', () => {
  it('reads a saved v1 value through the v2 store and then saves under v2', async () => {
    const data = new Map<string, string>([['progress:v1', JSON.stringify({ answers: { a: { selected: 0, correct: true } }, xp: 90 })]])
    const storage = { getItem: (k: string) => data.get(k) ?? null, setItem: (k: string, v: string) => void data.set(k, v) }
    const { createPersistedStore } = await import('../src/state/createPersistedStore')
    const store = createPersistedStore({ key: 'progress:v2', legacyKeys: ['progress:v1'], empty: parseProgress(null), parse: parseProgress, storage })
    expect(store.get().bank).toBe(1010)
    store.update((p) => ({ ...p, bank: p.bank + 40 }))
    expect(JSON.parse(data.get('progress:v2')!).bank).toBe(1050)
    expect(JSON.parse(data.get('progress:v1')!).xp).toBe(90) // the old value is left alone
  })

  it('counts a lesson with every question right once, on its first finish only', () => {
    const k = 'investing/basics/why'
    const first = completeLesson(parseProgress(null), 4, '2026-10-06', k, 4)
    expect(first.perfect).toBe(1)
    expect(completeLesson(first, 4, '2026-10-07', k, 4).perfect).toBe(1) // a replay adds nothing
    expect(completeLesson(parseProgress(null), 3, '2026-10-06', k, 4).perfect).toBe(0) // a miss
    expect(parseProgress(JSON.stringify({ perfect: -2 })).perfect).toBe(0)
  })
})
