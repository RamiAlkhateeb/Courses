import { flatNav, getCourse, hasWeek, type Course } from '../../content/courses'
import type { Week } from '../../content/types'
import { useWeeks } from '../../content/useWeek'
import { unitStates, type NodeState } from '../course/pathStates'
import { lessonsFor, nextInCourse, type Lesson } from '../lesson/lessons'
import { useProgress } from '../progress/useProgress'
import { DEFAULT_TRAIL, useProfile } from '../profile/store'

export interface Chapter {
  id: string
  title: Course['groups'][number]['items'][number]['title']
  /** 1-based unit (group) and camp (chapter within the unit) */
  unit: number
  camp: number
  week?: Week
  lessons: Lesson[]
  states: NodeState[]
  done: number
}

/** Courses with at least one written module: the ones that can be a trail. */
export const hasContent = (c: Course) => flatNav(c).some((i) => hasWeek(c.id, i.id))

/** The profile's active trail (falls back to Investing). */
export function useTrailId(): string {
  const { trail } = useProfile()
  const course = getCourse(trail)
  return course && hasContent(course) ? course.id : DEFAULT_TRAIL
}

/** A trail's written chapters with their lessons and path states, plus the chapter/lesson to continue with. */
export function useTrail(courseId: string) {
  const course = getCourse(courseId)!
  const { progress } = useProgress()
  const written = course.groups.flatMap((g, gi) =>
    g.items.map((item, ci) => ({ item, unit: gi + 1, camp: ci + 1 })).filter((x) => hasWeek(course.id, x.item.id)),
  )
  const weeks = useWeeks(course.id, written.map((w) => w.item.id))
  const loaded = written.every((w) => weeks[w.item.id])
  const chapters: Chapter[] = written.map(({ item, unit, camp }) => {
    const week = weeks[item.id]
    const lessons = week ? lessonsFor(week) : []
    const states = unitStates(lessons.map((l) => l.id), progress.lessonsDone, `${course.id}/${item.id}`)
    return { id: item.id, title: item.title, unit, camp, week, lessons, states, done: states.filter((s) => s === 'done').length }
  })
  const next = loaded && chapters.length ? nextInCourse(course.id, chapters.map((c) => c.week!), progress.lessonsDone) : null
  const current = chapters.find((c) => c.id === next?.week.id) ?? chapters[chapters.length - 1]
  const totalLessons = chapters.reduce((n, c) => n + c.lessons.length, 0)
  const doneLessons = chapters.reduce((n, c) => n + c.done, 0)
  return { course, chapters, loaded, next, current, totalLessons, doneLessons }
}
