import { useTranslation } from 'react-i18next'
import { formatMoney } from '../i18n'
import { Money } from './Money'
import { Coin } from './ui/Coin'
import styles from './MoneyChip.module.css'

/** The bank balance as a pill with the coin: Home, and anywhere else the bank is shown in a row of chips. */
export function MoneyChip({ amount, className }: { amount: number; className?: string }) {
  const { t } = useTranslation()
  return (
    <span className={`${styles.chip} ${className ?? ''}`} title={t('bankTitleAttr', { n: formatMoney(amount) })}>
      <Coin size={22} />
      <Money amount={amount} />
    </span>
  )
}
