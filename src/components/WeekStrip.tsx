import { useTranslation } from 'react-i18next'
import { localDay } from '../domain/progress'
import styles from './WeekStrip.module.css'

/** The last 7 local days ending today: `day` ('YYYY-MM-DD'), narrow weekday `label`, XP earned and whether it is today. */
export function lastSevenDays(activity: Record<string, number>, lang: string, now = new Date()) {
  const fmt = new Intl.DateTimeFormat(lang, { weekday: 'narrow' })
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - (6 - i))
    const day = localDay(d)
    return { day, label: fmt.format(d), xp: activity[day] ?? 0, today: i === 6 }
  })
}

/** Seven dots, navy for days with a lesson and saffron for today (designs 11, 20). */
export function WeekDots({ activity }: { activity: Record<string, number> }) {
  const { i18n } = useTranslation()
  return (
    <div className={styles.dots}>
      {lastSevenDays(activity, i18n.language).map((d) => (
        <div key={d.day} className={styles.col}>
          <span className={`${styles.dot} ${d.today ? styles.today : d.xp > 0 ? styles.on : ''}`} />
          <span className={d.today ? styles.labelToday : styles.label}>{d.label}</span>
        </div>
      ))}
    </div>
  )
}

/** Seven bars scaled to the week's best day (design 13); today's bar is saffron. */
export function WeekBars({ activity }: { activity: Record<string, number> }) {
  const { i18n } = useTranslation()
  const days = lastSevenDays(activity, i18n.language)
  const max = Math.max(1, ...days.map((d) => d.xp))
  return (
    <div className={styles.bars}>
      {days.map((d) => (
        <div key={d.day} className={styles.col}>
          <span
            className={`${styles.bar} ${d.today ? styles.today : ''}`}
            style={{ blockSize: `${Math.max(14, (d.xp / max) * 100)}px`, opacity: d.xp > 0 || d.today ? 1 : 0.25 }}
          />
          <span className={d.today ? styles.labelToday : styles.label}>{d.label}</span>
        </div>
      ))}
    </div>
  )
}
