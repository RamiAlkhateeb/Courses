import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import type { ReactNode } from 'react'
import { LogoMark } from '../../components/Logo'
import { Money } from '../../components/Money'
import { Bush, Mound, Sprout, Tree } from '../../components/GardenArt'
import { Card, Coin, Flame, Icon, type IconName } from '../../components/ui'
import { useLocalized } from '../../content/useLocalized'
import { currentStreak, localDay } from '../../domain/progress'
import { useProgress } from '../../state/useProgress'
import { accountsEnabled } from '../../state/supabase'
import { useAuth } from '../../state/auth'
import { useSyncStatus } from '../../state/sync'
import { WeekBars } from '../../components/WeekStrip'
import { useProfile } from '../../state/profile'
import { useTrail, useTrailId } from '../../state/useTrail'
import styles from './MePage.module.css'

/** The garden grows with the share of the course learned: Seed → Sprout → Sapling → Tree. */
const STAGES = [
  { key: 'gardenSeed', from: 0, Art: Mound },
  { key: 'gardenSprout', from: 25, Art: Sprout },
  { key: 'gardenSapling', from: 50, Art: Bush },
  { key: 'gardenTree', from: 100, Art: Tree },
] as const

/** Me: streak, play money and lessons done, this week's bars, the garden, and milestones. */
export function MePage() {
  const { t } = useTranslation()
  const tc = useLocalized()
  const { progress } = useProgress()
  const { minutes } = useProfile()
  const streak = currentStreak(progress.streak, localDay())
  const { course, totalLessons, doneLessons } = useTrail(useTrailId())
  const auth = useAuth()
  const sync = useSyncStatus()

  const pct = totalLessons ? Math.round((doneLessons / totalLessons) * 100) : 0
  const stage = STAGES.reduce((at, s, i) => (pct >= s.from ? i : at), 0)

  const stats: { icon?: IconName | 'flame'; value: ReactNode; label: string }[] = [
    { icon: 'flame', value: String(streak), label: t('dayStreak') },
    { value: <Money amount={progress.bank} />, label: t('playMoneyShort') },
    { icon: 'check', value: String(progress.lessonsDone.length), label: t('lessonsDoneShort') },
  ]
  const milestones: { icon: IconName; label: string; got: boolean }[] = [
    { icon: 'flag', label: t('msFirstStep'), got: progress.lessonsDone.length >= 1 },
    { icon: 'gem', label: t('msWeek'), got: streak >= 7 },
    { icon: 'star', label: t('msAce'), got: progress.perfect >= 1 },
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

      {accountsEnabled && auth.status !== 'loading' && (
        <Link to="/account" className={styles.account}>
          <Icon name="me" size={22} />
          <span>
            <strong>{auth.status === 'signedIn' ? auth.user?.email : t('acc_me_sign_in')}</strong>
            <small>{auth.status === 'signedIn' ? t(`acc_sync_${sync === 'off' ? 'syncing' : sync}` as 'acc_sync_synced') : t('acc_me_sub')}</small>
          </span>
          <Icon name="chevron" size={20} className={styles.chev} />
        </Link>
      )}

      <div className={styles.stats}>
        {stats.map((s) => (
          <Card key={s.label} className={styles.stat}>
            {s.icon === 'flame' ? <Flame size={22} /> : s.icon ? <Icon name={s.icon} size={22} /> : <Coin size={22} />}
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

      <h2 className={styles.kicker}>{t('yourGarden')}</h2>
      <Card tone="mint" className={styles.garden}>
        <ol className={styles.stages}>
          {STAGES.map(({ key, Art }, i) => (
            <li key={key} className={i === stage ? styles.stageNow : i < stage ? styles.stageDone : styles.stageNext} aria-current={i === stage ? 'step' : undefined}>
              <span className={styles.plot}>
                <Art size={i === stage ? 56 : 40} />
              </span>
              <small>{t(key)}</small>
            </li>
          ))}
        </ol>
        <p className={styles.gardenNote}>{t('gardenOf', { pct })}</p>
      </Card>

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
