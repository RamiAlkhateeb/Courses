import { useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { Trans, useTranslation } from 'react-i18next'
import { Button, CheckPill, TextField } from '../../components/ui'
import { cleanName, isEmail, passwordChecks, passwordOk } from '../../domain/auth'
import { signUp, useAuth, type AuthError } from '../../state/auth'
import { AccountScreen } from './AccountScreen'
import { errorKey, useArrive } from './useAccountFlow'
import styles from './Account.module.css'

/** Design 25 (and 34 in Arabic): create an account. Name, email, a password that must pass three visible rules, and
 *  agreement to the terms. With email confirmation on, it continues to "Confirm your email". */
export function SignUpPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const auth = useAuth()
  const arrive = useArrive()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [agree, setAgree] = useState(false)
  const [tried, setTried] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<AuthError | null>(null)

  if (auth.status === 'signedIn' && !arrive.holding) return <Navigate to="/account" replace />

  const checks = passwordChecks(password)
  const nameBad = tried && !cleanName(name)
  const emailBad = tried && !isEmail(email)
  const pwBad = tried && !passwordOk(password)

  async function submit(e: FormEvent) {
    e.preventDefault()
    setTried(true)
    setError(null)
    if (!cleanName(name) || !isEmail(email) || !passwordOk(password) || !agree) return
    setBusy(true)
    arrive.begin()
    const res = await signUp(email, password, cleanName(name))
    setBusy(false)
    if (!res.ok) {
      arrive.fail()
      return setError(res.error)
    }
    // The project does not require email confirmation. If it ever does, there is no session yet: send them to log in.
    if (res.needsConfirmation) return navigate('/login', { replace: true })
    arrive.start()
  }

  const emailError = error === 'exists' || error === 'email' ? t(errorKey(error)) : emailBad ? t('acc_err_email') : undefined
  const formError = error && error !== 'exists' && error !== 'email' ? t(errorKey(error)) : undefined

  return (
    <AccountScreen title={t('acc_signup_title')} sub={t('acc_signup_sub')} progress={1}>
      <form className={styles.form} onSubmit={submit} noValidate>
        <TextField
          label={t('acc_name')}
          icon="user"
          autoComplete="name"
          value={name}
          maxLength={60}
          onChange={(e) => setName(e.target.value)}
          state={nameBad ? 'error' : cleanName(name) ? 'valid' : 'idle'}
          message={nameBad ? t('acc_err_name') : undefined}
        />
        <TextField
          label={t('acc_email')}
          icon="mail"
          type="email"
          autoComplete="email"
          inputMode="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          state={emailError ? 'error' : 'idle'}
          message={emailError}
        />
        <div className={styles.form} style={{ gap: 10 }}>
          <TextField
            label={t('acc_password')}
            icon="lock"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            state={pwBad ? 'error' : 'idle'}
          />
          <ul className={styles.checks} aria-label={t('acc_pw_rules')}>
            <CheckPill ok={checks.length}>{t('acc_chk_len')}</CheckPill>
            <CheckPill ok={checks.number}>{t('acc_chk_num')}</CheckPill>
            <CheckPill ok={checks.letter}>{t('acc_chk_letter')}</CheckPill>
          </ul>
        </div>
        <label className={styles.agree}>
          <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
          <span>
            <Trans
              i18nKey="acc_agree"
              components={{ terms: <Link to="/legal/terms" />, privacy: <Link to="/legal/privacy" /> }}
            />
          </span>
        </label>
        {tried && !agree && (
          <p className={styles.fieldError} role="alert">
            {t('acc_err_terms')}
          </p>
        )}
        {formError && (
          <p className={styles.fieldError} role="alert">
            {formError}
          </p>
        )}
        {arrive.arriving && (
          <p className={styles.status} role="status">
            {t('acc_syncing')}
          </p>
        )}
        <Button type="submit" disabled={busy || arrive.arriving}>
          {t('acc_create')}
        </Button>
      </form>
      <p className={styles.alt}>
        {t('acc_have_account')}{' '}
        <Link className={styles.link} to="/login" replace>
          {t('acc_log_in_link')}
        </Link>
      </p>
    </AccountScreen>
  )
}
