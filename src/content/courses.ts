import type { Localized, Module } from './types'
import { techInterview } from './courses/tech-interview'
import { investing } from './courses/investing'
import { personalFinance } from './courses/personal-finance'
import { accounting } from './courses/accounting'
import { entrepreneurship } from './courses/entrepreneurship'
import { marketing } from './courses/marketing'
import { gameTheory } from './courses/game-theory'
import { dataAnalysis } from './courses/data-analysis'
import { management } from './courses/management'
import { operations } from './courses/operations'
import { costAccounting } from './courses/cost-accounting'
import { decisionTheory } from './courses/decision-theory'
import { financialManagement } from './courses/financial-management'
import { economics } from './courses/economics'
import { dss } from './courses/dss'

export interface NavItem {
  id: string
  title: Localized
}

export interface NavGroup {
  label: Localized
  items: NavItem[]
}

export type CourseCategory = 'careers' | 'business' | 'management'

/** Who a course is for; a course can serve several. Shown as badges and used by Home's filter. */
export type AudienceId = 'job-seekers' | 'professionals' | 'entrepreneurs'
export const AUDIENCES: AudienceId[] = ['job-seekers', 'professionals', 'entrepreneurs']

export interface Course {
  id: string
  category: CourseCategory
  /** At least one; see AUDIENCES. */
  audiences: AudienceId[]
  title: Localized
  description: Localized
  /** Shown above the module list, e.g. "educational only, not financial advice". */
  notice?: Localized
  /** "Who it's for", one sentence on the course page header. */
  audience?: Localized
  groups: NavGroup[]
  /** One dynamic import per module so each lands in its own chunk. A nav item without a loader
   *  shows a "soon" badge automatically. */
  loaders: Record<string, () => Promise<Module>>
}

// Add a course: create src/content/courses/<id>/index.ts exporting a `Course`, then list it here.
export const courses: Course[] = [
  techInterview,
  dataAnalysis,
  investing,
  personalFinance,
  accounting,
  costAccounting,
  financialManagement,
  economics,
  entrepreneurship,
  marketing,
  management,
  operations,
  decisionTheory,
  gameTheory,
  dss,
]

/** The courses the app offers. The rest stay in the repo (content, tests) but are hidden until they come back. */
export const ENABLED_COURSE_IDS = ['investing']
export const appCourses = courses.filter((c) => ENABLED_COURSE_IDS.includes(c.id))

export const getCourse = (id: string | undefined) => courses.find((c) => c.id === id)

export const moduleHref = (courseId: string, moduleId: string) => `/course/${courseId}/${moduleId}`
export const practiceHref = (courseId: string, moduleId: string) => `${moduleHref(courseId, moduleId)}/lesson`

/** A course's modules in reading order — used for prev/next navigation. Not-yet-written modules stay
 *  in the list so a "coming soon" nav button can still show their title. */
export const flatNav = (course: Course) => course.groups.flatMap((g) => g.items)

export const hasModule = (courseId: string, moduleId: string) => {
  const course = getCourse(courseId)
  return Boolean(course && moduleId in course.loaders)
}

export const loadModule = (courseId: string, moduleId: string) => getCourse(courseId)!.loaders[moduleId]()
