import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { MoneyChip } from '../../components/MoneyChip'
import { Icon } from '../../components/ui'
import { Change } from '../../components/Change'
import { gain } from '../../domain/playground/engine'
import { playgroundStore } from '../../state/playground'
import { useStore } from '../../state/useStore'
import { useLocalized } from '../../content/useLocalized'
import { currentStreak, localDay } from '../../domain/progress'
import { useProgress } from '../../state/useProgress'
import { PathMap } from './PathMap'
import { useTrail, useTrailId } from '../../state/useTrail'
import styles from './PathPage.module.css'

/** Home (designs 06, 14): the trail, streak and bank chips, the current camp's banner and the mountain path. */
export function PathPage() {
  const { t } = useTranslation()
  const tc = useLocalized()
  const trailId = useTrailId()
  const { course, current, loaded } = useTrail(trailId)
  const { progress } = useProgress()
  const streak = currentStreak(progress.streak, localDay())
  const playground = useStore(playgroundStore)

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
          <MoneyChip amount={progress.bank} />
        </span>
      </header>

      {current ? (
        <>
          <section className={styles.banner}>
            <div>
              <p className={styles.bannerKicker}>{t('unitCamp', { u: current.unit, c: current.camp })}</p>
              <h1 className={styles.bannerTitle}>{tc(current.title)}</h1>
            </div>
          </section>
          {playground.funded > 0 && (
            <div className={styles.pgRow}>
              <Link to="/playground" className={styles.pgChip}>
                <Icon name="chart" size={20} /> {t('tabPlayground')} <Change amount={gain(playground)} />
              </Link>
            </div>
          )}
          {loaded && current.mod ? <PathMap chapter={current} /> : <p className={styles.loading}>{t('loading')}</p>}
        </>
      ) : (
        <p className={styles.loading}>{t('contentComing')}</p>
      )}

    </div>
  )
}
