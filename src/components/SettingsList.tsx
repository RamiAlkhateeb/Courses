// Grouped list rows (Settings, Account): an icon tile, a label, an optional value, a chevron or a switch;
// a row that opens a choice list right under itself (ListPicker: Language, Daily goal, Reminder time), and the bottom sheet for forms.
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import type { ParseKeys } from 'i18next'
import { BottomSheet, Dropdown, Icon, type DropdownOption, type IconName } from './ui'
import { LANGUAGES } from '../i18n'
import { updateProfile, useProfile } from '../state/profile'
import styles from './SettingsList.module.css'

/** A full screen with a back button and a big title (Settings, Account). */
export function ListScreen({ title, back, footer, children }: { title: string; back: string; footer?: ReactNode; children: ReactNode }) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  return (
    <div className={styles.page}>
      <button type="button" className={styles.back} onClick={() => navigate(back)} aria-label={t('back')}>
        <Icon name="back" size={26} />
      </button>
      <h1 className={styles.title}>{title}</h1>
      {children}
      {footer && <footer className={styles.footer}>{footer}</footer>}
    </div>
  )
}

export function ListGroup({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <section className={styles.group}>
      {title && <h2 className={styles.kicker}>{title}</h2>}
      <ul className={styles.list}>{children}</ul>
    </section>
  )
}

/** One row: a button, or a link when given `to`. */
export function ListRow({
  icon,
  label,
  sub,
  value,
  ltr,
  onClick,
  to,
  state,
}: {
  icon: IconName
  label: string
  sub?: string
  value?: string
  ltr?: boolean
  onClick?: () => void
  to?: string
  state?: unknown
}) {
  const inner = (
    <>
      <span className={styles.tile}>
        <Icon name={icon} size={22} />
      </span>
      <span className={styles.label}>
        {label}
        {sub && <small>{sub}</small>}
      </span>
      {value && (
        <span className={styles.value} dir={ltr ? 'ltr' : undefined}>
          {value}
        </span>
      )}
      <Icon name="chevron" size={20} className={styles.chev} />
    </>
  )
  return (
    <li>
      {to ? (
        <Link className={styles.row} to={to} state={state}>
          {inner}
        </Link>
      ) : (
        <button type="button" className={styles.row} onClick={onClick}>
          {inner}
        </button>
      )}
    </li>
  )
}

/** A row with an on/off switch; the whole row toggles it. */
export function ListSwitch({ icon, label, note, checked, disabled, onChange }: { icon: IconName; label: string; note?: string; checked: boolean; disabled?: boolean; onChange?: (on: boolean) => void }) {
  return (
    <li>
      <button type="button" role="switch" aria-checked={checked} disabled={disabled} className={styles.row} onClick={() => onChange?.(!checked)}>
        <span className={styles.tile}>
          <Icon name={icon} size={22} />
        </span>
        {/* The note sits under the label (like a row's sub line), so long notes never squeeze it */}
        <span className={styles.label}>
          {label}
          {note && <small>{note}</small>}
        </span>
        <span className={`${styles.switch} ${checked ? styles.switchOn : ''}`} aria-hidden>
          <span />
        </span>
      </button>
    </li>
  )
}

/** A bottom sheet over a scrim: tap outside or press Escape to close. */
export function Sheet({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])
  return (
    <div className={styles.scrim} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()}>
        <BottomSheet>
          <div className={styles.grab} aria-hidden />
          <h2 className={styles.sheetTitle}>{title}</h2>
          <div className={styles.sheetBody}>{children}</div>
        </BottomSheet>
      </div>
    </div>
  )
}

/** A row whose value is picked from a list that drops down right under it (Dropdown). */
export function ListPicker({ icon, label, value, options }: { icon: IconName; label: string; value?: ReactNode; options: DropdownOption[] }) {
  const [open, setOpen] = useState(false)
  const row = useRef<HTMLButtonElement>(null)
  const pick = (o: DropdownOption) => ({ ...o, onSelect: () => (o.onSelect(), setOpen(false)) })
  return (
    <li>
      <button type="button" ref={row} className={styles.row} aria-haspopup="listbox" aria-expanded={open} onClick={() => setOpen(true)}>
        <span className={styles.tile}>
          <Icon name={icon} size={22} />
        </span>
        <span className={styles.label}>{label}</span>
        {value && <span className={styles.value}>{value}</span>}
        <Icon name="chevronDown" size={20} className={styles.down} />
      </button>
      {open && <Dropdown anchor={row} label={label} options={options.map(pick)} onClose={() => setOpen(false)} />}
    </li>
  )
}

export function LanguagePicker() {
  const { t, i18n } = useTranslation()
  const lang = LANGUAGES.find((l) => l.code === i18n.language)
  return (
    <ListPicker
      icon="globe"
      label={t('language')}
      value={lang && <span lang={lang.code}>{lang.name}</span>}
      options={LANGUAGES.map((l) => ({
        key: l.code,
        label: <span lang={l.code}>{l.name}</span>,
        selected: i18n.language === l.code,
        onSelect: () => void i18n.changeLanguage(l.code),
      }))}
    />
  )
}

const MINUTES = [5, 10, 15, 20]

export function GoalPicker() {
  const { t } = useTranslation()
  const { minutes } = useProfile()
  return (
    <ListPicker
      icon="clock"
      label={t('acc_daily_goal')}
      value={t('minShort', { n: minutes })}
      options={MINUTES.map((m) => ({
        key: String(m),
        label: (
          <span className={styles.optionText}>
            {t('minShort', { n: m })} <small>{t(`pace_${m}` as ParseKeys)}</small>
          </span>
        ),
        selected: minutes === m,
        onSelect: () => updateProfile({ minutes: m }),
      }))}
    />
  )
}
