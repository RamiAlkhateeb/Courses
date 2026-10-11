import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { flatNav, getCourse, hasWeek, type Course } from '../../content/courses'
import type { Question, Week } from '../../content/types'
import { useWeeks } from '../../content/useWeek'
import { mistakes } from '../progress/store'
import { useProgress } from '../progress/useProgress'
import { QuizLesson } from './LessonPage'
import styles from './LessonPage.module.css'

/** Route `/course/:courseId/review`: replays the course's questions whose latest answer was wrong. A right
 *  answer is saved as usual, so it leaves the list. */
export function ReviewPage() {
  const { courseId } = useParams<{ courseId: string }>()
  const { t } = useTranslation()
  const course = getCourse(courseId)
  if (!course) return <p>{t('pageNotFound')}</p>
  return <Review course={course} />
}

function Review({ course }: { course: Course }) {
  const { t } = useTranslation()
  const ids = flatNav(course)
    .map((i) => i.id)
    .filter((id) => hasWeek(course.id, id))
  const weeks: Record<string, Week> = useWeeks(course.id, ids)
  const loaded = ids.every((id) => weeks[id])
  if (!loaded) return <p>{t('loading')}</p>
  return <ReviewRunner course={course} questions={ids.flatMap((id) => weeks[id].questions)} />
}

function ReviewRunner({ course, questions }: { course: Course; questions: Question[] }) {
  const { t } = useTranslation()
  const { progress } = useProgress()
  const pickWrong = () => {
    const wrong = new Set(mistakes(questions.map((q) => q.id), progress.answers))
    return questions.filter((q) => wrong.has(q.id))
  }
  // Picked once per round, so answering one right doesn't reshuffle the run mid-way.
  const [round, setRound] = useState(0)
  const [picks, setPicks] = useState(pickWrong)

  if (picks.length === 0) {
    return (
      <div className={`${styles.lesson} ${styles.summary}`}>
        <div className={styles.trophy} aria-hidden>
          ✓
        </div>
        <h1>{t('noMistakes')}</h1>
        <p className={styles.emptyNote}>{t('noMistakesNote')}</p>
        <div className={styles.actions}>
          <Link className={styles.primary} to={`/course/${course.id}`}>
            {t('backToCourse')}
          </Link>
        </div>
      </div>
    )
  }
  return (
    <QuizLesson
      key={round}
      kicker={t('reviewKicker')}
      quitTo={`/course/${course.id}`}
      questions={picks}
      againLabel={t('reviewAgain')}
      onRestart={() => {
        setPicks(pickWrong())
        setRound((r) => r + 1)
      }}
    />
  )
}
