import { useEffect, useState, type FormEvent } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { AbuShreek, Button, Icon } from '../../components/ui'
import { accountsEnabled } from '../../state/supabase'
import { deleteAccount, requestPasswordReset, setNewPassword, signIn, signOut, signUp, useAuth, type AuthError, type AuthResult } from '../../state/auth'
import { useSyncStatus } from '../../state/sync'
import styles from './AccountPage.module.css'

const errorKey = (e: AuthError) =>
  ({ unconfirmed: 'acc_err_unconfirmed', invalid: 'acc_err_invalid', exists: 'acc_err_exists', weak: 'acc_err_weak', email: 'acc_err_email', rate: 'acc_err_rate', network: 'acc_err_network', unknown: 'acc_err_unknown' })[e] as 'acc_err_unknown'

/** Optional accounts: sign in or create one to keep progress and play money on every device. Guest mode stays complete. */
export function AccountPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const auth = useAuth()
  const sync = useSyncStatus()
  // Just signed in or up: stay for a moment while the account's data is merged in (otherwise a device that has not been
  // through onboarding could bounce back to Welcome), then go home. Never wait more than a few seconds.
  const [arriving, setArriving] = useState(false)
  const signedIn = auth.status === 'signedIn'
  const settled = sync === 'synced' || sync === 'error' || sync === 'offline'
  useEffect(() => {
    if (!arriving || !signedIn) return
    if (settled) return void navigate('/', { replace: true })
    const id = setTimeout(() => navigate('/', { replace: true }), 6000)
    return () => clearTimeout(id)
  }, [arriving, signedIn, settled, navigate])
  if (!accountsEnabled) return <Navigate to="/me" replace />

  return (
    <div className={styles.page}>
      <button type="button" className={styles.back} onClick={() => navigate(-1)} aria-label={t('back')}>
        <Icon name="back" size={26} />
      </button>
      <h1>{t('acc_title')}</h1>
      {auth.status === 'loading' && <p className={styles.sub}>{t('loading')}</p>}
      {arriving && signedIn && <p className={styles.sub} role="status">{t('acc_syncing')}</p>}
      {auth.status === 'signedOut' && <SignedOut onDone={() => setArriving(true)} />}
      {signedIn && !arriving && auth.user && <SignedIn email={auth.user.email} />}
      {auth.status === 'recovery' && <NewPassword />}
    </div>
  )
}

function Field({ id, label, ...rest }: { id: string; label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label htmlFor={id} className={styles.field}>
      <span>{label}</span>
      <input id={id} dir="ltr" {...rest} />
    </label>
  )
}

function SignedOut({ onDone }: { onDone: () => void }) {
  const { t } = useTranslation()
  const [mode, setMode] = useState<'in' | 'up'>('in')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<AuthError | null>(null)
  const [notice, setNotice] = useState<'confirm' | 'reset' | null>(null)

  async function submit(e: FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError(null)
    setNotice(null)
    const res: AuthResult = mode === 'in' ? await signIn(email, password) : await signUp(email, password)
    setBusy(false)
    if (!res.ok) return setError(res.error)
    if (res.needsConfirmation) return setNotice('confirm')
    onDone()
  }

  async function forgot() {
    if (!email.trim()) return setError('email')
    setBusy(true)
    setError(null)
    const res = await requestPasswordReset(email)
    setBusy(false)
    if (!res.ok) return setError(res.error)
    setNotice('reset')
  }

  return (
    <>
      <p className={styles.sub}>{t('acc_sub')}</p>
      <div className={styles.seg} role="group" aria-label={t('acc_title')}>
        <button type="button" aria-pressed={mode === 'in'} onClick={() => setMode('in')}>
          {t('acc_sign_in')}
        </button>
        <button type="button" aria-pressed={mode === 'up'} onClick={() => setMode('up')}>
          {t('acc_create')}
        </button>
      </div>
      <form onSubmit={submit} className={styles.form} noValidate>
        <Field id="acc-email" label={t('acc_email')} type="email" autoComplete="email" inputMode="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <Field
          id="acc-password"
          label={t('acc_password')}
          type="password"
          autoComplete={mode === 'in' ? 'current-password' : 'new-password'}
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {mode === 'up' && <small className={styles.hint}>{t('acc_password_hint')}</small>}
        {error && (
          <p className={styles.error} role="alert">
            {t(errorKey(error))}
          </p>
        )}
        {notice && (
          <p className={styles.notice} role="status">
            {notice === 'confirm' ? t('acc_check_email_confirm') : t('acc_check_email_reset')}
          </p>
        )}
        <Button type="submit" disabled={busy || !email.trim() || password.length < 1}>
          {busy ? t('acc_syncing') : mode === 'in' ? t('acc_sign_in') : t('acc_create')}
        </Button>
        {mode === 'in' && (
          <Button type="button" variant="ghost" size="sm" className={styles.center} onClick={forgot} disabled={busy}>
            {t('acc_forgot')}
          </Button>
        )}
      </form>
      <div className={styles.guide}>
        <AbuShreek pose="think" height={110} />
        <p className={styles.bubble}>{t('acc_guest_ok')}</p>
      </div>
      <p className={styles.fine}>{t('acc_privacy')}</p>
    </>
  )
}

