import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { appCourses, COMING_SOON_IDS, coursePath, courses, flatNav, hasModule, type Course } from '../../content/courses'
import { useLocalized } from '../../content/useLocalized'
import { learnHref } from '../../domain/lessons'
import { Logo } from '../../components/Logo'
import { buttonClass, Icon, ProgressBar } from '../../components/ui'
import { useTrail, useTrailId } from '../../state/useTrail'
import styles from './CoursesPage.module.css'

/** The first sentence of a description, so every card stays short. */
const firstSentence = (text: string) => text.match(/^.*?[.!؟?](\s|$)/)?.[0].trim() ?? text

/** Home (`/`): the courses. The offered ones first, each with its progress and a way straight back into it; then a few
 *  others as "Coming soon" (`COMING_SOON_IDS`). Opening a course shows its Learn path (`/course/:id`). */
export function CoursesPage() {
  const { t } = useTranslation()
  const offered = new Set(appCourses.map((c) => c.id))
  const soon = COMING_SOON_IDS.map((id) => courses.find((c) => c.id === id)).filter((c): c is Course => !!c && !offered.has(c.id))

  return (
    <div className={styles.page}>
      <header className={styles.head}>
        <Logo size={34} />
        <h1 className={styles.title}>{t('courses_title')}</h1>
      </header>
      <ul className={styles.list}>
        {appCourses.map((c) => (
          <li key={c.id}>
            <OfferedCourse course={c} />
          </li>
        ))}
        {soon.map((c) => (
          <li key={c.id}>
            <div className={`${styles.card} ${styles.locked}`} aria-disabled="true">
              <CardText course={c} />
              <span className={styles.meta}>
                <span className={styles.soon}>{t('courses_coming_soon')}</span>
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

function CardText({ course }: { course: Course }) {
  const { t } = useTranslation()
  const tc = useLocalized()
  return (
    <>
      <span className={styles.kicker}>{t(`category.${course.category}`)}</span>
      <strong className={styles.name}>{tc(course.title)}</strong>
      <span className={styles.blurb}>{firstSentence(tc(course.description))}</span>
    </>
  )
}

/** An offered course: open it (its Learn path), see how far you are, and go straight on to the next lesson. */
function OfferedCourse({ course }: { course: Course }) {
  const { t } = useTranslation()
  const tc = useLocalized()
  const active = useTrailId()
  const { next, loaded, totalLessons, doneLessons } = useTrail(course.id)
  const chapters = flatNav(course).filter((i) => hasModule(course.id, i.id)).length
  const started = doneLessons > 0
  return (
    <div className={`${styles.card} ${course.id === active ? styles.active : ''}`}>
      <Link to={coursePath(course.id)} className={styles.open}>
        <CardText course={course} />
        <span className={styles.meta}>
          <Icon name="book" size={18} /> {t('courses_chapters', { count: chapters })}
          {course.id === active && started && <span className={styles.current}>{t('courses_current')}</span>}
        </span>
      </Link>
      {loaded && totalLessons > 0 && (
        <div className={styles.progress}>
          <ProgressBar value={doneLessons} max={totalLessons} label={tc(course.title)} />
          <span>{t('home_lessons_done', { done: doneLessons, total: totalLessons })}</span>
        </div>
      )}
      {loaded && next && (
        <Link to={learnHref(course.id, next.mod.id, next.lesson.id)} className={buttonClass({ size: 'sm' }, styles.go)}>
          {started ? t('continue') : t('learn_start')} · {tc(next.lesson.title)}
        </Link>
      )}
    </div>
  )
}
