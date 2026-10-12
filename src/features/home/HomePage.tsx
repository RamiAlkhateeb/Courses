import { Link, useSearchParams } from 'react-router-dom'
import { buttonClass } from '../../components/ui'
import { useTranslation } from 'react-i18next'
import { AudienceBadges } from '../../components/AudienceBadges'
import { LogoMark } from '../../components/Logo'
import { ProgressRing } from '../../components/ProgressRing'
import {
  AUDIENCES,
  appCourses as courses,
  flatNav,
  getCourse,
  hasModule,
  type AudienceId,
  type Course,
  type CourseCategory,
} from '../../content/courses'
import type { Module } from '../../content/types'
import { useLocalized } from '../../content/useLocalized'
import { useModules } from '../../content/useModule'
import {
  formatDuration,
  learnHref,
  lessonKey,
  lessonMinutes,
  lessonsFor,
  moduleMinutes,
  nextInCourse,
  type Lesson,
} from '../../domain/lessons'
import { currentStreak, localDay, mistakes } from '../../domain/progress'
import { useProgress } from '../../state/useProgress'
import { CourseCover } from './CourseCover'
import styles from './HomePage.module.css'

/** Display order of the catalog's sections; a category with no courses is skipped. */
const CATEGORIES: CourseCategory[] = ['careers', 'business', 'management']

