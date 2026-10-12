import { useNavigate, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { LogoMark } from '../../components/Logo'
import { formatNumber } from '../../i18n'
import { Card, Icon, ProgressBar, type IconName } from '../../components/ui'
import { ENABLED_COURSE_IDS, getCourse } from '../../content/courses'
import { useLocalized } from '../../content/useLocalized'
import { currentStreak, localDay } from '../../domain/progress'
import { useProgress } from '../../state/useProgress'
import { WeekBars } from '../../components/WeekStrip'
import { updateProfile, useProfile } from '../../state/profile'
import { useTrail, useTrailId } from '../../state/useTrail'
import styles from './MePage.module.css'


/** Design 13: streak, XP and lessons, this week's bars, trails with progress, and milestones. */
export function MePage() {
  const { t } = useTranslation()
  const tc = useLocalized()
  const { progress } = useProgress()
  const { minutes } = useProfile()
  const active = useTrailId()
  const streak = currentStreak(progress.streak, localDay())
  const { course } = useTrail(active)

  const stats: { icon: IconName; value: string; label: string }[] = [
    { icon: 'flag', value: String(streak), label: t('dayStreak') },
    { icon: 'gem', value: formatNumber(progress.xp), label: t('totalXpShort') },
    { icon: 'check', value: String(progress.lessonsDone.length), label: t('lessonsDoneShort') },
  ]
  const milestones: { icon: IconName; label: string; got: boolean }[] = [
    { icon: 'flag', label: t('msFirst'), got: progress.lessonsDone.length >= 1 },
    { icon: 'star', label: t('msStreak', { n: 7 }), got: streak >= 7 },
    { icon: 'gem', label: t('msXp', { n: formatNumber(1000) }), got: progress.xp >= 1000 },
  ]

  return (
    <div className={styles.page}>
      <header className={styles.head}>
        <span className={styles.avatar} aria-hidden>
          <LogoMark size={64} />
        </span>
        <div className={styles.who}>
          <h1>{t('meName')}</h1>
          <p>{t('walkingTrail', { trail: tc(course.title) })}</p>
        </div>
        <Link to="/settings" className={styles.gear} aria-label={t('settings')}>
          <Icon name="sliders" size={24} />
        </Link>
      </header>

      <div className={styles.stats}>
        {stats.map((s) => (
          <Card key={s.label} className={styles.stat}>
            <Icon name={s.icon} size={22} />
            <strong>{s.value}</strong>
            <span>{s.label}</span>
          </Card>
        ))}
      </div>

      <Card className={styles.week}>
        <p className={styles.weekHead}>
          <strong>{t('thisWeekTitle')}</strong>
          <span>{t('goalMinDay', { n: minutes })}</span>
        </p>
        <WeekBars activity={progress.activity} />
      </Card>

      <h2 className={styles.kicker}>{t('yourTrails')}</h2>
      <div className={styles.trails}>
        {ENABLED_COURSE_IDS.map((id) => (
          <TrailRow key={id} id={id} active={id === active} />
        ))}
      </div>

      <h2 className={styles.kicker}>{t('milestones')}</h2>
      <div className={styles.miles}>
        {milestones.map((m) => (
          <div key={m.label} className={styles.mile}>
            <span className={m.got ? styles.milOn : styles.milOff}>
              <Icon name={m.got ? m.icon : 'lock'} size={28} />
            </span>
            <small>{m.label}</small>
          </div>
        ))}
      </div>
    </div>
  )
}

function TrailRow({ id, active }: { id: string; active: boolean }) {
  const { t } = useTranslation()
  const tc = useLocalized()
  const navigate = useNavigate()
  const course = getCourse(id)
  const { totalLessons, doneLessons } = useTrail(id)
  if (!course) return null
  const pct = totalLessons ? Math.round((doneLessons / totalLessons) * 100) : 0
  const started = doneLessons > 0 || active
  return (
    <button
      type="button"
      className={`${styles.trail} ${active ? styles.trailOn : ''} ${started ? '' : styles.trailOff}`}
      onClick={() => {
        updateProfile({ trail: id })
        navigate('/')
      }}
    >
      <span className={styles.trailRow}>
        <strong>{tc(course.title)}</strong>
        <span>{started ? `${pct}%` : t('notStarted')}</span>
      </span>
      {started && <ProgressBar value={doneLessons} max={Math.max(1, totalLessons)} label={tc(course.title)} />}
    </button>
  )
}
