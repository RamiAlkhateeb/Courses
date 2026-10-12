import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import type { ParseKeys } from 'i18next'
import { Icon, type IconName } from './Icon'
import styles from './ui.module.css'

const cx = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(' ')

/** `primary` (saffron: the next step), `secondary` (flat card), `ghost` (text), `correct`/`oops` (feedback sheets). */
export function Button({
  variant = 'primary',
  className,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'ghost' | 'correct' | 'oops' | 'ink' }) {
  return <button type="button" className={cx(styles.btn, styles[variant], className)} {...rest} />
}

/** Flat 1px-border card. `tone="dawn"` = selected/highlighted, `dashed` = not started or locked. */
export function Card({
  tone,
  dashed,
  className,
  children,
}: {
  tone?: 'dawn' | 'ink'
  dashed?: boolean
  className?: string
  children: ReactNode
}) {
  return <div className={cx(styles.card, tone === 'dawn' && styles.dawn, tone === 'ink' && styles.inkCard, dashed && styles.dashed, className)}>{children}</div>
}

export type OptionState = 'idle' | 'selected' | 'correct' | 'wrong' | 'dim'

/** An answer / choice row: a letter (or check/cross) badge and a label. */
export function OptionCard({
  state = 'idle',
  letter,
  icon,
  children,
  onClick,
  disabled,
  role,
  radio,
}: {
  state?: OptionState
  letter?: string
  /** Leading icon tile instead of a letter (onboarding choices) */
  icon?: IconName
  children: ReactNode
  onClick?: () => void
  disabled?: boolean
  role?: 'radio'
  /** Trailing radio circle (a check when selected), for single-choice lists */
  radio?: boolean
}) {
  const badge = state === 'correct' ? <Icon name="check" size={18} /> : state === 'wrong' ? <Icon name="close" size={18} /> : icon ? <Icon name={icon} size={20} /> : letter
  return (
    <button
      type="button"
      role={role}
      aria-checked={role ? state === 'selected' || state === 'correct' : undefined}
      className={cx(styles.option, styles[`opt_${state}`])}
      onClick={onClick}
      disabled={disabled}
    >
      {badge && <span className={styles.badge}>{badge}</span>}
      <span className={styles.optionBody}>{children}</span>
      {radio && <span className={cx(styles.radio, state === 'selected' && styles.radioOn)}>{state === 'selected' && <Icon name="check" size={16} />}</span>}
    </button>
  )
}

/** Saffron fill on a sand track. `segments` draws one pill per step instead (lesson progress). */
export function ProgressBar({ value, max = 1, label }: { value: number; max?: number; label?: string }) {
  const pct = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0
  return (
    <div className={styles.track} role="progressbar" aria-valuemin={0} aria-valuemax={max} aria-valuenow={value} aria-label={label}>
      <div className={styles.fill} style={{ inlineSize: `${pct}%` }} />
    </div>
  )
}

const TABS: { to: string; icon: IconName; key: ParseKeys; end?: boolean }[] = [
  { to: '/', icon: 'path', key: 'tabPath', end: true },
  { to: '/review', icon: 'review', key: 'tabReview' },
  { to: '/terms', icon: 'book', key: 'tabTerms' },
  { to: '/me', icon: 'me', key: 'tabMe' },
]

/** Bottom navigation of the four main screens; the active tab sits on a dawn pill. */
export function TabBar() {
  const { t } = useTranslation()
  return (
    <nav className={styles.tabbar} aria-label={t('appName')}>
      {TABS.map((tab) => (
        <NavLink key={tab.to} to={tab.to} end={tab.end} className={({ isActive }) => cx(styles.tab, isActive && styles.tabOn)}>
          <Icon name={tab.icon} size={26} />
          <span>{t(tab.key)}</span>
        </NavLink>
      ))}
    </nav>
  )
}

/** Sheet rising from the bottom edge: lesson feedback (`tone`) or a prompt like the rest-day offer. */
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

export type NodeState = 'done' | 'next' | 'locked' | 'checkpoint'

/** A stop on the path: done (ink + check), next (saffron + play), locked (dashed), checkpoint (star). */
export function PathNode({
  state,
  size = 56,
  onClick,
  label,
  onMountain,
}: {
  state: NodeState
  size?: number
  onClick?: () => void
  label: string
  /** Drawn on the navy mountain (lighter fills) rather than on paper */
  onMountain?: boolean
}) {
  const icon: IconName = state === 'done' ? 'check' : state === 'next' ? 'play' : state === 'locked' ? 'lock' : 'star'
  const inner = <Icon name={icon} size={Math.round(size * 0.46)} />
  const cls = cx(styles.node, styles[`node_${state}`], onMountain && styles.nodeMtn)
  const style = { inlineSize: size, blockSize: size }
  if (!onClick || state === 'locked')
    return (
      <span className={cls} style={style} role="img" aria-label={label}>
        {inner}
      </span>
    )
  return (
    <button type="button" className={cls} style={style} onClick={onClick} aria-label={label}>
      {inner}
    </button>
  )
}
