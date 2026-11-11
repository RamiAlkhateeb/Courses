import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
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
import { completeLesson as afterLesson, earnedFreeze, localDay, payoutFor, STREAK_MILESTONES } from '../../domain/progress'
import { learnHref, lessonKey, lessonsFor, type Lesson } from '../../domain/lessons'
import { clearLessonRun, lessonRunStore, saveLessonRun } from '../../state/lessonRun'
import { SpaceGuide } from './SpaceGuide'
import { PracticeBlock } from '../../components/playground/PracticeBlock'
import { ActivityDoneContext } from '../../components/content/activityDone'
import { activityIn } from '../../domain/activities'
import { practiceDone } from '../../domain/playground/practice'
import { playgroundStore } from '../../state/playground'
import { useStore } from '../../state/useStore'
import { LessonGate } from './LessonGate'
import { canOpenLesson, lessonOrder } from '../../domain/access'
import { useGuestLimited } from '../../state/useAccess'
import { useTrail } from '../../state/useTrail'
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
  return (
    <GuestCheck courseId={mod.courseId} moduleId={mod.id} lessonId={lessons[index].id}>
      <CardRun key={lessonId} mod={mod} lesson={lessons[index]} />
    </GuestCheck>
  )
}

/** Guests open only the first lessons of a course (when accounts exist) and the ones they already finished; the rest show
 *  the sign-up gate. */
