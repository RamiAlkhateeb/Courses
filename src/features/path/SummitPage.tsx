import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Button, Icon, Rafiq } from '../../components/ui'
import { useLocalized } from '../../content/useLocalized'
import { learnHref } from '../lesson/lessons'
import { useTrail, useTrailId } from './useTrail'
import styles from './SummitPage.module.css'

/** Design 17: the whole trail as one mountain with numbered camps, and the camp list under it. */
export function SummitPage() {
  const { t } = useTranslation()
  const tc = useLocalized()
  const navigate = useNavigate()
  const { course, chapters, next, current } = useTrail(useTrailId())
  const n = chapters.length
  // Camps zig-zag up the mountain: camp k of n sits at height k/(n-1) of the climb.
  const spots = chapters.map((_, k) => ({
    x: [40, 66, 38, 62, 30, 58][k % 6],
    y: 90 - (n > 1 ? (k / (n - 1)) * 62 : 0),
  }))

  return (
    <div className={styles.page}>
      <header className={styles.top}>
        <Link to="/" className={styles.back} aria-label={t('back')}>
          <Icon name="back" size={26} className={styles.mirror} />
        </Link>
        <h1>{t('summitView')}</h1>
        <span className={styles.pill}>{tc(course.title)}</span>
      </header>

      <div className={styles.peak}>
        <span className={styles.sun} aria-hidden />
        <div className={styles.mountain} aria-hidden />
        <svg className={styles.route} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
          <polyline points={spots.map((s) => `${s.x},${s.y}`).join(' ')} vectorEffect="non-scaling-stroke" />
        </svg>
        {spots.map((s, k) => (
          <span
            key={k}
            className={`${styles.camp} ${chapters[k].id === current?.id ? styles.campNow : ''}`}
            style={{ insetInlineStart: `${s.x}%`, insetBlockStart: `${s.y}%` }}
          >
            {k + 1}
          </span>
        ))}
        <Rafiq pose="point" height={96} className={styles.guide} />
      </div>

      <h2 className={styles.kicker}>{t('campsOnTrail')}</h2>
      <ul className={styles.list}>
        {chapters.map((c, k) => {
          const active = c.id === current?.id
          const finished = c.lessons.length > 0 && c.done === c.lessons.length
          const locked = !active && !finished && c.done === 0 && k > 0 && chapters[k - 1].done < chapters[k - 1].lessons.length
          return (
            <li key={c.id} className={`${styles.row} ${active ? styles.rowOn : ''} ${locked ? styles.rowLocked : ''}`}>
              <span className={`${styles.num} ${active ? styles.numOn : ''}`}>{k + 1}</span>
              <span className={styles.rowTitle}>{tc(c.title)}</span>
              {active ? (
                <span className={styles.progress}>{t('lessonsOfN', { d: c.done, n: c.lessons.length })}</span>
              ) : finished ? (
                <Icon name="check" size={20} />
              ) : (
                <Icon name="lock" size={20} />
              )}
            </li>
          )
        })}
      </ul>
      {next && (
        <div className={styles.foot}>
          <Button onClick={() => navigate(learnHref(course.id, next.mod.id, next.lesson.id))}>
            {t('continueCamp', { n: (current?.camp ?? 1) })}
          </Button>
        </div>
      )}
    </div>
  )
}
