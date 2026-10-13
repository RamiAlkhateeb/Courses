import { describe, expect, it } from 'vitest'
import { mergeProfile, mergeProgress, progressIsEmpty, signInPlan, walletSide } from '../src/domain/sync'
import { emptyProfile } from '../src/domain/profile'
import { emptyProgress, type Progress } from '../src/domain/progress'

const p = (over: Partial<Progress>): Progress => ({ ...emptyProgress, ...over })

describe('merging progress from this device and the account', () => {
  it('keeps every finished lesson and section from both sides', () => {
    const local = p({ lessonsDone: ['a/b/1', 'a/b/2'], sectionsRead: { 'a/b': ['s1'] } })
    const remote = p({ lessonsDone: ['a/b/2', 'a/b/3'], sectionsRead: { 'a/b': ['s2'], 'a/c': ['s1'] } })
    const m = mergeProgress(local, remote, 'local')
    expect([...m.lessonsDone].sort()).toEqual(['a/b/1', 'a/b/2', 'a/b/3'])
    expect(m.sectionsRead['a/b'].sort()).toEqual(['s1', 's2'])
    expect(m.sectionsRead['a/c']).toEqual(['s1'])
  })

  it('takes the higher review box and the larger earnings for each day', () => {
    const m = mergeProgress(p({ boxes: { q1: 2, q2: 5 }, activity: { d1: 10, d2: 30 } }), p({ boxes: { q1: 4, q3: 1 }, activity: { d1: 20, d3: 5 } }), 'local')
    expect(m.boxes).toEqual({ q1: 4, q2: 5, q3: 1 })
    expect(m.activity).toEqual({ d1: 20, d2: 30, d3: 5 })
  })

  it('a right answer outranks an older wrong one, in either direction', () => {
    const right = { selected: 1, correct: true }
    const wrong = { selected: 0, correct: false }
    expect(mergeProgress(p({ answers: { q: wrong } }), p({ answers: { q: right } }), 'local').answers.q).toEqual(right)
    expect(mergeProgress(p({ answers: { q: right } }), p({ answers: { q: wrong } }), 'local').answers.q).toEqual(right)
    expect(mergeProgress(p({ answers: { a: wrong } }), p({ answers: { b: right } }), 'local').answers).toEqual({ a: wrong, b: right })
  })

  it('the streak with the later day wins; on the same day the longer one', () => {
    const early = { count: 9, lastDay: '2026-10-01' }
    const late = { count: 2, lastDay: '2026-10-05' }
    expect(mergeProgress(p({ streak: early }), p({ streak: late }), 'local').streak).toEqual(late)
    expect(mergeProgress(p({ streak: late }), p({ streak: early }), 'local').streak).toEqual(late)
    expect(mergeProgress(p({ streak: { count: 3, lastDay: 'x' } }), p({ streak: { count: 5, lastDay: 'x' } }), 'local').streak.count).toBe(5)
  })

  it('never adds two banks together: the wallet comes from exactly one side', () => {
    const local = p({ bank: 740 })
    const remote = p({ bank: 1240 })
    expect(mergeProgress(local, remote, 'local').bank).toBe(740)
    expect(mergeProgress(local, remote, 'remote').bank).toBe(1240)
  })

  it('keeps a last lesson, preferring the side with the later streak day', () => {
    const m = mergeProgress(p({ lastLesson: 'a/b/1', streak: { count: 1, lastDay: '2026-10-01' } }), p({ lastLesson: 'a/b/9', streak: { count: 1, lastDay: '2026-10-09' } }), 'local')
    expect(m.lastLesson).toBe('a/b/9')
    expect(mergeProgress(p({ lastLesson: 'a/b/1' }), p({}), 'local').lastLesson).toBe('a/b/1')
    expect('lastLesson' in mergeProgress(p({}), p({}), 'local')).toBe(false)
  })

  it('merging with nothing changes nothing, and merging twice is the same as once', () => {
    const x = p({ lessonsDone: ['a'], boxes: { q: 3 }, bank: 1100, activity: { d: 10 } })
    expect(mergeProgress(x, emptyProgress, 'local')).toMatchObject({ lessonsDone: ['a'], boxes: { q: 3 }, bank: 1100 })
    const once = mergeProgress(x, p({ lessonsDone: ['b'], boxes: { q: 5 } }), 'local')
    expect(mergeProgress(once, p({ lessonsDone: ['b'], boxes: { q: 5 } }), 'local')).toEqual(once)
  })
})

describe('profile, wallet and sign-in decisions', () => {
  it('takes the newer profile but never forgets that onboarding finished', () => {
    const local = { ...emptyProfile, onboarded: true, minutes: 10 }
    const remote = { ...emptyProfile, onboarded: false, minutes: 20, goal: 'invest' }
    expect(mergeProfile(local, remote, true)).toMatchObject({ onboarded: true, minutes: 20, goal: 'invest' })
    expect(mergeProfile(local, remote, false)).toMatchObject({ onboarded: true, minutes: 10 })
  })

  it('the wallet goes with the more recently saved side', () => {
    expect(walletSide('2026-10-01T10:00:00Z', '2026-10-02T10:00:00Z')).toBe('remote')
    expect(walletSide('2026-10-03T10:00:00Z', '2026-10-02T10:00:00Z')).toBe('local')
    expect(walletSide(undefined, '2026-10-02T10:00:00Z')).toBe('remote')
    expect(walletSide('2026-10-03T10:00:00Z', undefined)).toBe('local')
  })

  it("another account's leftovers never leak: a different owner means replace", () => {
    expect(signInPlan(null, 'u1')).toBe('merge') // a true guest
    expect(signInPlan('u1', 'u1')).toBe('merge') // same account again
    expect(signInPlan('u1', 'u2')).toBe('replace')
  })

  it('knows when a guest has nothing worth uploading', () => {
    expect(progressIsEmpty(emptyProgress)).toBe(true)
    expect(progressIsEmpty(p({ lessonsDone: ['a'] }))).toBe(false)
    expect(progressIsEmpty(p({ bank: 5000 }))).toBe(true)
  })
})