/** Home: a dashboard (continue + this week) for returning learners, then the course catalog. */
export function HomePage() {
  const { t: tUi } = useTranslation()
  const { progress } = useProgress()
  const [courseId, moduleId, lessonId] = progress.lastLesson?.split('/') ?? []
  const resume = getCourse(courseId) ? { courseId, moduleId, lessonId } : undefined
  // Audience filter, kept in the URL (?for=professionals) so a filtered catalog can be shared.
  const [search, setSearch] = useSearchParams()
  const param = search.get('for')
  const audience = AUDIENCES.find((a) => a === param)
  const shown = audience ? courses.filter((c) => c.audiences.includes(audience)) : courses
  const choose = (a?: AudienceId) =>
    setSearch(
      (prev) => {
        const next = new URLSearchParams(prev)
        if (a) next.set('for', a)
        else next.delete('for')
        return next
      },
      { replace: true, preventScrollReset: true },
    )

  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <LogoMark size={48} />
        <h1>{tUi('heroTitle')}</h1>
        <p>{tUi('homeIntro')}</p>
      </header>

      {resume && (
        <section className={styles.dashboard} aria-label={tUi('yourProgress')}>
          <ContinueCard {...resume} />
          <WeekCard />
        </section>
      )}

      <div className={styles.filter} role="group" aria-label={tUi('forAudience')}>
        <span className={styles.filterLabel}>{tUi('forAudience')}</span>
        <button type="button" aria-pressed={!audience} onClick={() => choose()}>
          {tUi('audienceAll')} <span className={styles.count}>{courses.length}</span>
        </button>
        {AUDIENCES.map((a) => (
          <button key={a} type="button" aria-pressed={audience === a} onClick={() => choose(a)}>
            {tUi(`audience.${a}`)} <span className={styles.count}>{courses.filter((c) => c.audiences.includes(a)).length}</span>
          </button>
        ))}
      </div>

      {CATEGORIES.map((category) => {
        const inCategory = shown.filter((c) => c.category === category)
        if (inCategory.length === 0) return null
        return (
          <section key={category} className={styles.category}>
            <h2 className={styles.categoryLabel}>{tUi(`category.${category}`)}</h2>
            <div className={styles.cards}>
              {inCategory.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}

/** Written modules of a course, loaded, in course order (empty until all have loaded). */
function useCourseModules(course: Course): Module[] {
  const ids = flatNav(course)
    .map((i) => i.id)
    .filter((id) => hasModule(course.id, id))
  const mods: Record<string, Module> = useModules(course.id, ids)
  return ids.every((id) => mods[id]) ? ids.map((id) => mods[id]) : []
}

/** "Continue": the lesson after the one finished last, else the course's next unfinished lesson. */
function ContinueCard({ courseId, moduleId, lessonId }: { courseId: string; moduleId: string; lessonId: string }) {
  const t = useLocalized()
  const { t: tUi } = useTranslation()
  const { progress } = useProgress()
  const course = getCourse(courseId)!
  const mods = useCourseModules(course)
  if (mods.length === 0) return <div className={styles.continueCard} aria-busy />

  const isDone = (mod: Module, lesson: Lesson) => progress.lessonsDone.includes(lessonKey(courseId, mod.id, lesson.id))
  const mod = mods.find((w) => w.id === moduleId)
  const lessons = mod ? lessonsFor(mod) : []
  const after = lessons.slice(lessons.findIndex((l) => l.id === lessonId) + 1).find((l) => mod && !isDone(mod, l))
  const next = mod && after ? { mod, lesson: after } : nextInCourse(courseId, mods, progress.lessonsDone)
  const wrong = mistakes(
    mods.flatMap((w) => w.questions.map((q) => q.id)),
    progress.answers,
  ).length

  if (!next) {
    return (
      <div className={styles.continueCard}>
        <p className={styles.cardKicker}>{t(course.title)}</p>
        <h2>{tUi('courseComplete')}</h2>
        <Link className={styles.textLink} to={`/course/${courseId}`}>
          {tUi('openCourse')} →
        </Link>
      </div>
    )
  }

  const nav = flatNav(course)
  const chapter = nav.findIndex((i) => i.id === next.mod.id)
  const title =
    next.lesson.parts > 1
      ? tUi('lessonOfParts', { title: t(next.lesson.title), n: next.lesson.part, of: next.lesson.parts })
      : t(next.lesson.title)

  return (
    <div className={styles.continueCard}>
      <p className={styles.cardKicker}>
        {tUi('continueLabel')} · {t(course.title)}
      </p>
      <h2>{title}</h2>
      <p className={styles.cardMeta}>
        {tUi('chapterN', { n: chapter + 1 })} · {t(nav[chapter].title)} · {tUi('minutes', { n: lessonMinutes(next.lesson) })}
      </p>
      <div className={styles.cardActions}>
        <Link className={buttonClass({ size: 'sm' })} to={learnHref(courseId, next.mod.id, next.lesson.id)}>
          {tUi('continueCourse')} <span aria-hidden>→</span>
        </Link>
        {wrong > 0 && (
          <Link className={styles.textLink} to={`/course/${courseId}/review`}>
            {tUi('reviewMistakes', { n: wrong })}
          </Link>
        )}
      </div>
    </div>
  )
}

/** The last 7 days of XP as bars, plus this week's XP, the streak and total XP. */
function WeekCard() {
  const { t: tUi, i18n } = useTranslation()
  const { progress } = useProgress()
  const today = new Date()
  const days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(today.getFullYear(), today.getMonth(), today.getDate() - (6 - i))
    return { date, xp: progress.activity[localDay(date)] ?? 0 }
  })
  const weekXp = days.reduce((n, d) => n + d.xp, 0)
  const max = Math.max(50, ...days.map((d) => d.xp))
  const weekday = new Intl.DateTimeFormat(i18n.language, { weekday: 'narrow' })

  return (
    <div className={styles.weekCard}>
      <p className={styles.cardKicker}>{tUi('thisWeek')}</p>
      <div className={styles.bars} role="img" aria-label={tUi('weekXp', { n: weekXp })}>
        {days.map((d, i) => (
          <div key={i} className={`${styles.barCol} ${i === 6 ? styles.today : ''}`}>
            <span className={styles.bar}>
              <span style={{ height: `${(d.xp / max) * 100}%` }} />
            </span>
            <span className={styles.barDay}>{weekday.format(d.date)}</span>
          </div>
        ))}
      </div>
      <dl className={styles.weekStats}>
        <div>
          <dt>{tUi('weekXpLabel')}</dt>
          <dd>{weekXp}</dd>
        </div>
        <div>
          <dt>{tUi('streak')}</dt>
          <dd>🔥 {currentStreak(progress.streak, localDay())}</dd>
        </div>
        <div>
          <dt>{tUi('totalXpLabel')}</dt>
          <dd>{progress.xp}</dd>
        </div>
      </dl>
    </div>
  )
}

function CourseCard({ course }: { course: Course }) {
  const t = useLocalized()
  const { t: tUi } = useTranslation()
  const { progress } = useProgress()
  const mods = useCourseModules(course)
  const lessons = mods.flatMap((w) => lessonsFor(w).map((l) => ({ w, l })))
  const done = lessons.filter(({ w, l }) => progress.lessonsDone.includes(lessonKey(course.id, w.id, l.id))).length
  const minutes = mods.reduce((n, w) => n + moduleMinutes(lessonsFor(w)), 0)
  const chapters = flatNav(course).filter((i) => hasModule(course.id, i.id)).length

  return (
    <Link to={`/course/${course.id}`} className={styles.card}>
      <CourseCover seed={course.id} />
      <div className={styles.cardBody}>
        <div className={styles.cardTop}>
          <h3>{t(course.title)}</h3>
          {chapters === 0 ? (
            <span className={styles.soonBadge}>{tUi('comingSoon')}</span>
          ) : (
            mods.length > 0 && <ProgressRing done={done} total={lessons.length} size={40} />
          )}
        </div>
        <AudienceBadges audiences={course.audiences} />
        <p>{t(course.description)}</p>
        <span className={styles.cardMeta}>
          {chapters === 0
            ? tUi('plannedChapters', { count: flatNav(course).length })
            : tUi('nChapters', { count: chapters })}
          {mods.length > 0 && ` · ${tUi('nLessons', { count: lessons.length })} · ${formatDuration(minutes, tUi)}`}
        </span>
      </div>
    </Link>
  )
}
