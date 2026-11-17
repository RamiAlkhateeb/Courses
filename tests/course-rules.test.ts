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

  it('no Arabic text writes a number range as digit–digit (it shows reversed, so write من 3 إلى 6)', async () => {
    const found: string[] = []
    const walk = (value: unknown, where: string) => {
      if (Array.isArray(value)) value.forEach((v) => walk(v, where))
      else if (value && typeof value === 'object') {
        const o = value as Record<string, unknown>
        if (typeof o.ar === 'string' && typeof o.en === 'string') {
          const range = o.ar.replace(/<[^>]+>/g, '').match(/\d[\d,.%]*\s?[–-]\s?\d[\d,.%]*/)
          if (range) found.push(`${where}: “${range[0]}”`)
        } else for (const v of Object.values(o)) walk(v, where)
      }
    }
    for (const mod of await modules()) walk(mod, `${mod.courseId}/${mod.id}`)
    expect(found).toEqual([])
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
