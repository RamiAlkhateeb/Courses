import { Icon } from './ui'
import { Money } from './Money'
import { formatNumber } from '../i18n'
import styles from './Change.module.css'

/** A gain or a loss: always an arrow, the amount (or percent) with its sign, and a colour: never colour alone. */
export function Change({ amount, percent, label }: { amount?: number; percent?: number; label?: string }) {
  const value = amount ?? percent ?? 0
  const up = value >= 0
  return (
    <span className={`${styles.change} ${up ? styles.up : styles.down}`}>
      <Icon name={up ? 'arrowUp' : 'arrowDown'} size={16} />
      {amount !== undefined ? <Money amount={amount} sign /> : <bdi dir="ltr">{`${up ? '+' : '−'}${formatNumber(Math.abs(percent ?? 0), { decimals: 1 })}%`}</bdi>}
      {label && <span className={styles.label}>{label}</span>}
    </span>
  )
}
