import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Blocks } from '../../components/content/Blocks'
import contentStyles from '../../components/content/content.module.css'
import { getCourse } from '../../content/courses'
import { safeHtml } from '../../components/content/safeHtml'
import type { Module } from '../../content/types'
import { useLocalized } from '../../content/useLocalized'
import { useModule } from '../../content/useModule'
import { useProgress } from '../../state/useProgress'
import { useWallet } from '../../state/usePlayground'
import { ModuleQuestionsContext } from '../../components/content/moduleQuestions'
import { payoutFor } from '../../domain/progress'
import { lessonKey, lessonsFor, type Lesson } from '../../domain/lessons'
import { moneyText } from '../../i18n'
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

/** Route `/course/:courseId/:moduleId/learn/:lessonId`: one roadmap lesson. */
export function LessonRoute() {
  const { courseId, moduleId, lessonId } = useParams<{ courseId: string; moduleId: string; lessonId: string }>()
  const { t } = useTranslation()
  const { mod, loading, notFound } = useModule(courseId, moduleId)
  const lessons = useMemo(() => (mod ? lessonsFor(mod) : []), [mod])
  const index = lessons.findIndex((l) => l.id === lessonId)

  if (!getCourse(courseId) || notFound) return <p>{t('moduleNotFound')}</p>
  if (loading || !mod) return <p>{t('loading')}</p>
  if (index === -1) return <p>{t('pageNotFound')}</p>
  // Keyed by lesson so "Continue" to the next lesson starts fresh.
  return <CardRun key={lessonId} mod={mod} lesson={lessons[index]} />
}

/** A lesson run: its small content cards, then its questions. Keyed by lesson, so the next lesson starts fresh. */
function CardRun({ mod, lesson }: { mod: Module; lesson: Lesson }) {
  const t = useLocalized()
  const { t: tUi } = useTranslation()
  const navigate = useNavigate()
  const { progress, markRead, recordLessonAnswer, completeLesson } = useProgress()
  const wallet = useWallet()
  const { steps } = lesson
  const total = steps.filter((s) => s.kind === 'question').length
  const startedAt = useRef(Date.now())
  // Does finishing this lesson pay? Decided once, on arrival: finishing it marks it done.
  const [pays] = useState(() => payoutFor(progress, 1, lessonKey(mod.courseId, mod.id, lesson.id)) > 0)

  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [checked, setChecked] = useState(false)
  const [correctCount, setCorrectCount] = useState(0)
  const [done, setDone] = useState(false)
  const [paid, setPaid] = useState(0)
  // 0 = first try at this question; 1 = a second try (the first was wrong): that one reveals the answer and carries on.
  const [attempt, setAttempt] = useState(0)

  const step = steps[index]
  const isLast = index === steps.length - 1
  const question = step.kind === 'question' ? step.question : undefined
  const isCorrect = checked && question !== undefined && selected === question.answer
  const retry = checked && !isCorrect && attempt === 0 // a wrong first try can be tried again
  const settled = checked && !retry // right, or the second try

  // A content card counts its section as read, which keeps the one-page view's progress in step.
  useEffect(() => {
    markRead(`${mod.courseId}/${mod.id}`, step.sectionId)
    window.scrollTo({ top: 0 })
    // markRead is a fresh closure each render; only the card changing matters.
  }, [index])

  function check() {
    if (!question || selected === null || checked) return
    const right = selected === question.answer
    setChecked(true)
    if (attempt === 0) {
      // Only the first try counts for the score and the review boxes.
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

  /** "Re-read the lesson card": back to the last content card before this question. */
  function reread() {
    const back = steps.slice(0, index).map((s, i) => [s, i] as const).filter(([s]) => s.kind === 'content').pop()
    if (!back) return tryAgain()
    setIndex(back[1])
    setAttempt(0)
    setSelected(null)
    setChecked(false)
  }

  function advance() {
    if (isLast) {
      const key = lessonKey(mod.courseId, mod.id, lesson.id)
      setPaid(payoutFor(progress, correctCount, key))
      completeLesson(correctCount, key, total)
      setDone(true)
      return
    }
    setIndex((i) => i + 1)
    setSelected(null)
    setChecked(false)
    setAttempt(0)
  }

  const onEnter = question && !checked ? check : retry ? tryAgain : advance
  useLessonKeys({ enabled: !done, onEnter, question, checked, onPick: setSelected })

  if (done) {
    return (
      <LessonSummary
        subtitle={tUi('lessonSummaryBank', { title: t(lesson.title), money: moneyText(wallet) })}
        seconds={Math.round((Date.now() - startedAt.current) / 1000)}
        payout={pays ? paid : undefined}
        correct={correctCount}
        total={total}
        action={tUi('lessonContinue')}
        onAction={() => navigate('/')}
        secondary={correctCount < total ? tUi('reviewMyMistake') : undefined}
        onSecondary={() => navigate(`/course/${mod.courseId}/review`)}
      />
    )
  }

  const continueLabel = isLast ? tUi('lessonFinish') : tUi('lessonContinue')

  return (
    <ModuleQuestionsContext.Provider value={mod.questions}>
      <div className={styles.lesson}>
        <LessonTopBar quitTo="/" done={index + (settled ? 1 : 0)} total={steps.length} />

        {step.kind === 'content' ? (
          // key: a new card replays the entrance animation.
          <div key={index} className={`${styles.card} ${contentStyles.content}`}>
            {step.heading && (
              <p className={styles.kicker}>
                {t(step.heading.label)}
                {lesson.parts > 1 && ` · ${lesson.part}/${lesson.parts}`}
              </p>
            )}
            {step.heading?.html && (
              <div dangerouslySetInnerHTML={safeHtml(t(step.heading.html))} />
            )}
            <Blocks blocks={step.blocks} />
          </div>
        ) : (
          <div key={index} className={styles.card}>
            <QuestionCard
              question={step.question}
              kicker={tUi('quickCheck')}
              selected={selected}
              checked={checked}
              reveal={!retry}
              onSelect={setSelected}
            />
          </div>
        )}

        {question && !checked ? (
          <LessonFooter mascot="think" compact action={tUi('check')} disabled={selected === null} onAction={check} />
        ) : (
          <LessonFooter
            tone={question ? (isCorrect ? 'right' : 'wrong') : undefined}
            feedback={question && <AnswerFeedback question={question} correct={isCorrect} pays={pays} firstTry={retry} />}
            action={question ? (retry ? tUi('tryAgain') : continueLabel) : tUi('nextBtn')}
            onAction={retry ? tryAgain : advance}
            secondary={retry ? tUi('reread') : undefined}
            onSecondary={reread}
          />
        )}
      </div>
    </ModuleQuestionsContext.Provider>
  )
}
