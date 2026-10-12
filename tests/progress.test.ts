import { describe, expect, it } from 'vitest'
import {
  bumpStreak,
  completeLesson,
  currentStreak,
  daysBetween,
  lessonXp,
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

const EMPTY = { answers: {}, sectionsRead: {}, xp: 0, streak: { count: 0, lastDay: '' }, boxes: {}, lessonsDone: [], activity: {} }

describe('progress store helpers', () => {
  it('parses missing or corrupt storage as empty progress', () => {
    expect(parseProgress(null)).toEqual(EMPTY)
    expect(parseProgress('{not json')).toEqual(EMPTY)
  })

  it('reads progress saved before lessons existed, filling the new fields with defaults', () => {
    const old = JSON.stringify({ answers: { 'net-q001': { selected: 0, correct: true } }, sectionsRead: {} })
    expect(parseProgress(old)).toEqual({ ...EMPTY, answers: { 'net-q001': { selected: 0, correct: true } } })
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

  it('gives base XP, XP per correct answer and a perfect-lesson bonus', () => {
    expect(lessonXp(0, 5)).toBe(5)
    expect(lessonXp(3, 5)).toBe(35)
    expect(lessonXp(5, 5)).toBe(75)
    expect(lessonXp(0, 0)).toBe(5) // reading-only lesson: base XP, no perfect bonus
  })

  it('completes a lesson: adds XP and bumps the streak', () => {
    const p = completeLesson(parseProgress(null), 4, 5, '2026-10-06')
    expect(p.xp).toBe(45)
    expect(p.streak).toEqual({ count: 1, lastDay: '2026-10-06' })
    expect(completeLesson(p, 5, 5, '2026-10-06').xp).toBe(120)
  })

  it('marks a roadmap lesson done once', () => {
    const p = completeLesson(parseProgress(null), 1, 2, '2026-10-06', 'tech-interview/resume/template')
    expect(p.lessonsDone).toEqual(['tech-interview/resume/template'])
    expect(completeLesson(p, 2, 2, '2026-10-07', 'tech-interview/resume/template').lessonsDone).toBe(p.lessonsDone)
    expect(completeLesson(p, 2, 2, '2026-10-07').lessonsDone).toEqual(['tech-interview/resume/template'])
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
  it('records the finished lesson and the day’s XP', () => {
    const p = completeLesson(parseProgress(null), 2, 2, '2026-10-08', 'tech-interview/resume/template')
    expect(p.lastLesson).toBe('tech-interview/resume/template')
    expect(p.activity).toEqual({ '2026-10-08': 45 })
    const practice = completeLesson(p, 0, 1, '2026-10-08') // Practice: no lesson key
    expect(practice.lastLesson).toBe('tech-interview/resume/template')
    expect(practice.activity['2026-10-08']).toBe(50)
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

