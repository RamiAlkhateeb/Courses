import { useTranslation } from 'react-i18next'

/** A play-money amount: `$1,240`, or with `sign` `+$486` / `−$486`. Always left-to-right with Western digits, even
 *  inside Arabic text (a `<bdi>` keeps the sign and the `$` from jumping around). */
export function Money({ amount, sign, decimals = 0 }: { amount: number; sign?: boolean; decimals?: number }) {
  const { i18n } = useTranslation()
  const abs = new Intl.NumberFormat(i18n.language === 'ar' ? 'ar-u-nu-latn' : i18n.language, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(Math.abs(amount))
  const prefix = amount < 0 ? '−' : sign ? '+' : ''
  return <bdi dir="ltr">{`${prefix}$${abs}`}</bdi>
}

