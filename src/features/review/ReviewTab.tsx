import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Button, Card, Icon, AbuShreek } from '../../components/ui'
import { useLocalized } from '../../content/useLocalized'
import type { Question } from '../../content/types'
import { mistakes, MAX_BOX } from '../../domain/progress'
import { useProgress } from '../../state/useProgress'
import { useTrail, useTrailId } from '../../state/useTrail'
import styles from './ReviewTab.module.css'

/** A card is due while its question is still shaky (Leitner box 1–2). */
const DUE_BOX = 2

/** 1 = weak, 2 = okay, 3 = strong, from the mean Leitner box of a lesson's answered questions (null: none answered). */
function strength(ids: string[], boxes: Record<string, number>): 1 | 2 | 3 | null {
  const seen = ids.filter((id) => boxes[id] !== undefined)
  if (seen.length === 0) return null
  const mean = seen.reduce((n, id) => n + boxes[id], 0) / seen.length
  return mean < 2 ? 1 : mean < MAX_BOX - 1 ? 2 : 3
}

/** Design 12: cards due, topics that need a second look, and ways to practise. */
export function ReviewTab() {
  const { t } = useTranslation()
  const tc = useLocalized()
  const navigate = useNavigate()
  const { progress } = useProgress()
  const { course, chapters } = useTrail(useTrailId())

  const lessons = chapters.flatMap((c) => c.lessons.map((l) => ({ chapter: c, lesson: l })))
  const questions: Question[] = lessons.flatMap(({ lesson }) => lesson.steps.flatMap((s) => (s.kind === 'question' ? [s.question] : [])))
  const due = questions.filter((q) => progress.boxes[q.id] !== undefined && progress.boxes[q.id] <= DUE_BOX)
  const wrong = mistakes(questions.map((q) => q.id), progress.answers)

  const topics = lessons
    .map(({ lesson }) => {
      const ids = lesson.steps.flatMap((s) => (s.kind === 'question' ? [s.question.id] : []))
      return { lesson, level: strength(ids, progress.boxes), ids }
    })
    .filter((x) => x.level !== null)
    .sort((a, b) => a.level! - b.level!)
    .slice(0, 5)

  const label = { 1: t('strengthWeak'), 2: t('strengthOkay'), 3: t('strengthStrong') } as const
  const tone = { 1: styles.pWeak, 2: styles.pOkay, 3: styles.pStrong } as const

  return (
    <div className={styles.page}>
      <h1>{t('reviewTitle')}</h1>
      <p className={styles.sub}>{t('reviewSub')}</p>

      <Card tone="dawn" className={styles.hero}>
        <AbuShreek pose="point" height={130} className={styles.mascot} />
        <div className={styles.heroText}>
          <h2>{due.length ? t('cardsDue', { count: due.length }) : t('nothingDue')}</h2>
          {due.length > 0 && <p>{t('aboutMin', { n: Math.max(1, Math.round(due.length * 0.5)) })}</p>}
          <Button variant="ink" size="sm" disabled={due.length === 0} onClick={() => navigate('/review/run')}>
            {t('startReview')}
          </Button>
        </div>
      </Card>

      <h2 className={styles.kicker}>{t('secondLook')}</h2>
      {topics.length === 0 ? (
        <p className={styles.empty}>{t('reviewEmpty')}</p>
      ) : (
        <ul className={styles.list}>
          {topics.map(({ lesson, level }) => (
            <li key={lesson.id}>
              <Card className={styles.topic}>
                <div>
                  <strong>{tc(lesson.title)}</strong>
                  <small>
                    {label[level!]} · {t('ofN', { a: level, b: 3 })}
                  </small>
                </div>
                <span className={styles.pills} aria-hidden>
                  {[1, 2, 3].map((n) => (
                    <i key={n} className={n <= level! ? tone[level!] : ''} />
                  ))}
                </span>
              </Card>
            </li>
          ))}
        </ul>
      )}

      <h2 className={styles.kicker}>{t('practiceWay')}</h2>
      <div className={styles.practice}>
        <button type="button" disabled={wrong.length === 0} onClick={() => navigate(`/course/${course.id}/review`)}>
          <Icon name="close" size={26} />
          <strong>{t('mistakesOnly')}</strong>
          <small>{t('fixTripped')}</small>
        </button>
        <button type="button" onClick={() => navigate('/review/terms')}>
          <Icon name="book" size={26} />
          <strong>{t('keyTermsBtn')}</strong>
          <small>{t('flipThrough')}</small>
        </button>
      </div>
    </div>
  )
}
