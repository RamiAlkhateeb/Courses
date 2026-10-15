import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import type { ParseKeys } from 'i18next'
import { Icon, type IconName } from './Icon'
import styles from './ui.module.css'

const cx = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(' ')

/** `primary` (solid blue: the next step), `indigo`, `white` (on an indigo card), `secondary` (white with a 1px border),
 *  `ghost` (text only), `correct` / `oops`, `onIndigo` (outline on an indigo surface). All flat: no gradient, no shadow. */
export type ButtonVariant = 'primary' | 'indigo' | 'white' | 'secondary' | 'ghost' | 'correct' | 'oops' | 'onIndigo'
export interface ButtonLook {
  variant?: ButtonVariant
  /** `sm`: a 40px pill that fits its label (inline in a header or list). Default: a full-width 56px bar. */
  size?: 'md' | 'sm'
}

/** The class for something that looks like a Button but is not a `<button>`, e.g. `<Link className={buttonClass()} …>`. */
export const buttonClass = ({ variant = 'primary', size = 'md' }: ButtonLook = {}, extra?: string) =>
  cx(styles.btn, styles[variant], size === 'sm' && styles.sm, extra)

export function Button({ variant, size, className, ...rest }: ButtonHTMLAttributes<HTMLButtonElement> & ButtonLook) {
  return <button type="button" className={buttonClass({ variant, size }, className)} {...rest} />
}

/** A soft card. `tone="mint"` = selected / highlighted, `indigo` = a dark card, `dashed` = not started or locked. */
export function Card({
  tone,
  dashed,
  className,
  children,
}: {
  tone?: 'mint' | 'indigo'
  dashed?: boolean
  className?: string
  children: ReactNode
}) {
  return <div className={cx(styles.card, tone === 'mint' && styles.mint, tone === 'indigo' && styles.indigoCard, dashed && styles.dashed, className)}>{children}</div>
}

export type AnswerState = 'idle' | 'selected' | 'correct' | 'wrong' | 'dim'

/** An answer or choice row: a letter (or check / cross) badge and a label. `choice` is the taller row used for
 *  language and daily time, with an icon tile and a trailing radio circle. */
export function AnswerOption({
  state = 'idle',
  letter,
  icon,
  children,
  onClick,
  disabled,
  role,
  radio,
  choice,
  ring,
}: {
  state?: AnswerState
  letter?: ReactNode
  /** Leading icon tile instead of a letter */
  icon?: IconName
  children: ReactNode
  onClick?: () => void
  disabled?: boolean
  role?: 'radio'
  /** Trailing radio circle (a check when selected), for single-choice lists */
  radio?: boolean
  choice?: boolean
  /** Quiz answers: a leading ring (filled when chosen, a check / cross once checked) instead of a letter badge */
  ring?: boolean
}) {
  const badge = state === 'correct' ? <Icon name="check" size={18} /> : state === 'wrong' ? <Icon name="close" size={16} /> : icon ? <Icon name={icon} size={22} /> : letter
  return (
    <button
      type="button"
      role={role}
      aria-checked={role ? state === 'selected' || state === 'correct' : undefined}
      className={cx(styles.option, choice && styles.choice, styles[`opt_${state}`])}
      onClick={onClick}
      disabled={disabled}
    >
      {ring ? (
        <span className={styles.ring} aria-hidden>
          {state === 'correct' && <Icon name="check" size={16} strokeWidth={3} />}
          {state === 'wrong' && <Icon name="close" size={14} strokeWidth={3} />}
        </span>
      ) : (
        badge && <span className={styles.badge}>{badge}</span>
      )}
      <span className={styles.optionBody}>{children}</span>
      {radio && <span className={cx(styles.radio, state === 'selected' && styles.radioOn)}>{state === 'selected' && <Icon name="check" size={16} />}</span>}
    </button>
  )
}

/** Blue fill on a mint track. */
export function ProgressBar({ value, max = 1, label }: { value: number; max?: number; label?: string }) {
  const pct = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0
  return (
    <div className={styles.track} role="progressbar" aria-valuemin={0} aria-valuemax={max} aria-valuenow={value} aria-label={label}>
      <div className={styles.fill} style={{ inlineSize: `${pct}%` }} />
    </div>
  )
}

/** A small rounded pill with an icon and a value: the streak, the play-money balance. */
export function StatPill({ children, className, title }: { children: ReactNode; className?: string; title?: string }) {
  return (
    <span className={cx(styles.stat, className)} title={title}>
      {children}
    </span>
  )
}

const TABS: { to: string; icon: IconName; key: ParseKeys; end?: boolean }[] = [
  { to: '/', icon: 'sprout', key: 'tabLearn', end: true },
  { to: '/playground', icon: 'chart', key: 'tabPlayground' },
  { to: '/me', icon: 'me', key: 'tabMe' },
]

/** The floating pill with the three tabs; the active one is an indigo pill with white text. The order mirrors in RTL. */
export function TabBar() {
  const { t } = useTranslation()
  return (
    <nav className={styles.tabbar} aria-label={t('appName')}>
      {TABS.map((tab) => (
        <NavLink key={tab.to} to={tab.to} end={tab.end} className={({ isActive }) => cx(styles.tab, isActive && styles.tabOn)}>
          <Icon name={tab.icon} size={24} />
          <span>{t(tab.key)}</span>
        </NavLink>
      ))}
    </nav>
  )
}

/** A panel rising from the bottom edge: green or red lesson feedback (`tone`), or a plain sheet. */
export function BottomSheet({
  tone,
  children,
  className,
}: {
  tone?: 'correct' | 'oops'
  children: ReactNode
  className?: string
}) {
  return (
    <div className={cx(styles.sheet, tone && styles[`sheet_${tone}`], className)} role={tone ? 'status' : 'dialog'} aria-live={tone ? 'polite' : undefined}>
      {children}
    </div>
  )
}
