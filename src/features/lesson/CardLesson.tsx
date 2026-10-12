import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Blocks } from '../../components/content/Blocks'
import contentStyles from '../../components/content/content.module.css'
import { getCourse, moduleHref } from '../../content/courses'
import { resolveHtmlAssetPaths } from '../../content/resolveAssetPath'
import type { Module } from '../../content/types'
import { useLocalized } from '../../content/useLocalized'
import { useModule } from '../../content/useModule'
import { useProgress } from '../../state/useProgress'
import { ModuleQuestionsContext } from '../../components/content/moduleQuestions'
import { payoutFor } from '../../domain/progress'
import { LessonPayout } from './LessonPayout'
import { learnHref, lessonKey, lessonRecap, lessonsFor, type Lesson } from '../../domain/lessons'
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
  return <CardLesson key={lessonId} mod={mod} lesson={lessons[index]} next={lessons[index + 1]} />
}

/** A lesson run: its small content cards, then its questions; "Practice again" restarts it via the key. */
function CardLesson({ mod, lesson, next }: { mod: Module; lesson: Lesson; next?: Lesson }) {
  const [round, setRound] = useState(0)
  return <CardRun key={round} mod={mod} lesson={lesson} next={next} onRestart={() => setRound((r) => r + 1)} />
}

function CardRun({ mod, lesson, next, onRestart }: { mod: Module; lesson: Lesson; next?: Lesson; onRestart: () => void }) {
  const t = useLocalized()
  const { t: tUi } = useTranslation()
  const navigate = useNavigate()
  const { progress, markRead, recordLessonAnswer, completeLesson } = useProgress()
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
  const [stage, setStage] = useState<'summary' | 'payout'>('summary')

  const step = steps[index]
  const isLast = index === steps.length - 1
  const question = step.kind === 'question' ? step.question : undefined
  const isCorrect = checked && question !== undefined && selected === question.answer

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
    if (right) setCorrectCount((c) => c + 1)
    recordLessonAnswer(question.id, selected, right)
    playAnswerSound(right)
  }

  function advance() {
    if (isLast) {
      const key = lessonKey(mod.courseId, mod.id, lesson.id)
      setPaid(payoutFor(progress, correctCount, key))
      completeLesson(correctCount, key)
      setDone(true)
      return
    }
    setIndex((i) => i + 1)
    setSelected(null)
    setChecked(false)
  }

  const onEnter = question && !checked ? check : advance
  useLessonKeys({ enabled: !done, onEnter, question, checked, onPick: setSelected })

  if (done && stage === 'payout') {
    return (
      <LessonPayout
        payout={paid}
        bankAfter={progress.bank}
        subtitle={tUi('payoutSub', { title: t(lesson.title), c: correctCount, t: total })}
        onDone={() => navigate('/')}
      />
    )
  }

  if (done) {
    return (
      <LessonSummary
        recap={lessonRecap(lesson)}
        subtitle={tUi('lessonSummary', { n: lessonsFor(mod).findIndex((l) => l.id === lesson.id) + 1, title: t(lesson.title) })}
        seconds={Math.round((Date.now() - startedAt.current) / 1000)}
        payout={pays ? paid : undefined}
        correct={correctCount}
        total={total}
        action={tUi('lessonContinue')}
        onAction={() => (paid > 0 ? setStage('payout') : navigate(next ? learnHref(mod.courseId, mod.id, next.id) : '/'))}
        secondary={tUi('lessonAgain')}
        onSecondary={onRestart}
      />
    )
  }

  const continueLabel = isLast ? tUi('lessonFinish') : tUi('lessonContinue')

  return (
    <ModuleQuestionsContext.Provider value={mod.questions}>
      <div className={styles.lesson}>
        <LessonTopBar quitTo="/" done={index + (checked ? 1 : 0)} total={steps.length} />

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
              <div dangerouslySetInnerHTML={{ __html: resolveHtmlAssetPaths(t(step.heading.html)) }} />
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
              onSelect={setSelected}
            />
          </div>
        )}

        <p className={styles.onePage}>
          <Link to={moduleHref(mod.courseId, mod.id)}>{tUi('viewAsPage')}</Link>
        </p>

        {question && !checked ? (
          <LessonFooter mascot="think" compact action={tUi('check')} disabled={selected === null} onAction={check} />
        ) : (
          <LessonFooter
            tone={question ? (isCorrect ? 'right' : 'wrong') : undefined}
            feedback={question && <AnswerFeedback question={question} correct={isCorrect} pays={pays} />}
            mascot={question ? undefined : 'point'}
            action={question ? continueLabel : tUi('nextBtn')}
            onAction={advance}
          />
        )}
      </div>
    </ModuleQuestionsContext.Provider>
  )
}
