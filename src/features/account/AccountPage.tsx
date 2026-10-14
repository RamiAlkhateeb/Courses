import { useEffect, useState, type FormEvent, type ReactNode } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import type { ParseKeys } from 'i18next'
import { AnswerOption, BottomSheet, Button, Icon, TextField, type IconName } from '../../components/ui'
import { LANGUAGES } from '../../i18n'
import { cleanName, isEmail } from '../../domain/auth'
import { signOut, updateEmail, updateName, useAuth, type AuthError } from '../../state/auth'
import { updateProfile, useProfile } from '../../state/profile'
import { useSyncStatus } from '../../state/sync'
import { AccountScreen } from './AccountScreen'
import { errorKey } from './useAccountFlow'
import styles from './Account.module.css'

const MINUTES = [5, 10, 15, 20]

/** Design 32: the account. Profile (name, email, password), preferences (language, daily goal), about (terms, privacy,
 *  help), Log out and Delete account. Name, email, language and daily goal change in a bottom sheet. */
export function AccountPage() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const auth = useAuth()
  const sync = useSyncStatus()
  const { minutes } = useProfile()
  const [sheet, setSheet] = useState<'name' | 'email' | 'language' | 'goal' | null>(null)

  if (auth.status === 'loading') return <AccountScreen title={t('loading')} onBack={() => navigate('/me')} />
  if (auth.status !== 'signedIn' || !auth.user) return <Navigate to="/login" replace />
  const { user } = auth
  const lang = LANGUAGES.find((l) => l.code === i18n.language)

  return (
    <AccountScreen title={t('acc_title')} onBack={() => navigate('/me')}>
      <p className={`${styles.syncLine} ${sync === 'synced' ? styles.syncOk : ''}`} role="status">
        <Icon name={sync === 'synced' ? 'check' : 'review'} size={18} /> {t(`acc_sync_${sync === 'off' ? 'syncing' : sync}` as 'acc_sync_synced')}
      </p>

      <Section title={t('acc_s_profile')}>
        <Row icon="user" label={t('acc_name')} value={user.name || '—'} onClick={() => setSheet('name')} />
        <Row icon="mail" label={t('acc_email')} value={user.email} ltr onClick={() => setSheet('email')} />
        <Row icon="lock" label={t('acc_password')} value={t('acc_change')} to="/new-password" state={{ from: 'account' }} />
      </Section>

      <Section title={t('acc_s_prefs')}>
        <Row icon="globe" label={t('language')} value={lang?.name} onClick={() => setSheet('language')} />
        <Row icon="clock" label={t('acc_daily_goal')} value={t('minShort', { n: minutes })} onClick={() => setSheet('goal')} />
      </Section>

      <Section title={t('acc_s_about')}>
        <Row icon="doc" label={t('acc_terms')} to="/legal/terms" />
        <Row icon="shield" label={t('acc_privacy_policy')} to="/legal/privacy" />
        <Row icon="help" label={t('acc_help')} to="/legal/help" />
      </Section>

      <footer className={styles.footer}>
        <Button
          variant="secondary"
          onClick={async () => {
            await signOut()
            navigate('/me', { replace: true })
          }}
        >
          <Icon name="logout" size={22} /> {t('acc_log_out')}
        </Button>
        <Link to="/account/delete" className={styles.danger}>
          {t('acc_delete')}
        </Link>
      </footer>

      {sheet === 'name' && <NameSheet initial={user.name} onClose={() => setSheet(null)} />}
      {sheet === 'email' && <EmailSheet initial={user.email} onClose={() => setSheet(null)} />}
      {sheet === 'language' && (
        <Sheet title={t('language')} onClose={() => setSheet(null)}>
          {LANGUAGES.map((l) => (
            <AnswerOption
              choice
              radio
              key={l.code}
              role="radio"
              state={i18n.language === l.code ? 'selected' : 'idle'}
              letter={<span lang={l.code}>{l.letter}</span>}
              onClick={() => {
                void i18n.changeLanguage(l.code)
                setSheet(null)
              }}
            >
              <strong lang={l.code}>{l.name}</strong>
            </AnswerOption>
          ))}
        </Sheet>
      )}
      {sheet === 'goal' && (
        <Sheet title={t('acc_daily_goal')} onClose={() => setSheet(null)}>
          {MINUTES.map((m) => (
            <AnswerOption
              choice
              radio
              key={m}
              role="radio"
              state={minutes === m ? 'selected' : 'idle'}
              onClick={() => {
                updateProfile({ minutes: m })
                setSheet(null)
              }}
            >
              <strong>{t('minShort', { n: m })}</strong> <small>{t(`pace_${m}` as ParseKeys)}</small>
            </AnswerOption>
          ))}
        </Sheet>
      )}
    </AccountScreen>
  )
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className={styles.group}>
      <h2 className={styles.kicker}>{title}</h2>
      <ul className={styles.list}>{children}</ul>
    </section>
  )
}

