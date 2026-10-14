import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { Trans, useTranslation } from 'react-i18next'
import { Button, buttonClass, Icon } from '../../components/ui'
import { clock } from '../../domain/auth'
import { requestPasswordReset } from '../../state/auth'
import { AccountScreen } from './AccountScreen'
import { errorKey, useCountdown, useEmailFromState } from './useAccountFlow'
import styles from './Account.module.css'

/** Design 30: "Check your email" after asking for a password-reset link. Open the mail app, resend after a short wait,
 *  or use a different address. (Design 26, "Confirm your email" after sign-up, is not built: the project does not require
 *  email confirmation. If it is ever switched on, add that screen back from git history.) */
export function CheckEmailPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const email = useEmailFromState()
  const countdown = useCountdown()
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  if (!email) return <Navigate to="/forgot-password" replace />

  async function resend() {
    setMessage(null)
    setError(null)
    const res = await requestPasswordReset(email)
    if (!res.ok) return setError(t(errorKey(res.error)))
    setMessage(t('acc_resent'))
    countdown.restart()
  }

  return (
    <AccountScreen
      className={styles.mailPage}
      onBack={() => navigate('/forgot-password', { replace: true })}
      footer={
        <>
          <a className={buttonClass()} href={`mailto:${email}`}>
            {t('acc_open_mail')}
          </a>
          <Button variant="secondary" disabled={countdown.left > 0} onClick={resend}>
            {countdown.left > 0 ? t('acc_resend_in', { time: clock(countdown.left) }) : t('acc_resend')}
          </Button>
          <button type="button" className={`${styles.link} ${styles.center}`} onClick={() => navigate('/forgot-password', { replace: true })}>
            {t('acc_other_email')}
          </button>
        </>
      }
    >
      <span className={styles.mailHalo} aria-hidden>
        <span className={styles.mailDisc}>
          <Icon name="mail" size={52} strokeWidth={2.2} />
        </span>
      </span>
      <h1 className={styles.title}>{t('acc_check_title')}</h1>
      <p className={styles.sub}>
        <Trans i18nKey="acc_check_sub" values={{ email }} components={{ b: <strong dir="ltr" /> }} />
      </p>
      <p className={styles.small}>{t('acc_spam')}</p>
      {message && (
        <p className={styles.status} role="status">
          {message}
        </p>
      )}
      {error && (
        <p className={styles.fieldError} role="alert">
          {error}
        </p>
      )}
    </AccountScreen>
  )
}
