import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import type { ReactNode } from 'react'
import { Logo } from '../../components/Logo'
import { CourseSwitcher } from '../../components/CourseSwitcher'
import { Money } from '../../components/Money'
import { Bush, Mound, Sprout, Tree } from '../../components/GardenArt'
import { Card, Coin, Icon, buttonClass, type IconName } from '../../components/ui'
import { useLocalized } from '../../content/useLocalized'
import { currentStreak, localDay, weekSummary } from '../../domain/progress'
import { Change } from '../../components/Change'
import { netWorth } from '../../domain/playground/engine'
import { netWorthWeekAgo } from '../../domain/playground/recap'
import { playgroundStore } from '../../state/playground'
import { useStore } from '../../state/useStore'
import { useProgress } from '../../state/useProgress'
import { useWallet } from '../../state/usePlayground'
import { accountsEnabled } from '../../state/supabase'
import { useAuth } from '../../state/auth'
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
  const wallet = useWallet()
  const { minutes } = useProfile()
  const streak = currentStreak(progress.streak, localDay(), progress.freezes)
  const { course, totalLessons, doneLessons } = useTrail(useTrailId())
  const auth = useAuth()
  const guest = accountsEnabled && auth.status === 'signedOut'
  const signedIn = accountsEnabled && auth.status === 'signedIn' ? auth.user : null

  // The weekly recap: days learned and play money earned in the last 7 days, and how the portfolio moved
  const week = weekSummary(progress.activity, localDay())
  const pg = useStore(playgroundStore)
  const pgWeekAgo = netWorthWeekAgo(pg)
  const pgMove = pgWeekAgo === null ? null : netWorth(pg) - pgWeekAgo
  const pct = totalLessons ? Math.round((doneLessons / totalLessons) * 100) : 0
  const stage = STAGES.reduce((at, s, i) => (pct >= s.from ? i : at), 0)

  const stats: { icon?: IconName; value: ReactNode; label: string }[] = [
    { icon: 'flame', value: String(streak), label: t('dayStreak') },
    { value: <Money amount={wallet} />, label: t('playMoneyShort') },
    { icon: 'check', value: String(progress.lessonsDone.length), label: t('lessonsDoneShort') },
  ]
  const milestones: { icon: IconName; label: string; got: boolean }[] = [
    { icon: 'sprout', label: t('msFirstStep'), got: progress.lessonsDone.length >= 1 },
    { icon: 'flame', label: t('msWeek'), got: streak >= 7 },
    { icon: 'star', label: t('msAce'), got: progress.perfect >= 1 },
  ]

  return (
    <div className={styles.page}>
      <header className={styles.head}>
        <span className={styles.avatar} aria-hidden>
          <Logo size={64} />
        </span>
        <div className={styles.who}>
          <h1>{signedIn ? signedIn.name || signedIn.email : guest ? t('me_guest') : t('meName')}</h1>
          <p>{guest ? t('me_guest_sub') : t('walkingTrail', { trail: tc(course.title) })}</p>
        </div>
        <Link to="/settings" className={styles.gear} aria-label={t('settings')}>
          <Icon name="gear" size={24} />
        </Link>
      </header>
      <CourseSwitcher className={styles.switcher} />

      <div className={styles.stats}>
        {stats.map((s) => (
          <Card key={s.label} className={styles.stat}>
            {s.icon ? <Icon name={s.icon} size={22} className={s.icon === 'flame' ? styles.flame : undefined} /> : <Coin size={22} />}
            <strong>{s.value}</strong>
            <span>{s.label}</span>
          </Card>
        ))}
      </div>

      {progress.freezes > 0 && (
        <p className={styles.freeze}>
          <Icon name="shield" size={20} /> {t('freeze_have', { count: progress.freezes })}
        </p>
      )}

      {guest && (
        <Card tone="indigo" className={styles.save}>
          <h2>{t('me_save_title')}</h2>
          <p>{t('me_save_sub')}</p>
          <div className={styles.saveActions}>
            <Link to="/signup" className={buttonClass({ variant: 'white' })}>
              {t('me_create_profile')}
            </Link>
            <Link to="/login" className={buttonClass({ variant: 'onIndigo' })}>
              {t('acc_sign_in')}
            </Link>
          </div>
        </Card>
      )}

      <Card className={styles.week}>
        <p className={styles.weekHead}>
          <strong>{t('thisWeekTitle')}</strong>
          <span>{t('goalMinDay', { n: minutes })}</span>
        </p>
        <WeekBars activity={progress.activity} />
        <ul className={styles.recap} aria-label={t('recap_label')}>
          <li>
            <strong>{week.days}</strong> {t('recap_days', { count: week.days })}
          </li>
          <li>
            <strong>
              <Money amount={week.earned} sign={week.earned > 0} />
            </strong>{' '}
            {t('recap_earned')}
          </li>
          {pgMove !== null && (
            <li>
              <Change amount={pgMove} /> {t('recap_portfolio')}
            </li>
          )}
        </ul>
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
      <ul className={styles.miles}>
        {milestones.map((m) => (
          <li key={m.label} className={m.got ? styles.mile : `${styles.mile} ${styles.mileLocked}`}>
            <Icon name={m.got ? m.icon : 'lock'} size={22} />
            <span>{m.label}</span>
            {!m.got && <span className="visually-hidden">{t('nodeLocked')}</span>}
          </li>
        ))}
      </ul>
    </div>
  )
}
