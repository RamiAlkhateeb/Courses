import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Guide, Icon, ProgressBar, type GuidePose } from '../../components/ui'
import styles from './Account.module.css'

/** The frame every account screen shares: a back button (optionally with a progress bar), an optional mascot with a
 *  speech bubble, the title and subtitle, the body, and a footer of actions pinned to the bottom. */
export function AccountScreen({
  title,
  sub,
  mascot,
  bubble,
  progress,
  onBack,
  footer,
  className,
  children,
}: {
  title?: string
  sub?: ReactNode
  mascot?: GuidePose
  bubble?: string
  /** A 0..1 share shown as a bar next to the back button (sign up) */
  progress?: number
  /** Where Back goes; default: the previous screen */
  onBack?: () => void
  footer?: ReactNode
  className?: string
  children?: ReactNode
}) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  return (
    <div className={`${styles.page} ${className ?? ''}`}>
      <header className={styles.top}>
        <button type="button" className={styles.back} onClick={onBack ?? (() => navigate(-1))} aria-label={t('back')}>
          <Icon name="back" size={26} />
        </button>
        {progress !== undefined && (
          <div>
            <ProgressBar value={progress} max={1} label={title} />
          </div>
        )}
      </header>
      {mascot && (
        <div className={styles.guide}>
          <Guide pose={mascot} height={150} />
          {bubble && <p className={styles.bubble}>{bubble}</p>}
        </div>
      )}
      {title && <h1 className={styles.title}>{title}</h1>}
      {sub && <p className={styles.sub}>{sub}</p>}
      {children}
      {footer && <footer className={styles.footer}>{footer}</footer>}
    </div>
  )
}
