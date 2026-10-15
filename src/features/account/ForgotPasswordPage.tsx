import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Button, TextField } from '../../components/ui'
import { isEmail } from '../../domain/auth'
import { requestPasswordReset } from '../../state/auth'
import { AccountScreen } from './AccountScreen'
import { errorKey, useEmailFromState } from './useAccountFlow'
import styles from './Account.module.css'

/** Design 29: ask for a reset link. It always continues to "Check your email", whether or not that address has an
 *  account, so the screen cannot be used to find out who is registered. */
export function ForgotPasswordPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [email, setEmail] = useState(useEmailFromState())
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function submit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    if (!isEmail(email)) return setError(t('acc_err_email'))
    setBusy(true)
    const res = await requestPasswordReset(email)
    setBusy(false)
    if (!res.ok && res.error !== 'invalid') return setError(t(errorKey(res.error)))
    navigate('/check-email', { state: { email: email.trim() } })
  }

  return (
    <AccountScreen
      mascot="think"
      bubble={t('acc_forgot_hi')}
      title={t('acc_forgot_title')}
      sub={t('acc_forgot_sub')}
      footer={
        <>
          <Button type="submit" form="forgot-form" disabled={busy}>
            {t('acc_send_link')}
          </Button>
          <p className={styles.alt}>
            {t('acc_remembered')}{' '}
            <Link className={styles.link} to="/login" replace>
              {t('acc_back_login')}
            </Link>
          </p>
        </>
      }
    >
      <form id="forgot-form" className={styles.form} onSubmit={submit} noValidate>
        <TextField
          label={t('acc_email')}
          icon="mail"
          type="email"
          autoComplete="email"
          inputMode="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          state={error ? 'error' : 'idle'}
          message={error ?? undefined}
        />
      </form>
    </AccountScreen>
  )
}
