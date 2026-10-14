import { useState, type FormEvent } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Button, CheckPill, TextField } from '../../components/ui'
import { passwordChecks, passwordOk } from '../../domain/auth'
import { setNewPassword, useAuth, type AuthError } from '../../state/auth'
import { AccountScreen } from './AccountScreen'
import { errorKey } from './useAccountFlow'
import styles from './Account.module.css'

/** Design 31: choose a new password. Reached from the reset email (the app is then in `recovery`) or from Account →
 *  Password (signed in). Both fields must pass before it saves. */
export function NewPasswordPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const auth = useAuth()
  const fromAccount = (useLocation().state as { from?: string } | null)?.from === 'account'
  const [password, setPassword] = useState('')
  const [again, setAgain] = useState('')
  const [tried, setTried] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<AuthError | null>(null)

  if (auth.status === 'loading') return <AccountScreen title={t('loading')} />
  if (auth.status === 'signedOut') return <Navigate to="/forgot-password" replace />

  const checks = passwordChecks(password)
  const match = again.length > 0 && again === password

  async function submit(e: FormEvent) {
    e.preventDefault()
    setTried(true)
    setError(null)
    if (!passwordOk(password) || password !== again) return
    setBusy(true)
    const res = await setNewPassword(password)
    setBusy(false)
    if (!res.ok) return setError(res.error)
    navigate(fromAccount ? '/account' : '/', { replace: true })
  }

  return (
    <AccountScreen
      title={t('acc_np_title')}
      sub={t('acc_np_sub')}
      footer={
        <Button type="submit" form="new-password-form" disabled={busy}>
          {t('acc_save_password')}
        </Button>
      }
    >
      <form id="new-password-form" className={styles.form} onSubmit={submit} noValidate>
        <TextField
          label={t('acc_np_label')}
          icon="lock"
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          state={tried && !passwordOk(password) ? 'error' : 'idle'}
        />
        <ul className={styles.checks} aria-label={t('acc_pw_rules')}>
          <CheckPill ok={checks.length}>{t('acc_chk_len')}</CheckPill>
          <CheckPill ok={checks.number}>{t('acc_chk_num')}</CheckPill>
          <CheckPill ok={checks.letter}>{t('acc_chk_letter')}</CheckPill>
        </ul>
        <TextField
          label={t('acc_confirm_pw')}
          icon="lock"
          type="password"
          autoComplete="new-password"
          value={again}
          onChange={(e) => setAgain(e.target.value)}
          state={match ? 'valid' : again.length > 0 && tried ? 'error' : 'idle'}
          message={match ? t('acc_match') : again.length > 0 && tried ? t('acc_nomatch') : undefined}
        />
        {error && (
          <p className={styles.fieldError} role="alert">
            {t(errorKey(error))}
          </p>
        )}
      </form>
    </AccountScreen>
  )
}
