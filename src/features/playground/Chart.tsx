import { useTranslation } from 'react-i18next'
import { formatMoney } from '../../i18n'
import styles from './Playground.module.css'

const W = 340
const H = 150
const PAD = 10

/** A line chart drawn as SVG, always left-to-right (time runs left to right in every language). `nominal` is solid
 *  ink, `real` (after inflation) dashed saffron-text. Text alternative: the label summarises what the lines show. */
export function Chart({
  nominal,
  real,
  start,
  label,
  markers = [],
  compareTone = 'saffron',
  compare,
}: {
  nominal: number[]
  real?: number[]
  /** The amount the season started with, drawn as a faint baseline */
  start?: number
  label: string
  /** Positions (index into `nominal`) of news events, drawn as small ticks */
  markers?: number[]
  /** The second line's colour: saffron text for "after inflation", green for "buy once and hold" */
  compareTone?: 'saffron' | 'green'
  /** A dotted "what if it was all in one asset" line (the label describes it) */
  compare?: number[]
}) {
  const { t } = useTranslation()
  const all = [...nominal, ...(real ?? []), ...(compare ?? []), ...(start === undefined ? [] : [start])]
  const lo = Math.min(...all)
  const hi = Math.max(...all)
  const span = hi - lo || 1
  const n = Math.max(nominal.length - 1, 1)
  const x = (i: number) => PAD + (i / n) * (W - 2 * PAD)
  const y = (v: number) => H - PAD - ((v - lo) / span) * (H - 2 * PAD)
  const line = (xs: number[]) => xs.map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(' ')
  const lastX = x(nominal.length - 1)
  const lastY = y(nominal[nominal.length - 1])
  const worst = nominal.indexOf(Math.min(...nominal))
  const gridLines = [0.2, 0.5, 0.8]

  return (
    <div className={styles.chart} dir="ltr">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={label} preserveAspectRatio="none">
        <title>{label}</title>
        {gridLines.map((g) => (
          <line key={g} x1={PAD} x2={W - PAD} y1={H * g} y2={H * g} className={styles.grid} />
        ))}
        {start !== undefined && <line x1={PAD} x2={W - PAD} y1={y(start)} y2={y(start)} className={styles.base} />}
        {nominal.length > 1 && <path d={`${line(nominal)} L${lastX} ${H - PAD} L${PAD} ${H - PAD} Z`} className={styles.area} />}
        {markers.map((m) => (
          <line key={m} x1={x(m)} x2={x(m)} y1={PAD} y2={H - PAD} className={styles.marker} />
        ))}
        {real && real.length > 1 && <path d={line(real)} className={`${styles.realLine} ${compareTone === 'green' ? styles.realGreen : ''}`} />}
        {compare && compare.length > 1 && <path d={line(compare)} className={styles.compareLine} />}
        {nominal.length > 1 && <path d={line(nominal)} className={styles.nominalLine} />}
        {worst > 0 && worst < nominal.length - 1 && nominal[worst] < Math.max(...nominal) * 0.97 && <circle cx={x(worst)} cy={y(nominal[worst])} r="4.5" className={styles.low} />}
        {nominal.length > 0 && <circle cx={lastX} cy={lastY} r="5" className={styles.now} />}
      </svg>
      <span className="visually-hidden">{t('pg_chart_range', { low: formatMoney(lo), high: formatMoney(hi) })}</span>
    </div>
  )
}
