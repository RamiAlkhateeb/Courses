// Building blocks shared by the quiz lesson (LessonPage) and the card lesson (CardLesson).
import { useEffect, useRef, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import type { Question } from '../../content/types'
import { useLocalized } from '../../content/useLocalized'
import { Button, BottomSheet, Card, Coin, Flame, Icon, AnswerOption, ProgressBar, AbuShreek, type AnswerState, type MascotPose } from '../../components/ui'
import { Sprout } from '../../components/GardenArt'
import { currentStreak, localDay } from '../../domain/progress'
import { PAY_PER_CORRECT } from '../../domain/money'
import { Money } from '../../components/Money'
import { WeekDots } from '../../components/WeekStrip'
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
      <ProgressBar value={done} max={total} />
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
        {order.map((i, position) => {
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
              state={state}
              letter={String.fromCharCode(65 + position)}
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

/** Bottom of a lesson screen: AbuShreek beside the action while answering, or the green/red feedback sheet once checked. */
export function LessonFooter({
  tone,
  feedback,
  action,
  disabled,
  onAction,
  mascot,
  compact,
  secondary,
  onSecondary,
}: {
  tone?: 'right' | 'wrong'
  feedback?: ReactNode
  action: string
  disabled?: boolean
  onAction: () => void
  mascot?: MascotPose
  /** A compact button at the end of the row ("Check answer") instead of a full-width bar */
  compact?: boolean
  /** A text link under the sheet's button ("Re-read the lesson card") */
  secondary?: string
  onSecondary?: () => void
}) {
  if (tone) {
    const right = tone === 'right'
    return (
      <BottomSheet tone={right ? 'correct' : 'oops'}>
        <div className={styles.sheetHead}>
          <AbuShreek pose={right ? 'cheer' : 'oops'} height={130} className={styles.sheetMascot} />
          <div className={styles.feedback}>{feedback}</div>
        </div>
        {/* Keyed by action so the button remounts (and autofocuses) when Check turns into Continue. */}
        <Button key={action} variant={right ? 'correct' : 'oops'} onClick={onAction} autoFocus>
          {action}
        </Button>
        {secondary && onSecondary && (
          <button type="button" className={styles.reread} onClick={onSecondary}>
            {secondary}
          </button>
        )}
      </BottomSheet>
    )
  }
  return (
    <div className={styles.footer}>
      {mascot && <AbuShreek pose={mascot} height={110} className={styles.footMascot} />}
      <Button key={action} size={compact ? 'sm' : undefined} className={compact ? styles.compactAction : undefined} disabled={disabled} onClick={onAction}>
        {action}
      </Button>
    </div>
  )
}

/** "Spot on! +$10" (when this lesson pays); a first wrong try is nudged to have another go; a second reveals the answer. */
export function AnswerFeedback({ question, correct, pays, firstTry = false }: { question: Question; correct: boolean; pays: boolean; firstTry?: boolean }) {
  const t = useLocalized()
  const { t: tUi } = useTranslation()
  if (correct)
    return (
      <>
        <strong className={styles.feedbackTitle}>{tUi('spotOn')}</strong>
        {pays && (
          <span className={styles.moneyPill}>
            <Money amount={PAY_PER_CORRECT} sign />
          </span>
        )}
      </>
    )
  return (
    <>
      <strong className={styles.feedbackTitle}>{tUi('notQuiteTitle')}</strong>
      <span className={styles.feedbackNote}>{firstTry ? tUi('notQuiteTry') : tUi('correctAnswerIs', { answer: t(question.options[question.answer]) })}</span>
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
      <svg className={styles.rings} width="390" height="460" viewBox="0 0 390 460" fill="none" aria-hidden focusable="false">
        <g stroke="var(--indigo)" strokeOpacity="0.08" strokeWidth="1.2">
          {[120, 170, 220, 270, 320].map((rx) => (
            <ellipse key={rx} cx="195" cy="170" rx={rx} ry={Math.round(rx * 0.63)} />
          ))}
        </g>
        <circle cx="195" cy="150" r="108" fill="var(--mint)" stroke="var(--sky)" strokeWidth="1.5" />
        <path d="M70 70 L74 78 L82 79 L76 85 L78 93 L70 89 L62 93 L64 85 L58 79 L66 78 Z" fill="var(--sky)" />
        <path d="M330 150 L333 156 L339 157 L335 161 L336 167 L330 164 L324 167 L325 161 L321 157 L327 156 Z" fill="var(--indigo)" />
      </svg>
      <Sprout size={54} style={{ position: 'absolute', insetInlineEnd: 44, insetBlockStart: 34 }} />
      <div className={styles.hero}>
        <AbuShreek pose="cheer" height={220} />
      </div>
      <h1>{tUi('lessonComplete')}</h1>
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      <div className={styles.tiles}>
        {payout !== undefined && payout > 0 && (
          <div className={`${styles.tile} ${styles.tileMoney}`}>
            <span>{tUi('earnedTile')}</span>
            <strong>
              <Coin size={20} /> <Money amount={payout} sign />
            </strong>
          </div>
        )}
        {total > 0 && (
          <div className={`${styles.tile} ${styles.tileAcc}`}>
            <span>{tUi('accuracy')}</span>
            <strong>{tUi('accuracyOf', { c: correct, t: total })}</strong>
          </div>
        )}
        {clock && (
          <div className={`${styles.tile} ${styles.tileTime}`}>
            <span>{tUi('time')}</span>
            <strong>{clock}</strong>
          </div>
        )}
      </div>
      <Card className={styles.weekCard}>
        <p className={styles.weekTitle}>
          <Flame size={22} /> {tUi('daysOnPath', { count: streak })}
        </p>
        <WeekDots activity={progress.activity} />
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
