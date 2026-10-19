import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { buttonClass, Guide, Icon } from '../../components/ui'
import styles from './LessonGate.module.css'

/** Shown instead of a lesson (or a unit review) a guest can't open yet: the first lessons are free, the rest need an account. */
export function LessonGate() {
  const { t } = useTranslation()
  return (
    <main className={styles.gate}>
      <Link to="/" className={styles.quit} aria-label={t('close')}>
        <Icon name="close" size={26} />
      </Link>
      <Guide pose="point" height={200} />
      <h1 className={styles.title}>{t('gate_title')}</h1>
      <p className={styles.body}>{t('gate_body')}</p>
      <div className={styles.actions}>
        <Link to="/signup" className={buttonClass({})}>
          {t('acc_create')}
        </Link>
        <Link to="/login" className={buttonClass({ variant: 'secondary' })}>
          {t('acc_sign_in')}
        </Link>
      </div>
    </main>
  )
}
