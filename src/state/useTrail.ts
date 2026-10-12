import { flatNav, getCourse, hasModule, type Course } from '../content/courses'
import type { Module } from '../content/types'
import { useModules } from '../content/useModule'
import { unitStates, type NodeState } from '../domain/pathStates'
import { lessonsFor, nextInCourse, type Lesson } from '../domain/lessons'
import { useProgress } from './useProgress'
import { DEFAULT_TRAIL } from '../domain/profile'
import { useProfile } from './profile'

export interface Chapter {
  id: string
  title: Course['groups'][number]['items'][number]['title']
  /** 1-based unit (group) and camp (chapter within the unit) */
  unit: number
  camp: number
  mod?: Module
  lessons: Lesson[]
  states: NodeState[]
  done: number
}

/** Courses with at least one written module: the ones that can be a trail. */
export const hasContent = (c: Course) => flatNav(c).some((i) => hasModule(c.id, i.id))

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
    g.items.map((item, ci) => ({ item, unit: gi + 1, camp: ci + 1 })).filter((x) => hasModule(course.id, x.item.id)),
  )
  const mods = useModules(course.id, written.map((w) => w.item.id))
  const loaded = written.every((w) => mods[w.item.id])
  const chapters: Chapter[] = written.map(({ item, unit, camp }) => {
    const mod = mods[item.id]
    const lessons = mod ? lessonsFor(mod) : []
    const states = unitStates(lessons.map((l) => l.id), progress.lessonsDone, `${course.id}/${item.id}`)
    return { id: item.id, title: item.title, unit, camp, mod, lessons, states, done: states.filter((s) => s === 'done').length }
  })
  const next = loaded && chapters.length ? nextInCourse(course.id, chapters.map((c) => c.mod!), progress.lessonsDone) : null
  const current = chapters.find((c) => c.id === next?.mod.id) ?? chapters[chapters.length - 1]
  const totalLessons = chapters.reduce((n, c) => n + c.lessons.length, 0)
  const doneLessons = chapters.reduce((n, c) => n + c.done, 0)
  return { course, chapters, loaded, next, current, totalLessons, doneLessons }
}
