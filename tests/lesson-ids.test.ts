import { describe, expect, it } from 'vitest'
import { appCourses, courses } from '../src/content/courses'
import { toCards } from '../src/domain/chunks'
import { lessonsFor } from '../src/domain/lessons'

// Finished lessons are saved as `course/module/lessonId`, and lesson ids come from how a section is cut into parts
// (see chunks.ts). Editing content can therefore move or drop ids and silently clear learners' ✓ marks.
// If this snapshot fails, the change is deliberate only if you accept that: run `npx vitest -u` to update it.
describe('lesson ids', () => {
  it('stay the same unless the change is deliberate', async () => {
    const ids: Record<string, string[]> = {}
    for (const course of courses) {
      for (const [id, load] of Object.entries(course.loaders)) {
        ids[`${course.id}/${id}`] = lessonsFor(await load()).map((l) => l.id)
      }
    }
    expect(ids).toMatchSnapshot()
  })

  it('are fixed by the author in every offered course', async () => {
    for (const course of appCourses) {
      for (const [id, load] of Object.entries(course.loaders)) {
        const mod = await load()
        const all: string[] = []
        for (const section of mod.sections) {
          const where = `${course.id}/${id}#${section.id}`
          expect(section.lessonIds?.length, `${where}: add \`lessons: [...]\` to the section`).toBeGreaterThan(0)
          const cards = Math.max(1, toCards(section.blocks).cards.length)
          expect(section.lessonIds!.length, `${where}: more lesson ids than cards`).toBeLessThanOrEqual(cards)
          all.push(...section.lessonIds!)
        }
        expect(new Set(all).size, `${course.id}/${id}: duplicate lesson ids`).toBe(all.length)
        expect(lessonsFor(mod).map((l) => l.id)).toEqual(all)
      }
    }
  })
})
