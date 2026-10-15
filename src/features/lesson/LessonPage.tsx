import { useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { getCourse } from '../../content/courses'
import type { Question, Module } from '../../content/types'
import { useLocalized } from '../../content/useLocalized'
import { useModule } from '../../content/useModule'
import { pickLessonQuestions } from '../../domain/progress'
import { useProgress } from '../../state/useProgress'
import {
  AnswerFeedback,
  LessonFooter,
  LessonSummary,
  LessonTopBar,
  playAnswerSound,
  QuestionCard,
  useLessonKeys,
} from './LessonParts'
import styles from './LessonPage.module.css'

/** Questions per lesson (fewer if the module has fewer). */
const LESSON_SIZE = 8

/** Practice: a short run of a module's questions (least-known first), one at a time, then XP + streak. */
export function LessonPage() {
  const { courseId, moduleId } = useParams<{ courseId: string; moduleId: string }>()
  const { t: tUi } = useTranslation()
  const { mod, loading, notFound } = useModule(courseId, moduleId)

  if (!getCourse(courseId) || notFound) return <p>{tUi('moduleNotFound')}</p>
  if (loading || !mod) return <p>{tUi('loading')}</p>
  if (mod.questions.length === 0) return <p>{tUi('lessonNoQuestions')}</p>
  return <LessonRunner mod={mod} />
}

function LessonRunner({ mod }: { mod: Module }) {
  const t = useLocalized()
  const { progress } = useProgress()
  const [round, setRound] = useState(0)
  // Picked once per round: later box changes must not reshuffle the lesson mid-way.
  const [picks, setPicks] = useState(() => pick(mod, progress.boxes))
  // Keyed by round so "Practice again" remounts a fresh lesson with a new pick of questions.
  return (
    <QuizLesson
      key={round}
      kicker={t(mod.cover.kicker)}
      quitTo="/"
      questions={picks}
      onRestart={() => {
        setPicks(pick(mod, progress.boxes))
        setRound((r) => r + 1)
      }}
    />
  )
}

function pick(mod: Module, boxes: Record<string, number>): Question[] {
  const ids = pickLessonQuestions(
    mod.questions.map((q) => q.id),
    boxes,
    LESSON_SIZE,
  )
  return ids.map((id) => mod.questions.find((q) => q.id === id)!)
}

/** A run of questions, one at a time, then XP and the streak. Used by Practice and Review mistakes; it completes
 *  no roadmap lesson. */
export function QuizLesson({
  kicker,
  quitTo,
  questions,
  onRestart,
  againLabel,
}: {
  kicker: string
  quitTo: string
  questions: Question[]
  onRestart: () => void
  againLabel?: string
}) {
  const { t: tUi } = useTranslation()
  const { recordLessonAnswer, completeLesson } = useProgress()
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [checked, setChecked] = useState(false)
  const [correctCount, setCorrectCount] = useState(0)
  const [done, setDone] = useState(false)
  const [attempt, setAttempt] = useState(0) // 0 = first try; a wrong first try can be tried again, a second reveals the answer
  const navigate = useNavigate()
  const startedAt = useRef(Date.now())

  const question = questions[index]
  const isCorrect = checked && selected === question.answer
  const retry = checked && !isCorrect && attempt === 0
  const settled = checked && !retry
  const isLast = index === questions.length - 1

  function check() {
    if (selected === null || checked) return
    const right = selected === question.answer
    setChecked(true)
    if (attempt === 0) {
      if (right) setCorrectCount((c) => c + 1)
      recordLessonAnswer(question.id, selected, right)
    }
    playAnswerSound(right)
  }

  function tryAgain() {
    setAttempt(1)
    setSelected(null)
    setChecked(false)
  }

  function next() {
    if (isLast) {
      completeLesson(correctCount)
      setDone(true)
      return
    }
    setIndex((i) => i + 1)
    setSelected(null)
    setChecked(false)
    setAttempt(0)
  }

  useLessonKeys({ enabled: !done, onEnter: checked ? (retry ? tryAgain : next) : check, question, checked, onPick: setSelected })

  if (done) {
    return (
      <LessonSummary
        correct={correctCount}
        total={questions.length}
        seconds={Math.round((Date.now() - startedAt.current) / 1000)}
        action={tUi('lessonContinue')}
        onAction={() => navigate('/')}
        secondary={againLabel ?? tUi('lessonAgain')}
        onSecondary={onRestart}
      />
    )
  }

  return (
    <div className={styles.lesson}>
      <LessonTopBar quitTo={quitTo} done={index + (settled ? 1 : 0)} total={questions.length} />
      <QuestionCard
        question={question}
        kicker={kicker}
        selected={selected}
        checked={checked}
        reveal={!retry}
        onSelect={setSelected}
      />
      {checked ? (
        <LessonFooter
          tone={isCorrect ? 'right' : 'wrong'}
          feedback={<AnswerFeedback question={question} correct={isCorrect} pays={false} firstTry={retry} />}
          action={retry ? tUi('tryAgain') : isLast ? tUi('lessonFinish') : tUi('lessonContinue')}
          onAction={retry ? tryAgain : next}
        />
      ) : (
        <LessonFooter action={tUi('check')} disabled={selected === null} onAction={check} />
      )}
    </div>
  )
}