/** One row: an icon tile, a label, an optional value and a chevron. A button, or a link when given `to`. */
function Row({ icon, label, value, ltr, onClick, to, state }: { icon: IconName; label: string; value?: string; ltr?: boolean; onClick?: () => void; to?: string; state?: unknown }) {
  const inner = (
    <>
      <span className={styles.tile}>
        <Icon name={icon} size={22} />
      </span>
      <span className={styles.rowLabel}>{label}</span>
      {value && (
        <span className={styles.rowValue} dir={ltr ? 'ltr' : undefined}>
          {value}
        </span>
      )}
      <Icon name="chevron" size={20} className={styles.chev} />
    </>
  )
  return <li>{to ? <Link className={styles.row} to={to} state={state}>{inner}</Link> : <button type="button" className={styles.row} onClick={onClick}>{inner}</button>}</li>
}

/** A bottom sheet over a scrim: tap outside or press Escape to close. */
function Sheet({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
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

function NameSheet({ initial, onClose }: { initial: string; onClose: () => void }) {
  const { t } = useTranslation()
  const [name, setName] = useState(initial)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<AuthError | 'name' | null>(null)
  async function save(e: FormEvent) {
    e.preventDefault()
    if (!cleanName(name)) return setError('name')
    setBusy(true)
    const res = await updateName(cleanName(name))
    setBusy(false)
    if (!res.ok) return setError(res.error)
    onClose()
  }
  return (
    <Sheet title={t('acc_edit_name')} onClose={onClose}>
      <form className={styles.sheetBody} onSubmit={save} noValidate>
        <TextField label={t('acc_name')} icon="user" autoComplete="name" autoFocus maxLength={60} value={name} onChange={(e) => setName(e.target.value)} state={error ? 'error' : 'idle'} message={error ? (error === 'name' ? t('acc_err_name') : t(errorKey(error))) : undefined} />
        <Button type="submit" disabled={busy}>
          {t('acc_save')}
        </Button>
      </form>
    </Sheet>
  )
}

function EmailSheet({ initial, onClose }: { initial: string; onClose: () => void }) {
  const { t } = useTranslation()
  const [email, setEmail] = useState(initial)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<AuthError | null>(null)
  const [sent, setSent] = useState(false)
  async function save(e: FormEvent) {
    e.preventDefault()
    if (!isEmail(email)) return setError('email')
    if (email.trim() === initial) return onClose()
    setBusy(true)
    const res = await updateEmail(email)
    setBusy(false)
    if (!res.ok) return setError(res.error)
    setSent(true)
  }
  return (
    <Sheet title={t('acc_edit_email')} onClose={onClose}>
      {sent ? (
        <>
          <p className={styles.notice} role="status">
            {t('acc_email_sent', { email: email.trim() })}
          </p>
          <Button onClick={onClose}>{t('close')}</Button>
        </>
      ) : (
        <form className={styles.sheetBody} onSubmit={save} noValidate>
          <TextField label={t('acc_email')} icon="mail" type="email" autoComplete="email" inputMode="email" autoFocus value={email} onChange={(e) => setEmail(e.target.value)} state={error ? 'error' : 'idle'} message={error ? t(errorKey(error)) : undefined} />
          <Button type="submit" disabled={busy}>
            {t('acc_save')}
          </Button>
        </form>
      )}
    </Sheet>
  )
}
