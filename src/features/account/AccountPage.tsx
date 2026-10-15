import { useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Button, TextField } from '../../components/ui'
import { ListGroup, ListRow, ListScreen, Sheet } from '../../components/SettingsList'
import { cleanName, isEmail } from '../../domain/auth'
import { updateEmail, updateName, useAuth, type AuthError } from '../../state/auth'
import { AccountScreen } from './AccountScreen'
import { errorKey } from './useAccountFlow'
import styles from './Account.module.css'

/** Design 32: the account, opened from Settings. Name, email and password, and Delete account. Name and email change
 *  in a bottom sheet. */
export function AccountPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const auth = useAuth()
  const [sheet, setSheet] = useState<'name' | 'email' | null>(null)

  if (auth.status === 'loading') return <AccountScreen title={t('loading')} onBack={() => navigate('/settings')} />
  if (auth.status !== 'signedIn' || !auth.user) return <Navigate to="/login" replace />
  const { user } = auth

  return (
    <ListScreen
      title={t('acc_title')}
      back="/settings"
      footer={
        <Link to="/account/delete" className={styles.danger}>
          {t('acc_delete')}
        </Link>
      }
    >
      <ListGroup title={t('acc_s_profile')}>
        <ListRow icon="user" label={t('acc_name')} value={user.name || '—'} onClick={() => setSheet('name')} />
        <ListRow icon="mail" label={t('acc_email')} value={user.email} ltr onClick={() => setSheet('email')} />
        <ListRow icon="lock" label={t('acc_password')} value={t('acc_change')} to="/new-password" state={{ from: 'account' }} />
      </ListGroup>

      {sheet === 'name' && <NameSheet initial={user.name} onClose={() => setSheet(null)} />}
      {sheet === 'email' && <EmailSheet initial={user.email} onClose={() => setSheet(null)} />}
    </ListScreen>
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
      <form className={styles.form} onSubmit={save} noValidate>
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
        <form className={styles.form} onSubmit={save} noValidate>
          <TextField label={t('acc_email')} icon="mail" type="email" autoComplete="email" inputMode="email" autoFocus value={email} onChange={(e) => setEmail(e.target.value)} state={error ? 'error' : 'idle'} message={error ? t(errorKey(error)) : undefined} />
          <Button type="submit" disabled={busy}>
            {t('acc_save')}
          </Button>
        </form>
      )}
    </Sheet>
  )
}
