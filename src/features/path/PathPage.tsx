import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Guide, buttonClass, Icon, StatPill } from '../../components/ui'
import { MoneyChip } from '../../components/MoneyChip'
import { CourseSwitcher } from '../../components/CourseSwitcher'
import { practiceHref } from '../../content/courses'
import { useLocalized } from '../../content/useLocalized'
import { currentStreak, localDay } from '../../domain/progress'
import { learnHref, lessonMinutes, type Lesson } from '../../domain/lessons'
import { useAuth } from '../../state/auth'
import { canOpenLesson, canOpenPractice, FREE_LESSONS, lessonOrder } from '../../domain/access'
import { useGuestLimited } from '../../state/useAccess'
import { accountsEnabled } from '../../state/supabase'
import { useProgress } from '../../state/useProgress'
import { useWallet } from '../../state/usePlayground'
import { useTrail, useTrailId, type Chapter } from '../../state/useTrail'
import styles from './PathPage.module.css'

const questionsIn = (l: Lesson) => l.steps.filter((s) => s.kind === 'question').length

/** Learn (the Home tab), flat: the streak in days and the play-money balance, an "Up next" card for the next lesson,
 *  then every unit as a plain list of lessons (done, the next one, locked). */
export function PathPage() {
  const { t, i18n } = useTranslation()
  const tc = useLocalized()
  const { course, chapters, loaded, next } = useTrail(useTrailId())
  const { progress } = useProgress()
  const wallet = useWallet()
  const auth = useAuth()
  const streak = currentStreak(progress.streak, localDay())
  const nextChapter = next ? chapters.find((c) => c.id === next.mod.id) : undefined
  const nextIndex = nextChapter && next ? nextChapter.lessons.findIndex((l) => l.id === next.lesson.id) : -1
  const guest = useGuestLimited()
  const order = lessonOrder(chapters)
  const gated = (moduleId: string, lessonId: string) => !canOpenLesson(order, moduleId, lessonId, guest)
  const nextGated = !!next && gated(next.mod.id, next.lesson.id)

  return (
    <div className={styles.page}>
      <header className={styles.top}>
        <h1 className={styles.title}>{t('tabLearn')}</h1>
        <div className={styles.pills}>
          <StatPill title={t('streakDays', { count: streak })}>
            <Icon name="calendar" size={20} />
            {t('learn_days', { count: streak })}
          </StatPill>
          <MoneyChip amount={wallet} />
        </div>
      </header>
      <CourseSwitcher className={styles.switcher} />
      {/* Accounts are optional and only exist when Supabase is configured; the Log in screen links on to Create an account. */}
      {accountsEnabled && auth.status === 'signedOut' && (
        <Link to="/login" className={buttonClass({ variant: 'secondary', size: 'sm' }, styles.login)}>
          {t('acc_header_cta')}
        </Link>
      )}

      {!loaded && <p className={styles.loading}>{t('loading')}</p>}
      {loaded && chapters.length === 0 && <p className={styles.loading}>{t('contentComing')}</p>}

      {loaded && next && nextGated && (
        <section className={styles.upNext} aria-labelledby="gate-title">
          <div className={styles.upText}>
            <p className={styles.upKicker}>{t('gate_kicker', { count: FREE_LESSONS })}</p>
            <h2 id="gate-title" className={styles.upTitle}>
              {t('gate_title')}
            </h2>
            <div className={styles.upActions}>
              <Link className={buttonClass({ variant: 'white', size: 'sm' })} to="/signup">
                {t('acc_create')}
              </Link>
              <Link className={styles.upLink} to="/login">
                {t('acc_sign_in')}
              </Link>
            </div>
          </div>
          <Guide pose="point" height={104} flip={i18n.dir() !== 'rtl'} className={styles.upMascot} />
        </section>
      )}
      {loaded && next && nextChapter && !nextGated && (
        <section className={styles.upNext} aria-label={t('learn_up_next', { n: nextIndex + 1, total: nextChapter.lessons.length })}>
          <div className={styles.upText}>
            <p className={styles.upKicker}>{t('learn_up_next', { n: nextIndex + 1, total: nextChapter.lessons.length })}</p>
            <h2 className={styles.upTitle}>{tc(next.lesson.title)}</h2>
            <p className={styles.upMeta}>{t('learn_about_min', { count: lessonMinutes(next.lesson) })}</p>
            <Link className={buttonClass({ variant: 'white', size: 'sm' }, styles.upCta)} to={learnHref(course.id, next.mod.id, next.lesson.id)}>
              {t('continue')}
            </Link>
          </div>
          {/* He sits at the card's end edge, so he faces back and points at the lesson and Continue. */}
          <Guide pose="point" height={104} flip={i18n.dir() !== 'rtl'} className={styles.upMascot} />
        </section>
      )}
      {loaded && !next && chapters.length > 0 && <p className={styles.allDone}>{t('learn_all_done')}</p>}

      {loaded &&
        chapters.map((chapter, i) => (
          <UnitList
            key={chapter.id}
            chapter={chapter}
            index={i}
            nextLessonId={next?.mod.id === chapter.id ? next.lesson.id : undefined}
            gated={(lessonId) => gated(chapter.id, lessonId)}
            reviewGated={!canOpenPractice(guest)}
          />
        ))}
      <span className="visually-hidden">{tc(course.title)}</span>
    </div>
  )
}

