import { useId, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { futureValue } from '../../domain/compound'
import { formatNumber } from '../../i18n'
import { Icon } from '../ui'
import styles from './content.module.css'

const START = 1000

/** "Try it": two sliders (yearly return, years) and what 1,000 grows to. Numbers are illustrations, never advice. */
export function CompoundCalculator() {
  const { t } = useTranslation()
  const id = useId()
  const [rate, setRate] = useState(7)
  const [years, setYears] = useState(20)
  const result = futureValue(START, rate, years)
  const num = (n: number, decimals?: number) => <bdi dir="ltr">{formatNumber(n, decimals === undefined ? {} : { decimals })}</bdi>

  return (
    <div className={styles.calc}>
      <p className={styles.calcHead}>
        <Icon name="calc" size={20} /> {t('calc_title')}
      </p>
      <p className={styles.calcSub}>{t('calc_sub')}</p>
      <label className={styles.calcRow} htmlFor={`${id}-rate`}>
        <span>{t('calc_rate')}</span>
        <output htmlFor={`${id}-rate`}>{num(rate, 1)}%</output>
      </label>
      <input id={`${id}-rate`} type="range" min={0} max={12} step={0.5} value={rate} onChange={(e) => setRate(Number(e.target.value))} />
      <label className={styles.calcRow} htmlFor={`${id}-years`}>
        <span>{t('calc_years')}</span>
        <output htmlFor={`${id}-years`}>{num(years)}</output>
      </label>
      <input id={`${id}-years`} type="range" min={1} max={40} step={1} value={years} onChange={(e) => setYears(Number(e.target.value))} />
      <div className={styles.calcResult} aria-live="polite">
        <span>{t('calc_result')}</span>
        <strong>{num(result)}</strong>
        <small>{t('calc_growth', { growth: formatNumber(result - START) })}</small>
      </div>
      <p className={styles.calcNote}>{t('calc_note')}</p>
    </div>
  )
}
