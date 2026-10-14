import { useId, useState, type InputHTMLAttributes } from 'react'
import { useTranslation } from 'react-i18next'
import { Icon, type IconName } from './Icon'
import styles from './TextField.module.css'

export type FieldState = 'idle' | 'valid' | 'error'

/** A labelled text input in the garden style: a leading icon, a blue focus ring, a green border when valid and a red one
 *  with a message when not. `type="password"` gets a show/hide eye. The message is always text with an icon, never colour alone. */
export function TextField({
  label,
  icon,
  state = 'idle',
  message,
  className,
  type = 'text',
  ...rest
}: {
  label: string
  icon: IconName
  state?: FieldState
  /** Shown under the field: the error when `state` is `error`, a confirmation when `valid` */
  message?: string
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & { type?: 'text' | 'email' | 'password' }) {
  const { t } = useTranslation()
  const id = useId()
  const [shown, setShown] = useState(false)
  const password = type === 'password'
  return (
    <div className={`${styles.field} ${className ?? ''}`}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      <div className={`${styles.box} ${state === 'valid' ? styles.valid : ''} ${state === 'error' ? styles.error : ''}`}>
        <Icon name={icon} size={22} className={styles.lead} />
        <input
          id={id}
          type={password && shown ? 'text' : type}
          aria-invalid={state === 'error' || undefined}
          aria-describedby={message ? `${id}-msg` : undefined}
          {...rest}
        />
        {password && (
          <button type="button" className={styles.eye} onClick={() => setShown((s) => !s)} aria-label={shown ? t('hidePassword') : t('showPassword')} aria-pressed={shown}>
            <Icon name={shown ? 'eyeOff' : 'eye'} size={22} />
          </button>
        )}
      </div>
      {message && (
        <p id={`${id}-msg`} className={`${styles.message} ${state === 'error' ? styles.messageError : ''} ${state === 'valid' ? styles.messageValid : ''}`} role={state === 'error' ? 'alert' : undefined}>
          {state === 'error' && <Icon name="alert" size={18} />}
          {state === 'valid' && <Icon name="check" size={18} />}
          <span>{message}</span>
        </p>
      )}
    </div>
  )
}

/** One rule of a checklist ("8+ characters"): a filled green check when met, an empty ring when not. */
export function CheckPill({ ok, children }: { ok: boolean; children: string }) {
  return (
    <li className={`${styles.pill} ${ok ? styles.pillOk : ''}`}>
      <span className={styles.pillDot} aria-hidden>
        {ok && <Icon name="check" size={14} strokeWidth={3} />}
      </span>
      <span>{children}</span>
      <span className={styles.sr}>{ok ? '✓' : '·'}</span>
    </li>
  )
}
