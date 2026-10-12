import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { currentStreak, localDay } from '../domain/progress'
import { useProgress } from '../state/useProgress'
import styles from './TopBar.module.css'

/** Streak, XP and a link to Settings (language and sound live there). */
export function TopBar() {
  const { t } = useTranslation()
  const { progress } = useProgress()
  const streak = currentStreak(progress.streak, localDay())

  return (
    <div className={styles.langbar}>
      <span className={styles.stats}>
        <span className={streak > 0 ? styles.streakOn : undefined} title={t('streakDays', { count: streak })}>
          🔥 {streak}
        </span>
        <span title={t('totalXp', { xp: progress.xp })}>⚡ {progress.xp}</span>
      </span>
      <Link to="/settings" className={styles.settingsLink} aria-label={t('settings')} title={t('settings')}>
        ⚙️
      </Link>
    </div>
  )
}
