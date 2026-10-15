// Building blocks shared by the quiz lesson (LessonPage) and the card lesson (CardLesson).
import { useEffect, useRef, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import type { Question } from '../../content/types'
import { useLocalized } from '../../content/useLocalized'
import { Button, Card, Coin, Icon, AnswerOption, ProgressBar, AbuShreek, type AnswerState } from '../../components/ui'
import { Sprout } from '../../components/GardenArt'
import { currentStreak, localDay } from '../../domain/progress'
import { PAY_PER_CORRECT } from '../../domain/money'
import { Money } from '../../components/Money'
import { useProgress } from '../../state/useProgress'
import { optionOrder } from '../../domain/optionOrder'
import { playSound } from '../../state/sound'
import styles from './LessonPage.module.css'

/** ✕ (quit), the blue progress bar and an "n/total" counter. */
export function LessonTopBar({ quitTo, done, total }: { quitTo: string; done: number; total: number }) {
  const { t } = useTranslation()
  return (
    <div className={styles.top}>
      <Link to={quitTo} className={styles.quit} aria-label={t('lessonQuit')}>
        <Icon name="close" size={26} />
      </Link>
      <ProgressBar value={done} max={total} label={t('lesson_progress')} />
      <span className={styles.counter}>
        {Math.min(done + 1, total)}/{total}
      </span>
    </div>
  )
}

/** A question's prompt and options (in their stable shuffled order), with right/wrong states once checked. */
export function QuestionCard({
  question,
  kicker,
  selected,
  checked,
  reveal = true,
  onSelect,
}: {
  question: Question
  kicker?: string
  selected: number | null
  checked: boolean
  /** Show which option was right. False after a first wrong try: only the wrong pick is marked, so they can try again. */
  reveal?: boolean
  onSelect: (option: number) => void
}) {
  const t = useLocalized()
  // Display position → index into question.options (see optionOrder).
  const order = optionOrder(question.id, question.options.length)
  return (
    <>
      {kicker && <p className={styles.kicker}>{kicker}</p>}
      <h1 className={styles.prompt}>{t(question.prompt)}</h1>
      <div className={styles.options} role="radiogroup">
        {order.map((i) => {
          const state: AnswerState = !checked
            ? selected === i
              ? 'selected'
              : 'idle'
            : i === selected
              ? i === question.answer
                ? 'correct'
                : 'wrong'
              : reveal && i === question.answer
                ? 'correct'
                : 'dim'
          return (
            <AnswerOption
              key={i}
              role="radio"
              ring
              state={state}
              disabled={checked}
              onClick={() => onSelect(i)}
            >
              {t(question.options[i])}
            </AnswerOption>
          )
        })}
      </div>
    </>
  )
}

/** Bottom of a lesson screen: a full-width action (Check answer / Continue / Try again) docked at the bottom. Once an answer
 *  is checked it is preceded, in the page flow right under the options, by a flat result card: a small mascot, the
 *  title (Correct / Not quite), the explanation, and "+$10" when the lesson pays. Wrong answers add "Re-read the lesson
 *  card" under the button. */
export function LessonFooter({
  tone,
  feedback,
  action,
  disabled,
  onAction,
  secondary,
  onSecondary,
}: {
  tone?: 'right' | 'wrong'
  feedback?: ReactNode
  action: string
  disabled?: boolean
  onAction: () => void
  /** A text link under the button ("Re-read the lesson card") */
  secondary?: string
  onSecondary?: () => void
}) {
  const right = tone === 'right'
  return (
    <>
      {tone && (
        <div className={`${styles.result} ${right ? styles.resultRight : styles.resultWrong}`} role="status" aria-live="polite">
          <AbuShreek pose={right ? 'cheer' : 'oops'} height={64} className={styles.resultMascot} />
          <div className={styles.feedback}>{feedback}</div>
        </div>
      )}
      <div className={styles.footer}>
        {/* Keyed by action so the button remounts (and autofocuses) when Check turns into Continue. */}
        <Button key={action} disabled={disabled} onClick={onAction} autoFocus={!!tone}>
          {action}
        </Button>
        {secondary && onSecondary && (
          <button type="button" className={styles.reread} onClick={onSecondary}>
            {secondary}
          </button>
        )}
      </div>
    </>
  )
}

/** "Correct +$10" (when this lesson pays) and why; a first wrong try is nudged to have another go; a second reveals the answer and why. */
export function AnswerFeedback({ question, correct, pays, firstTry = false }: { question: Question; correct: boolean; pays: boolean; firstTry?: boolean }) {
  const t = useLocalized()
  const { t: tUi } = useTranslation()
  // The explanation gives the answer away, so a first wrong try only gets the nudge to try again.
  const why = question.explain && (correct || !firstTry) ? <span className={styles.feedbackNote}>{t(question.explain)}</span> : null
  if (correct)
    return (
      <>
        <strong className={styles.feedbackTitle}>{tUi('fb_correct')}</strong>
        {pays && (
          <span className={styles.moneyPill}>
            <Money amount={PAY_PER_CORRECT} sign />
          </span>
        )}
        {why}
      </>
    )
  return (
    <>
      <strong className={styles.feedbackTitle}>{tUi('notQuiteTitle')}</strong>
      <span className={styles.feedbackNote}>{firstTry ? tUi('notQuiteTry') : tUi('correctAnswerIs', { answer: t(question.options[question.answer]) })}</span>
      {why}
    </>
  )
}

/** Plays the right/wrong sound for a check; call it where the answer is graded. */
export const playAnswerSound = (correct: boolean) => playSound(correct ? 'correct' : 'wrong')

/**
 * Keyboard for a lesson screen: Enter runs `onEnter` (check / continue), 1–9 pick the n-th displayed
 * option of `question` while it is not yet checked. Links keep their own Enter.
 */
export function useLessonKeys(opts: {
  enabled: boolean
  onEnter: () => void
  question?: Question
  checked?: boolean
  onPick?: (option: number) => void
}) {
  // Read through a ref so the listener is registered once but always sees the latest handlers.
  const latest = useRef(opts)
  latest.current = opts
  useEffect(() => {
    if (!opts.enabled) return
    function onKey(e: KeyboardEvent) {
      const { onEnter, question, checked, onPick } = latest.current
      if (e.target instanceof HTMLAnchorElement) return
      if (e.key === 'Enter') {
        e.preventDefault() // stop a focused button from also handling it
        onEnter()
        return
      }
      if (!question || checked || !onPick) return
      const order = optionOrder(question.id, question.options.length)
      const n = Number(e.key)
      if (n >= 1 && n <= order.length) onPick(order[n - 1])
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [opts.enabled])
}

/** "Lesson complete!": the mascot cheers, then EARNED / ACCURACY / TIME tiles, the week's streak, and the actions. */
export function LessonSummary({
  correct,
  total,
  seconds,
  payout,
  subtitle,
  action,
  onAction,
  secondary,
  onSecondary,
}: {
  correct: number
  total: number
  seconds?: number
  /** Dollars this lesson paid into the wallet. Undefined: a replay or practice run, which pays nothing (and says so) */
  payout?: number
  subtitle?: string
  action: string
  onAction: () => void
  /** "Review my mistake": only offered when something was missed */
  secondary?: string
  onSecondary?: () => void
}) {
  const { t: tUi } = useTranslation()
  const { progress } = useProgress()
  const streak = currentStreak(progress.streak, localDay())

  useEffect(() => playSound('complete'), [])
  const clock = seconds === undefined ? '' : `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`

  return (
    <div className={`${styles.lesson} ${styles.summary}`}>
      <div className={styles.hero}>
        <span className={styles.heroDisc} aria-hidden />
        <AbuShreek pose="cheer" height={210} />
        <Sprout size={44} style={{ position: 'absolute', insetInlineEnd: 56, insetBlockStart: 6 }} />
      </div>
      <h1>{tUi('lessonComplete')}</h1>
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      <Card className={styles.stats}>
        {payout !== undefined && payout > 0 && (
          <div className={styles.statCol}>
            <span>{tUi('earnedTile')}</span>
            <strong>
              <Coin size={20} /> <Money amount={payout} sign />
            </strong>
          </div>
        )}
        {total > 0 && (
          <div className={correct === total ? `${styles.statCol} ${styles.statGood}` : styles.statCol}>
            <span>{tUi('accuracy')}</span>
            <strong>{tUi('accuracyOf', { c: correct, t: total })}</strong>
          </div>
        )}
        {clock && (
          <div className={styles.statCol}>
            <span>{tUi('time')}</span>
            <strong>{clock}</strong>
          </div>
        )}
      </Card>
      <Card className={styles.weekCard}>
        <p className={styles.weekTitle}>
          <Icon name="calendar" size={22} /> {tUi('streakDays', { count: streak })}
        </p>
        <ProgressBar value={Math.min(streak, 7)} max={7} label={tUi('sum_streak_bar', { n: Math.min(streak, 7) })} />
        <p className={styles.weekNote}>{streak >= 7 ? tUi('sum_streak_full') : tUi('sum_streak_bar', { n: streak })}</p>
      </Card>
      <div className={styles.actions}>
        <p className={styles.fine}>{payout === undefined ? tUi('practiceNoPay') : tUi('educationalOnly')}</p>
        <Button onClick={onAction} autoFocus>
          {action}
        </Button>
        {secondary && onSecondary && (
          <Button variant="secondary" onClick={onSecondary}>
            {secondary}
          </Button>
        )}
      </div>
    </div>
  )
}
