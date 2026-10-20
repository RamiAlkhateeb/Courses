import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { finishTour } from '../../state/tour'
import { Button, Guide } from '../ui'
import styles from './Playground.module.css'

const TIPS = ['tour_1', 'tour_2', 'tour_3'] as const

/** Three short tips the first time someone meets the simulator: net worth, Buy or sell, and time that keeps running. */
export function Tour() {
  const { t } = useTranslation()
  const [i, setI] = useState(0)
  const last = i === TIPS.length - 1
  return (
    <section className={styles.tour} aria-labelledby="tour-tip" aria-live="polite">
      <Guide pose="point" height={84} className={styles.tourGuide} />
      <div className={styles.tourText}>
        <small>{t('tour_step', { n: i + 1, total: TIPS.length })}</small>
        <p id="tour-tip">{t(TIPS[i])}</p>
        <div className={styles.tourActions}>
          <Button size="sm" onClick={() => (last ? finishTour() : setI(i + 1))}>
            {last ? t('tour_done') : t('tour_next')}
          </Button>
          {!last && (
            <Button size="sm" variant="ghost" onClick={finishTour}>
              {t('tour_skip')}
            </Button>
          )}
        </div>
      </div>
    </section>
  )
}