function GuestCheck({ courseId, moduleId, lessonId, children }: { courseId: string; moduleId: string; lessonId: string; children: ReactNode }) {
  const { t } = useTranslation()
  const guest = useGuestLimited()
  const { chapters, loaded } = useTrail(courseId)
  const { progress } = useProgress()
  if (!guest || progress.lessonsDone.includes(lessonKey(courseId, moduleId, lessonId))) return children
  if (!loaded) return <p>{t('loading')}</p>
  return canOpenLesson(lessonOrder(chapters), moduleId, lessonId, guest) ? children : <LessonGate />
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

  const key = lessonKey(mod.courseId, mod.id, lesson.id)
  // Where they left off, if they quit this lesson half way (not on a replay: that starts from the top)
  const [resume] = useState(() => {
    const run = lessonRunStore.get()
    return pays && run?.key === key && run.index < steps.length ? run : null
  })
  const [index, setIndex] = useState(resume?.index ?? 0)
  const resumedAnswer = resume?.answers[resume.index]
  const [selected, setSelected] = useState<number | null>(resumedAnswer?.settled ? resumedAnswer.selected : null)
  const [checked, setChecked] = useState(!!resumedAnswer?.settled)
  // Each question's answer, by step: the first try is the score (and the review boxes); `settled` once it was right or
  // tried twice. Going back to it shows it as answered; nothing is scored twice, however the learner moves around.
  const [answers, setAnswers] = useState<Record<number, { first: boolean; selected: number; settled: boolean }>>(resume?.answers ?? {})
  const correctCount = Object.values(answers).filter((a) => a.first).length
  const [done, setDone] = useState(false)
  const [paid, setPaid] = useState(0)
  const [freezeEarned, setFreezeEarned] = useState(false)
  const [streakHit, setStreakHit] = useState(0)
  const [seconds, setSeconds] = useState(0)
  // 0 = first try at this question; 1 = a second try (the first was wrong): that one reveals the answer and carries on.
  const [attempt, setAttempt] = useState(resumedAnswer && !(resumedAnswer.settled && resumedAnswer.first) ? 1 : 0)
  // After the last step: the lesson to go to next (the first one not finished yet)
  const { next } = useTrail(mod.courseId)

  // Keep the place while the lesson is unfinished
  useEffect(() => {
    if (pays && !done) saveLessonRun({ key, index, answers })
  }, [pays, done, key, index, answers])

  const step = steps[index]
  const isLast = index === steps.length - 1
  // A practice step: the live simulator under the card, and Next waits for the task (not on a replay)
  const pg = useStore(playgroundStore)
  const practiceTask = step.kind === 'content' ? step.blocks.find((b) => b.type === 'practice')?.task : undefined
  const replay = progress.lessonsDone.includes(lessonKey(mod.courseId, mod.id, lesson.id))
  // An activity step (guess, choice, sort, myth): Next waits until it is answered, the first time through
  const [activitiesDone, setActivitiesDone] = useState<Record<number, true>>({})
  const activity = step.kind === 'content' ? activityIn(step.blocks) : undefined
  const blocked = (!!practiceTask && !replay && !practiceDone(practiceTask, pg)) || (!!activity && !replay && !activitiesDone[index])
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
    const firstTry = !answers[index]
    setChecked(true)
    setAnswers((a) => ({ ...a, [index]: { first: firstTry ? right : a[index].first, selected, settled: right || !firstTry } }))
    // Only the first try counts for the score and the review boxes.
    if (firstTry) recordLessonAnswer(question.id, selected, right)
    playAnswerSound(right)
  }

  function tryAgain() {
    setAttempt(1)
    setSelected(null)
    setChecked(false)
  }

  /** Show step `i` as the learner left it: an answered question read-only, a question tried once on its second try. */
  function enter(i: number) {
    const a = answers[i]
    setIndex(i)
    setSelected(a?.settled ? a.selected : null)
    setChecked(!!a?.settled)
    setAttempt(a && !(a.settled && a.first) ? 1 : 0)
  }

  /** The step before this one (the arrow by ✕). */
  function back() {
    if (index > 0) enter(index - 1)
  }

  /** "Re-read the lesson card": back to the last content card before this question. */
  function reread() {
    const before = steps.slice(0, index).map((s, i) => [s, i] as const).filter(([s]) => s.kind === 'content').pop()
    if (!before) return tryAgain()
    enter(before[1])
  }

  function advance() {
    if (isLast) {
      setPaid(payoutFor(progress, correctCount, key))
      const today = localDay()
      const seconds = Math.round((Date.now() - startedAt.current) / 1000)
      const after = afterLesson(progress, correctCount, today, key, total, seconds)
      setFreezeEarned(earnedFreeze(progress, after, today))
      // A streak milestone reached by this very lesson gets its own line on the summary
      setStreakHit(after.streak.count > progress.streak.count && STREAK_MILESTONES.includes(after.streak.count) ? after.streak.count : 0)
      setSeconds(seconds)
      completeLesson(correctCount, key, total, seconds)
      clearLessonRun(key)
      setDone(true)
      return
    }
    enter(index + 1)
  }

  const onEnter = question && !checked ? check : retry ? tryAgain : blocked ? () => {} : advance
  // On a practice step, Enter belongs to the simulator's own buttons
  useLessonKeys({ enabled: !done && !practiceTask, onEnter, question, checked, onPick: setSelected })

  if (done) {
    return (
      <LessonSummary
        subtitle={tUi('lessonSummaryBank', { title: t(lesson.title), money: moneyText(wallet) })}
        seconds={seconds}
        payout={pays ? paid : undefined}
        correct={correctCount}
        total={total}
        freezeEarned={freezeEarned}
        streakHit={streakHit}
        // Straight into the next lesson; Learn is one tap away
        action={next ? tUi('lessonNext') : tUi('lessonContinue')}
        onAction={() => navigate(next ? learnHref(mod.courseId, next.mod.id, next.lesson.id) : '/')}
        secondary={next ? tUi('backToLearning') : undefined}
        onSecondary={() => navigate('/')}
      />
    )
  }

  const continueLabel = isLast ? tUi('lessonFinish') : tUi('lessonContinue')

  return (
    <ModuleQuestionsContext.Provider value={mod.questions}>
      <div className={styles.lesson}>
        <LessonTopBar quitTo="/" done={index + (settled ? 1 : 0)} total={steps.length} onBack={index > 0 ? back : undefined} />

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
            <ActivityDoneContext.Provider value={() => setActivitiesDone((d) => ({ ...d, [index]: true }))}>
              <Blocks blocks={step.blocks} />
            </ActivityDoneContext.Provider>
            {/* Whatever room is left under the step, the guide fills it (nothing when the step fills the screen). */}
            {!practiceTask && !activity && <SpaceGuide blocks={step.blocks} step={index} />}
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

        {practiceTask && <PracticeBlock task={practiceTask} />}

        {question && !checked ? (
          <LessonFooter action={tUi('check')} disabled={selected === null} onAction={check} />
        ) : (
          <LessonFooter
            tone={question ? (isCorrect ? 'right' : 'wrong') : undefined}
            paid={!!question && isCorrect && pays && !!answers[index]?.first}
            feedback={question && <AnswerFeedback question={question} correct={isCorrect} pays={pays && !!answers[index]?.first} firstTry={retry} />}
            action={question ? (retry ? tUi('tryAgain') : continueLabel) : tUi('nextBtn')}
            disabled={blocked}
            onAction={retry ? tryAgain : advance}
            secondary={retry ? tUi('reread') : undefined}
            onSecondary={reread}
          />
        )}
      </div>
    </ModuleQuestionsContext.Provider>
  )
}
