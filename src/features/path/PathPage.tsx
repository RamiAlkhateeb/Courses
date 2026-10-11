import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { formatNumber } from '../../i18n'
import { BottomSheet, Button, Icon, OptionCard } from '../../components/ui'
import { courses } from '../../content/courses'
import { useLocalized } from '../../content/useLocalized'
import { currentStreak, localDay } from '../progress/store'
import { useProgress } from '../progress/useProgress'
import { updateProfile } from '../profile/store'
import { PathMap } from './PathMap'
import { RestDay, useRestDayOffer } from './RestDay'
import { hasContent, useTrail, useTrailId } from './useTrail'
import styles from './PathPage.module.css'

/** Home (designs 06, 14): trail switcher, streak and XP chips, the current camp's banner and the mountain path. */
export function PathPage() {
  const { t } = useTranslation()
  const tc = useLocalized()
  const trailId = useTrailId()
  const { course, current, loaded } = useTrail(trailId)
  const { progress } = useProgress()
  const navigate = useNavigate()
  const [switching, setSwitching] = useState(false)
  const offerRest = useRestDayOffer()
  const [restClosed, setRestClosed] = useState(false)
  const streak = currentStreak(progress.streak, localDay())

  return (
    <div className={styles.page}>
      <header className={styles.top}>
        <button type="button" className={styles.trailBtn} onClick={() => setSwitching(true)} aria-haspopup="dialog">
          <span className={styles.trailIcon}>
            <Icon name="trend" size={20} />
          </span>
          <span className={styles.trailName}>{tc(course.title)}</span>
          <Icon name="chevronDown" size={18} />
        </button>
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
          {loaded && current.week ? <PathMap chapter={current} /> : <p className={styles.loading}>{t('loading')}</p>}
        </>
      ) : (
        <p className={styles.loading}>{t('contentComing')}</p>
      )}

      {switching && (
        <div className={styles.scrim} onClick={() => setSwitching(false)}>
          <div onClick={(e) => e.stopPropagation()}>
            <BottomSheet>
              <h2 className={styles.sheetTitle}>{t('chooseTrail')}</h2>
              <div className={styles.trailList}>
                {courses.filter(hasContent).map((c) => (
                  <OptionCard
                    key={c.id}
                    state={c.id === trailId ? 'selected' : 'idle'}
                    onClick={() => {
                      updateProfile({ trail: c.id })
                      setSwitching(false)
                    }}
                  >
                    {tc(c.title)}
                  </OptionCard>
                ))}
              </div>
              <Button variant="secondary" onClick={() => navigate('/courses')}>
                {t('allTrails')}
              </Button>
            </BottomSheet>
          </div>
        </div>
      )}
      {offerRest && !restClosed && <RestDay onClose={() => setRestClosed(true)} />}
    </div>
  )
}
