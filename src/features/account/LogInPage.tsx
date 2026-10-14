import { useState, type FormEvent } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Button, TextField } from '../../components/ui'
import { isEmail } from '../../domain/auth'
import { signIn, useAuth, type AuthError } from '../../state/auth'
import { AccountScreen } from './AccountScreen'
import { errorKey, useArrive } from './useAccountFlow'
import styles from './Account.module.css'

/** Designs 27, 28 and 35: log in. A wrong email or password turns the fields red and the mascot sheepish, but never says
 *  which of the two was wrong. */
export function LogInPage() {
  const { t } = useTranslation()
  const auth = useAuth()
  const arrive = useArrive()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<AuthError | null>(null)
  const [tried, setTried] = useState(false)

  if (auth.status === 'signedIn' && !arrive.holding) return <Navigate to="/account" replace />

  async function submit(e: FormEvent) {
    e.preventDefault()
    setTried(true)
    setError(null)
    if (!isEmail(email) || !password) return
    setBusy(true)
    arrive.begin()
    const res = await signIn(email, password)
    setBusy(false)
    if (!res.ok) {
      arrive.fail()
      return setError(res.error)
    }
    arrive.start()
  }

  const wrong = error === 'invalid'
  const emailError = error === 'email' ? t('acc_err_email') : tried && !isEmail(email) ? t('acc_err_email') : undefined
  const message = error && error !== 'email' ? t(errorKey(error)) : undefined

  return (
    <AccountScreen
      mascot={wrong ? 'oops' : 'wave'}
      bubble={wrong ? t('acc_login_oops') : t('acc_login_hi')}
      title={t('acc_login_title')}
    >
      <form className={styles.form} onSubmit={submit} noValidate>
        <TextField
          label={t('acc_email')}
          icon="mail"
          type="email"
          autoComplete="email"
          inputMode="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          state={wrong || emailError ? 'error' : 'idle'}
          message={emailError}
        />
        <TextField
          label={t('acc_password')}
          icon="lock"
          type="password"
          autoComplete="current-password"
          placeholder={t('acc_pw_ph')}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          state={error && error !== 'email' ? 'error' : 'idle'}
          message={message}
        />
        <Link className={`${styles.link} ${styles.linkRight}`} to="/forgot-password" state={{ email: email.trim() }}>
          {t('acc_forgot')}
        </Link>
        {arrive.arriving && (
          <p className={styles.status} role="status">
            {t('acc_syncing')}
          </p>
        )}
        <Button type="submit" disabled={busy || arrive.arriving}>
          {t('acc_sign_in')}
        </Button>
      </form>
      <p className={styles.alt}>
        {t('acc_new_here')}{' '}
        <Link className={styles.link} to="/signup" replace>
          {t('acc_create_link')}
        </Link>
      </p>
    </AccountScreen>
  )
}
