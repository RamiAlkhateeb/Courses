import { describe, expect, it } from 'vitest'
import { parseProfile } from '../src/domain/profile'
import { lessonTerms, lessonsFor } from '../src/domain/lessons'
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

describe('lesson terms', () => {
  it('skips bold phrases that are only numbers', async () => {
    const mod = await investing.loaders.basics()
    for (const lesson of lessonsFor(mod)) {
      for (const term of lessonTerms(lesson)) expect(term.en).toMatch(/\p{L}{3}/u)
    }
  })
})
