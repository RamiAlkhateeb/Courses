import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { Trans, useTranslation } from 'react-i18next'
import { Button, buttonClass, Icon } from '../../components/ui'
import { clock } from '../../domain/auth'
import { requestPasswordReset, resendConfirmation, useAuth, type AuthResult } from '../../state/auth'
import { AccountScreen } from './AccountScreen'
import { errorKey, useCountdown, useEmailFromState } from './useAccountFlow'
import styles from './Account.module.css'

/** Designs 26 and 30: "we sent you a link", shared by sign-up confirmation (`kind="confirm"`) and password reset
 *  (`kind="reset"`). Open the mail app, resend after a short wait, or move on. */
export function MailSentPage({ kind }: { kind: 'confirm' | 'reset' }) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const auth = useAuth()
  const email = useEmailFromState()
  const countdown = useCountdown()
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  if (!email) return <Navigate to={kind === 'confirm' ? '/signup' : '/forgot-password'} replace />
  if (auth.status === 'signedIn' && kind === 'confirm') return <Navigate to="/account" replace />

  async function resend() {
    setMessage(null)
    setError(null)
    const res: AuthResult = kind === 'confirm' ? await resendConfirmation(email) : await requestPasswordReset(email)
    if (!res.ok) return setError(t(errorKey(res.error)))
    setMessage(t('acc_resent'))
    countdown.restart()
  }

  const sub = kind === 'confirm' ? 'acc_confirm_sub' : 'acc_check_sub'
  return (
    <AccountScreen
      className={styles.mailPage}
      onBack={() => navigate(kind === 'confirm' ? '/signup' : '/forgot-password', { replace: true })}
      footer={
        <>
          <a className={buttonClass()} href={`mailto:${email}`}>
            {t('acc_open_mail')}
          </a>
          <Button variant="secondary" disabled={countdown.left > 0} onClick={resend}>
            {countdown.left > 0 ? t('acc_resend_in', { time: clock(countdown.left) }) : t('acc_resend')}
          </Button>
          {kind === 'confirm' ? (
            <button type="button" className={`${styles.link} ${styles.center}`} onClick={() => navigate('/', { replace: true })}>
              {t('acc_skip')}
            </button>
          ) : (
            <button type="button" className={`${styles.link} ${styles.center}`} onClick={() => navigate('/forgot-password', { replace: true })}>
              {t('acc_other_email')}
            </button>
          )}
        </>
      }
    >
      <span className={styles.mailHalo} aria-hidden>
        <span className={styles.mailDisc}>
          <Icon name="mail" size={52} strokeWidth={2.2} />
        </span>
      </span>
      <h1 className={styles.title}>{t(kind === 'confirm' ? 'acc_confirm_title' : 'acc_check_title')}</h1>
      <p className={styles.sub}>
        <Trans i18nKey={sub} values={{ email }} components={{ b: <strong dir="ltr" /> }} />
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

/** Design 26: Confirm your email. */
export const ConfirmEmailPage = () => <MailSentPage kind="confirm" />
/** Design 30: Check your email (after "Forgot password"). */
export const CheckEmailPage = () => <MailSentPage kind="reset" />
