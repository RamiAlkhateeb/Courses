import { useTranslation } from 'react-i18next'
import { Button, BottomSheet, Icon, Rafiq } from '../../components/ui'
import { WeekDots } from '../../components/WeekStrip'
import { useProgress } from '../../state/useProgress'
import { daysBetween, localDay, weekStart } from '../../domain/progress'
import { updateProfile, useProfile } from '../../state/profile'
import styles from './RestDay.module.css'

const SEEN = 'restDayDismissed'
const seen = () => {
  try {
    return sessionStorage.getItem(SEEN) === localDay()
  } catch {
    return false
  }
}

/** Design 20: after exactly one missed day, offer the weekly rest day so the streak survives. Shows once a day. */
export function useRestDayOffer(): boolean {
  const { progress } = useProgress()
  const { restDayUsed } = useProfile()
  const today = localDay()
  const missedOne = progress.streak.count > 0 && daysBetween(progress.streak.lastDay, today) === 2
  const available = !restDayUsed || weekStart(restDayUsed) !== weekStart(today)
  return missedOne && available && !seen()
}

export function RestDay({ onClose }: { onClose: () => void }) {
  const { t } = useTranslation()
  const { progress, takeRestDay } = useProgress()
  const close = () => {
    try {
      sessionStorage.setItem(SEEN, localDay())
    } catch {
      // ignore
    }
    onClose()
  }
  return (
    <div className={styles.screen}>
      <div className={styles.top}>
        <Icon name="flag" size={48} className={styles.flag} />
        <strong className={styles.big}>{progress.streak.count}</strong>
        <p className={styles.caption}>{t('daysOnPathBig')}</p>
        <div className={styles.week}>
          <WeekDots activity={progress.activity} />
        </div>
      </div>
      <BottomSheet>
        <Rafiq pose="think" height={150} className={styles.rafiq} />
        <p className={styles.kicker}>{t('restAvailable')}</p>
        <h1 className={styles.title}>{t('missedYesterday')}</h1>
        <p className={styles.body}>{t('restBody', { n: progress.streak.count })}</p>
        <p className={styles.pill}>{t('restPill')}</p>
        <Button
          onClick={() => {
            takeRestDay()
            updateProfile({ restDayUsed: localDay() })
            close()
          }}
        >
          {t('useRestDay')}
        </Button>
        <Button variant="ghost" onClick={close}>
          {t('notNow')}
        </Button>
      </BottomSheet>
    </div>
  )
}