function SignedIn({ email }: { email: string }) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const sync = useSyncStatus()
  const [confirming, setConfirming] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<AuthError | null>(null)

  async function remove() {
    setBusy(true)
    const res = await deleteAccount()
    setBusy(false)
    if (!res.ok) return setError(res.error)
    navigate('/me', { replace: true })
  }

  return (
    <>
      <div className={styles.card}>
        <p className={styles.kicker}>{t('acc_signed_in_as')}</p>
        <strong className={styles.email} dir="ltr">
          {email}
        </strong>
        <p className={`${styles.status} ${sync === 'synced' ? styles.ok : ''}`} role="status">
          <Icon name={sync === 'synced' ? 'check' : 'review'} size={18} /> {t(`acc_sync_${sync === 'off' ? 'syncing' : sync}` as 'acc_sync_synced')}
        </p>
        <p className={styles.fine}>{t('acc_sync_what')}</p>
      </div>
      <Button
        variant="secondary"
        onClick={async () => {
          await signOut()
          navigate('/me', { replace: true })
        }}
      >
        {t('acc_sign_out')}
      </Button>
      <p className={styles.fine}>{t('acc_sign_out_note')}</p>
      <div className={styles.danger}>
        {!confirming ? (
          <Button variant="ghost" onClick={() => setConfirming(true)}>
            {t('acc_delete')}
          </Button>
        ) : (
          <div className={styles.card}>
            <p>{t('acc_delete_confirm')}</p>
            {error && (
              <p className={styles.error} role="alert">
                {t(errorKey(error))}
              </p>
            )}
            <Button variant="oops" disabled={busy} onClick={remove}>
              {t('acc_delete_yes')}
            </Button>
            <Button variant="secondary" onClick={() => setConfirming(false)}>
              {t('acc_cancel')}
            </Button>
          </div>
        )}
      </div>
    </>
  )
}

/** Arrived from the reset-password email: choose a new password. */
function NewPassword() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<AuthError | null>(null)

  async function submit(e: FormEvent) {
    e.preventDefault()
    setBusy(true)
    const res = await setNewPassword(password)
    setBusy(false)
    if (!res.ok) return setError(res.error)
    navigate('/', { replace: true })
  }

  return (
    <form onSubmit={submit} className={styles.form}>
      <p className={styles.sub}>{t('acc_new_password_sub')}</p>
      <Field id="acc-new" label={t('acc_new_password')} type="password" autoComplete="new-password" minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} required />
      <small className={styles.hint}>{t('acc_password_hint')}</small>
      {error && (
        <p className={styles.error} role="alert">
          {t(errorKey(error))}
        </p>
      )}
      <Button type="submit" disabled={busy || password.length < 8}>
        {t('acc_save_password')}
      </Button>
    </form>
  )
}
