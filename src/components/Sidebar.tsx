// The laptop sidebar (≥1024px, `useWide`): the brand, the main pages, and the active course's outline, every unit with
// its lessons marked done, next or locked, as on Learn. Loaded on its own, only on a wide window, so phones never
// download it.
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { coursePath } from '../content/courses'
import { useLocalized } from '../content/useLocalized'
import { canOpenLesson, lessonOrder } from '../domain/access'
import { learnHref } from '../domain/lessons'
import { portfolioOpen } from '../domain/playground/practice'
import { playgroundStore } from '../state/playground'
import { useGuestLimited } from '../state/useAccess'
import { useProgress } from '../state/useProgress'
import { useStore } from '../state/useStore'
import { useTrail, useTrailId } from '../state/useTrail'
import { CourseSwitcher } from './CourseSwitcher'
import { Logo } from './Logo'
import { Icon, type IconName } from './ui'
import styles from './Sidebar.module.css'

export function Sidebar() {
  const { t } = useTranslation()
  const tc = useLocalized()
  const { pathname } = useLocation()
  const { course, chapters, next } = useTrail(useTrailId())
  const { progress } = useProgress()
  const pg = useStore(playgroundStore)
  const guest = useGuestLimited()
  const order = lessonOrder(chapters)
  // The lesson on screen, if any: /course/:courseId/:moduleId/learn/:lessonId
  const here = pathname.match(/^\/course\/([^/]+)\/([^/]+)\/learn\/([^/]+)/)

  const links: { to: string; icon: IconName; label: string; end?: boolean }[] = [
    { to: '/', icon: 'book', label: t('tabHome'), end: true },
    { to: coursePath(course.id), icon: 'sprout', label: t('tabLearn') },
    ...(portfolioOpen(pg, progress.lessonsDone) ? [{ to: '/portfolio', icon: 'chart' as const, label: t('side_portfolio') }] : []),
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

      <nav className={styles.outline} aria-label={t('side_outline')}>
        <CourseSwitcher className={styles.course} />
        {chapters.map((chapter, ci) => (
          <section key={chapter.id} className={styles.unit} aria-labelledby={`side-unit-${chapter.id}`}>
            <h2 id={`side-unit-${chapter.id}`} className={styles.unitTitle}>
              <span className={styles.unitN}>{t('side_unit', { n: ci + 1 })}</span>
              <span>{tc(chapter.title)}</span>
            </h2>
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
      </nav>
    </aside>
  )
}
