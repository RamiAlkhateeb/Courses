import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { currentStreak, localDay } from '../domain/progress'
import { useProgress } from '../state/useProgress'
import { useWallet } from '../state/usePlayground'
import { MoneyChip } from './MoneyChip'
import styles from './TopBar.module.css'

/** Streak, bank and a link to Settings (language and sound live there). */
export function TopBar() {
  const { t } = useTranslation()
  const { progress } = useProgress()
  const wallet = useWallet()
  const streak = currentStreak(progress.streak, localDay(), progress.freezes)

  return (
    <div className={styles.langbar}>
      <span className={styles.stats}>
        <span className={streak > 0 ? styles.streakOn : undefined} title={t('streakDays', { count: streak })}>
          🔥 {streak}
        </span>
        <MoneyChip amount={wallet} />
      </span>
      <Link to="/settings" className={styles.settingsLink} aria-label={t('settings')} title={t('settings')}>
        ⚙️
      </Link>
    </div>
  )
}
