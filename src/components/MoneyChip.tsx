import { useTranslation } from 'react-i18next'
import { formatMoney } from '../i18n'
import { Money } from './Money'
import { Coin } from './ui/Coin'
import { StatPill } from './ui'

/** The play-money balance as a pill with the coin: Learn, and anywhere else the wallet is shown in a row of chips. */
export function MoneyChip({ amount, className }: { amount: number; className?: string }) {
  const { t } = useTranslation()
  return (
    <StatPill className={className} title={t('bankTitleAttr', { n: formatMoney(amount) })}>
      <Coin size={20} />
      <Money amount={amount} />
    </StatPill>
  )
}
