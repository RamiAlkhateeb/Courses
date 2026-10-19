import { describe, expect, it } from 'vitest'
import { COMING_SOON_IDS, courses, ENABLED_COURSE_IDS } from '../src/content/courses'

describe('courses page', () => {
  it('teases a few hidden courses that exist and are not already offered', () => {
    expect(COMING_SOON_IDS.length).toBeGreaterThanOrEqual(2)
    expect(COMING_SOON_IDS.length).toBeLessThanOrEqual(3)
    for (const id of COMING_SOON_IDS) {
      expect(courses.some((c) => c.id === id)).toBe(true)
      expect(ENABLED_COURSE_IDS).not.toContain(id)
    }
  })
})
