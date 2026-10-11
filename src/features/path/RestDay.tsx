import { useTranslation } from 'react-i18next'
import { Button, BottomSheet, Rafiq } from '../../components/ui'
import { WeekDots } from '../progress/WeekStrip'
import { useProgress } from '../progress/useProgress'
import { daysBetween, localDay, weekStart } from '../progress/store'
import { updateProfile, useProfile } from '../profile/store'
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
        <span className={styles.flag} aria-hidden>
          ⚑
        </span>
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