/** One unit: a header with its progress, then a row per lesson and the unit review (a quiz-only practice run). */
function UnitList({
  chapter,
  index,
  nextLessonId,
  gated,
  reviewGated,
}: {
  chapter: Chapter
  index: number
  nextLessonId?: string
  /** Guests: lessons past the free ones link to sign-up instead. */
  gated: (lessonId: string) => boolean
  reviewGated: boolean
}) {
  const { t } = useTranslation()
  const tc = useLocalized()
  const mod = chapter.mod!
  const total = chapter.lessons.length
  const allDone = total > 0 && chapter.done === total
  const reviewQuestions = mod.questions.length
  return (
    <section className={styles.unit} aria-labelledby={`unit-${chapter.id}`}>
      <header className={styles.unitHead}>
        <h2 id={`unit-${chapter.id}`} className={styles.unitTitle}>
          <Icon name="sprout" size={18} />
          {t('learn_unit', { n: index + 1, title: tc(chapter.title) })}
        </h2>
        <span className={styles.unitDone}>{t('learn_done_of', { done: chapter.done, total })}</span>
      </header>
      <ol className={styles.rows}>
        {chapter.lessons.map((lesson, li) => {
          const done = chapter.states[li] === 'done'
          const isNext = lesson.id === nextLessonId
          const meta = t('learn_meta', { min: lessonMinutes(lesson), count: questionsIn(lesson) })
          const href = learnHref(mod.courseId, mod.id, lesson.id)
          // A gated row is never a dead end: it opens sign-up. Lessons already done stay open.
          if (!done && gated(lesson.id))
            return (
              <li key={lesson.id}>
                <Link to="/signup" className={`${styles.row} ${styles.rowGated}`}>
                  <span className={styles.mark}>
                    <Icon name="lock" size={16} />
                  </span>
                  <span className={styles.rowText}>
                    <strong>{tc(lesson.title)}</strong>
                    <small>{t('gate_unlock')}</small>
                  </span>
                </Link>
              </li>
            )
          if (done)
            return (
              <li key={lesson.id}>
                <Link to={href} className={`${styles.row} ${styles.rowDone}`}>
                  <span className={styles.mark}>
                    <Icon name="check" size={18} strokeWidth={3} />
                  </span>
                  <span className={styles.rowText}>
                    <strong>{tc(lesson.title)}</strong>
                    <small>{t('learn_completed')}</small>
                  </span>
                </Link>
              </li>
            )
          if (isNext)
            return (
              <li key={lesson.id}>
                <Link to={href} className={`${styles.row} ${styles.rowNext}`} aria-current="step">
                  <span className={styles.mark}>{li + 1}</span>
                  <span className={styles.rowText}>
                    <strong>{tc(lesson.title)}</strong>
                    <small>{meta}</small>
                  </span>
                  <span className={styles.chip} aria-hidden>
                    {t('learn_start')}
                  </span>
                </Link>
              </li>
            )
          return (
            <li key={lesson.id}>
              <div className={`${styles.row} ${styles.rowLocked}`} aria-disabled="true">
                <span className={styles.mark}>
                  <Icon name="lock" size={16} />
                </span>
                <span className={styles.rowText}>
                  <strong>{tc(lesson.title)}</strong>
                  <small>{meta}</small>
                </span>
                <span className="visually-hidden">{t('nodeLocked')}</span>
              </div>
            </li>
          )
        })}
        {reviewQuestions > 0 && (
          <li>
            {allDone && reviewGated ? (
              <Link to="/signup" className={`${styles.row} ${styles.rowGated}`}>
                <span className={styles.mark}>
                  <Icon name="lock" size={16} />
                </span>
                <span className={styles.rowText}>
                  <strong>{t('learn_unit_review')}</strong>
                  <small>{t('gate_unlock')}</small>
                </span>
              </Link>
            ) : allDone ? (
              <Link to={practiceHref(mod.courseId, mod.id)} className={styles.row}>
                <span className={styles.mark}>
                  <Icon name="review" size={16} />
                </span>
                <span className={styles.rowText}>
                  <strong>{t('learn_unit_review')}</strong>
                  <small>{t('learn_meta', { min: Math.max(1, Math.ceil(reviewQuestions * 0.5)), count: reviewQuestions })}</small>
                </span>
              </Link>
            ) : (
              <div className={`${styles.row} ${styles.rowLocked}`} aria-disabled="true">
                <span className={styles.mark}>
                  <Icon name="lock" size={16} />
                </span>
                <span className={styles.rowText}>
                  <strong>{t('learn_unit_review')}</strong>
                  <small>{t('learn_meta', { min: Math.max(1, Math.ceil(reviewQuestions * 0.5)), count: reviewQuestions })}</small>
                </span>
                <span className="visually-hidden">{t('nodeLocked')}</span>
              </div>
            )}
          </li>
        )}
      </ol>
    </section>
  )
}
