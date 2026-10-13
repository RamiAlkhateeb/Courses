import { describe, expect, it } from 'vitest'
import { courses } from '../src/content/courses'
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
})
