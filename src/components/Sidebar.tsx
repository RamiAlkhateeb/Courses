// The laptop sidebar (≥1024px, `useWide`): the brand, the main pages, and every course: each offered course opens and
// closes on its own to show its units and lessons marked done, next or locked, as on Learn (the active one starts open),
// then the coming-soon courses as plain rows. Loaded on its own, only on a wide window, so phones never
// download it.
import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { appCourses, COMING_SOON_IDS, coursePath, courses, getCourse, type Course } from '../content/courses'
import { SIMULATOR_ON } from '../content/features'
import { useLocalized } from '../content/useLocalized'
import { canOpenLesson, lessonOrder } from '../domain/access'
import { learnHref } from '../domain/lessons'
import { portfolioOpen } from '../domain/playground/practice'
import { playgroundStore } from '../state/playground'
import { useGuestLimited } from '../state/useAccess'
import { useProgress } from '../state/useProgress'
import { useStore } from '../state/useStore'
import { useTrail, useTrailId } from '../state/useTrail'
import { Logo } from './Logo'
import { Icon, type IconName } from './ui'
import styles from './Sidebar.module.css'

type Here = RegExpMatchArray | null

export function Sidebar() {
  const { t } = useTranslation()
  const tc = useLocalized()
  const { pathname } = useLocation()
  const activeId = useTrailId()
  const course = getCourse(activeId)!
  const { progress } = useProgress()
  const pg = useStore(playgroundStore)
  // The lesson on screen, if any: /course/:courseId/:moduleId/learn/:lessonId
  const here = pathname.match(/^\/course\/([^/]+)\/([^/]+)\/learn\/([^/]+)/)
  const offered = new Set(appCourses.map((c) => c.id))
  const soon = COMING_SOON_IDS.map((id) => courses.find((c) => c.id === id)).filter((c): c is Course => !!c && !offered.has(c.id))

  const links: { to: string; icon: IconName; label: string; end?: boolean }[] = [
    { to: '/', icon: 'book', label: t('tabHome'), end: true },
    { to: coursePath(course.id), icon: 'sprout', label: t('tabLearn') },
    ...(SIMULATOR_ON && portfolioOpen(pg, progress.lessonsDone) ? [{ to: '/portfolio', icon: 'chart' as const, label: t('side_portfolio') }] : []),
    { to: '/me', icon: 'me', label: t('tabMe') },
    { to: '/settings', icon: 'gear', label: t('settings') },
  ]

  return (
    <aside className={styles.side}>
      <Link to="/" className={styles.brand}>
        <Logo size={34} />
        <span>{t('appName')}</span>
      </Link>

      <nav aria-label={t('appName')}>
        <ul className={styles.nav}>
          {links.map((l) => (
            <li key={l.to}>
              <NavLink to={l.to} end={l.end} className={({ isActive }) => `${styles.navLink} ${isActive ? styles.on : ''}`}>
                <Icon name={l.icon} size={20} />
                <span>{l.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <nav className={styles.outline} aria-label={t('courses_title')}>
        <h2 className={styles.coursesTitle}>{t('courses_title')}</h2>
        <ul className={styles.courses}>
          {appCourses.map((c) => (
            <CourseItem key={c.id} courseId={c.id} active={c.id === activeId} here={here} />
          ))}
          {soon.map((c) => (
            <li key={c.id} className={styles.soonRow}>
              <span className={styles.courseName}>{tc(c.title)}</span>
              <span className={styles.soonChip}>{t('side_soon')}</span>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}

/** One offered course: a row that opens and closes its outline, every unit with its lessons (the active course starts open). */
function CourseItem({ courseId, active, here }: { courseId: string; active: boolean; here: Here }) {
  const { t } = useTranslation()
  const tc = useLocalized()
  const { course, chapters, next, totalLessons, doneLessons } = useTrail(courseId)
  const guest = useGuestLimited()
  const order = lessonOrder(chapters)
  const [open, setOpen] = useState(active)
  // Switching course (or opening one of its lessons) opens its outline
  useEffect(() => {
    if (active) setOpen(true)
  }, [active])
  const panel = `side-course-${course.id}`

  return (
    <li className={styles.courseItem}>
      <button
        type="button"
        className={`${styles.courseRow} ${active ? styles.activeCourse : ''}`}
        aria-expanded={open}
        aria-controls={panel}
        onClick={() => setOpen((o) => !o)}
      >
        <span className={`${styles.chev} ${open ? styles.chevOpen : ''}`} aria-hidden>
          <Icon name="chevronDown" size={16} />
        </span>
        <span className={styles.courseName}>{tc(course.title)}</span>
        {totalLessons > 0 && (
          <span className={styles.courseCount}>
            {doneLessons}/{totalLessons}
          </span>
        )}
      </button>
      {open && (
        <div id={panel} className={styles.coursePanel}>
          <Link to={coursePath(course.id)} className={styles.openCourse}>
            {t('side_open_course')}
          </Link>
          {chapters.map((chapter, ci) => (
            <section key={chapter.id} className={styles.unit} aria-labelledby={`side-unit-${course.id}-${chapter.id}`}>
              <h3 id={`side-unit-${course.id}-${chapter.id}`} className={styles.unitTitle}>
                <span className={styles.unitN}>{t('side_unit', { n: ci + 1 })}</span>
                <span>{tc(chapter.title)}</span>
              </h3>
              <ol className={styles.lessons}>
                {chapter.lessons.map((lesson, li) => {
                  const state = chapter.states[li]
                  const isNext = next?.mod.id === chapter.id && next.lesson.id === lesson.id
                  const isHere = here?.[1] === course.id && here[2] === chapter.id && here[3] === lesson.id
                  const gated = state !== 'done' && !canOpenLesson(order, chapter.id, lesson.id, guest)
                  const mark =
                    state === 'done' ? <Icon name="check" size={14} strokeWidth={3} /> : state === 'locked' || gated ? <Icon name="lock" size={13} /> : li + 1
                  const cls = `${styles.lesson} ${state === 'done' ? styles.done : ''} ${isNext ? styles.next : ''} ${isHere ? styles.here : ''}`
                  const body = (
                    <>
                      <span className={styles.mark} aria-hidden>
                        {mark}
                      </span>
                      <span className={styles.lessonTitle}>{tc(lesson.title)}</span>
                      {state === 'done' && <span className="visually-hidden">{t('learn_completed')}</span>}
                    </>
                  )
                  return (
                    <li key={lesson.id}>
                      {gated ? (
                        <Link to="/signup" className={`${cls} ${styles.locked}`}>
                          {body}
                          <span className="visually-hidden">{t('gate_unlock')}</span>
                        </Link>
                      ) : state === 'locked' ? (
                        <span className={`${cls} ${styles.locked}`} aria-disabled="true">
                          {body}
                          <span className="visually-hidden">{t('nodeLocked')}</span>
                        </span>
                      ) : (
                        <Link to={learnHref(course.id, chapter.id, lesson.id)} className={cls} aria-current={isHere ? 'page' : undefined}>
                          {body}
                        </Link>
                      )}
                    </li>
                  )
                })}
              </ol>
            </section>
          ))}
        </div>
      )}
    </li>
  )
}
