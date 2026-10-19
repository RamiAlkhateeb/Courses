import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Money } from '../../components/Money'
import { Button, TextField } from '../../components/ui'
import { currentStreak, localDay } from '../../domain/progress'
import { DELETE_WORD, deleteConfirmed } from '../../domain/auth'
import { deleteAccount, useAuth } from '../../state/auth'
import { useProgress } from '../../state/useProgress'
import { useWallet } from '../../state/usePlayground'
import { AccountScreen } from './AccountScreen'
import { errorKey } from './useAccountFlow'
import styles from './Account.module.css'

/** Design 33: delete the account. Says what goes (the online copy of streak, lessons, play money and Playground
 *  history), and only enables the red button once DELETE is typed. This device keeps its own copy as guest progress. */
export function DeleteAccountPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const auth = useAuth()
  const { progress } = useProgress()
  const wallet = useWallet()
  const [typed, setTyped] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (auth.status === 'loading') return <AccountScreen title={t('loading')} />
  if (auth.status !== 'signedIn') return <Navigate to="/login" replace />

  const streak = currentStreak(progress.streak, localDay(), progress.freezes)

  async function remove() {
    setBusy(true)
    setError(null)
    const res = await deleteAccount()
    setBusy(false)
    if (!res.ok) return setError(t(errorKey(res.error)))
    navigate('/me', { replace: true })
  }

  return (
    <AccountScreen
      mascot="oops"
      bubble={t('acc_del_hi')}
      title={t('acc_del_title')}
      sub={t('acc_del_sub')}
      footer={
        <>
          <Button variant="oops" disabled={busy || !deleteConfirmed(typed)} onClick={remove}>
            {t('acc_del_forever')}
          </Button>
          <Button variant="secondary" onClick={() => navigate('/account', { replace: true })}>
            {t('acc_keep')}
          </Button>
        </>
      }
    >
      <p className={styles.lose}>
        <strong>{t('acc_del_lose')}</strong>
        {t('streakDays', { count: streak })} · {t('nLessons', { count: progress.lessonsDone.length })} · <Money amount={wallet} /> {t('playMoneyShort')} · {t('acc_del_history')}
      </p>
      <TextField
        label={t('acc_del_type', { word: DELETE_WORD })}
        icon="trash"
        autoComplete="off"
        autoCapitalize="characters"
        spellCheck={false}
        dir="ltr"
        value={typed}
        onChange={(e) => setTyped(e.target.value)}
        state={error ? 'error' : 'idle'}
        message={error ?? undefined}
      />
    </AccountScreen>
  )
}
