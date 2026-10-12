import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { formatNumber } from '../../i18n'
import { Icon } from '../../components/ui'
import { useLocalized } from '../../content/useLocalized'
import { currentStreak, localDay } from '../../domain/progress'
import { useProgress } from '../../state/useProgress'
import { PathMap } from './PathMap'
import { RestDay, useRestDayOffer } from './RestDay'
import { useTrail, useTrailId } from '../../state/useTrail'
import styles from './PathPage.module.css'

/** Home (designs 06, 14): the trail, streak and XP chips, the current camp's banner and the mountain path. */
export function PathPage() {
  const { t } = useTranslation()
  const tc = useLocalized()
  const trailId = useTrailId()
  const { course, current, loaded } = useTrail(trailId)
  const { progress } = useProgress()
  const offerRest = useRestDayOffer()
  const [restClosed, setRestClosed] = useState(false)
  const streak = currentStreak(progress.streak, localDay())

  return (
    <div className={styles.page}>
      <header className={styles.top}>
        <span className={styles.trailBtn}>
          <span className={styles.trailIcon}>
            <Icon name="trend" size={20} />
          </span>
          <span className={styles.trailName}>{tc(course.title)}</span>
        </span>
        <span className={styles.chips}>
          <span className={styles.chip} title={t('streakDays', { count: streak })}>
            <Icon name="flag" size={20} /> {streak}
          </span>
          <span className={styles.chip} title={t('totalXp', { xp: progress.xp })}>
            <Icon name="gem" size={20} /> {formatNumber(progress.xp)}
          </span>
        </span>
      </header>

      {current ? (
        <>
          <section className={styles.banner}>
            <div>
              <p className={styles.bannerKicker}>{t('unitCamp', { u: current.unit, c: current.camp })}</p>
              <h1 className={styles.bannerTitle}>{tc(current.title)}</h1>
            </div>
            <Link to="/summit" className={styles.summitBtn} aria-label={t('summitView')}>
              <Icon name="mountain" size={26} />
            </Link>
          </section>
          {loaded && current.mod ? <PathMap chapter={current} /> : <p className={styles.loading}>{t('loading')}</p>}
        </>
      ) : (
        <p className={styles.loading}>{t('contentComing')}</p>
      )}

      {offerRest && !restClosed && <RestDay onClose={() => setRestClosed(true)} />}
    </div>
  )
}
