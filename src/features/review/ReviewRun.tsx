import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { Question } from '../../content/types'
import { QuizLesson } from '../lesson/LessonPage'
import { useTrail, useTrailId } from '../path/useTrail'
import { useProgress } from '../progress/useProgress'

const RUN_SIZE = 6

/** Route `/review/run`: the shakiest answered questions of the active trail, a few at a time. */
export function ReviewRun() {
  const { t } = useTranslation()
  const { loaded, chapters } = useTrail(useTrailId())
  if (!loaded) return <p>{t('loading')}</p>
  const questions = chapters.flatMap((c) => c.lessons.flatMap((l) => l.steps.flatMap((s) => (s.kind === 'question' ? [s.question] : []))))
  return <Run questions={questions} />
}

function Run({ questions }: { questions: Question[] }) {
  const { t } = useTranslation()
  const { progress } = useProgress()
  const pick = () =>
    questions
      .filter((q) => progress.boxes[q.id] !== undefined)
      .sort((a, b) => progress.boxes[a.id] - progress.boxes[b.id])
      .slice(0, RUN_SIZE)
  const [round, setRound] = useState(0)
  const [picks, setPicks] = useState(pick)
  return (
    <QuizLesson
      key={round}
      kicker={t('reviewTitle')}
      quitTo="/review"
      questions={picks}
      againLabel={t('reviewAgain')}
      onRestart={() => {
        setPicks(pick())
        setRound((r) => r + 1)
      }}
    />
  )
}
