import { useTranslation } from 'react-i18next'
import { formatMoney, numberLocale } from '../i18n'
import { Money } from './Money'
import { Coin } from './ui/Coin'
import { StatPill } from './ui'

/** The play-money balance as a pill with the coin: Learn, and anywhere else the wallet is shown in a row of chips. */
export function MoneyChip({ amount, className, compact }: { amount: number; className?: string; compact?: boolean }) {
  const { t, i18n } = useTranslation()
  // Compact: $12.3K above $9,999 so the pill stays small (the full amount is in the title and for screen readers)
  const short = compact && amount >= 10_000
  return (
    <StatPill className={className} compact={compact} title={t('bankTitleAttr', { n: formatMoney(amount) })}>
      <Coin size={compact ? 18 : 20} />
      {short ? (
        <>
          <bdi dir="ltr" aria-hidden>
            ${new Intl.NumberFormat(numberLocale(i18n.language), { notation: 'compact', maximumFractionDigits: 1 }).format(amount)}
          </bdi>
          <span className="visually-hidden">{formatMoney(amount)}</span>
        </>
      ) : (
        <Money amount={amount} />
      )}
    </StatPill>
  )
}
