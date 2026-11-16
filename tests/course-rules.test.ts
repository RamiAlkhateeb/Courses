import { describe, expect, it } from 'vitest'
import { checkedCourses } from '../src/content/courses'
import { lessonsFor } from '../src/domain/lessons'

// Rules from CLAUDE.md for offered (and draft) courses: every question explains its answer, and every lesson has at
// least two quick checks.
async function modules() {
  const mods = []
  for (const course of checkedCourses) for (const load of Object.values(course.loaders)) mods.push(await load())
  return mods
}

describe('offered and draft courses', () => {
  it('every question has an explain, in English and Arabic', async () => {
    const missing: string[] = []
    for (const mod of await modules())
      for (const q of mod.questions) if (!q.explain?.en?.trim() || !q.explain?.ar?.trim()) missing.push(`${mod.courseId}/${q.id}`)
    expect(missing).toEqual([])
  })

  it('every lesson has at least 2 quick checks', async () => {
    const short: string[] = []
    for (const mod of await modules())
      for (const lesson of lessonsFor(mod)) {
        const checks = lesson.steps.filter((s) => s.kind === 'question').length
        if (checks < 2) short.push(`${mod.courseId}/${mod.id}/${lesson.id}: ${checks}`)
      }
    expect(short).toEqual([])
  })
})
