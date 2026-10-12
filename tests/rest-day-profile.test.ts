import { describe, expect, it } from 'vitest'
import { parseProfile } from '../src/features/profile/store'
import { applyRestDay, bumpStreak, currentStreak, parseProgress, weekStart } from '../src/features/progress/store'
import { lessonTerms, lessonsFor } from '../src/features/lesson/lessons'
import { investing } from '../src/content/courses/investing'

describe('profile', () => {
  it('parses missing, corrupt and partial storage', () => {
    expect(parseProfile(null)).toEqual({ onboarded: false, minutes: 10 })
    expect(parseProfile('{nope')).toEqual({ onboarded: false, minutes: 10 })
    expect(parseProfile('{"onboarded":true,"trail":"investing","minutes":15,"junk":1}')).toEqual({
      onboarded: true,
      trail: 'investing',
      minutes: 15,
    })
  })
})

describe('rest day', () => {
  it('finds the Monday of a week', () => {
    expect(weekStart('2026-10-11')).toBe('2026-10-05') // a Sunday
    expect(weekStart('2026-10-05')).toBe('2026-10-05') // the Monday itself
  })

  it('keeps a streak alive across one missed day', () => {
    const p = { ...parseProgress(null), streak: { count: 7, lastDay: '2026-10-09' } }
    expect(currentStreak(p.streak, '2026-10-11')).toBe(0) // missed 10th: lost without a rest day
    const rested = applyRestDay(p, '2026-10-11')
    expect(rested.streak.lastDay).toBe('2026-10-10')
    expect(bumpStreak(rested.streak, '2026-10-11').count).toBe(8)
  })
})

describe('lesson terms', () => {
  it('skips bold phrases that are only numbers', async () => {
    const mod = await investing.loaders.basics()
    for (const lesson of lessonsFor(mod)) {
      for (const term of lessonTerms(lesson)) expect(term.en).toMatch(/\p{L}{3}/u)
    }
  })
})
