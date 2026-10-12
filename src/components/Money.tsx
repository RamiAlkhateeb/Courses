import { formatMoney } from '../i18n'

/** A play-money amount: `$1,240`, or with `sign` `+$486` / `−$486`. Always left-to-right with Western digits, even
 *  inside Arabic text (a `<bdi>` keeps the sign and the `$` from jumping around). */
export function Money({ amount, sign, decimals }: { amount: number; sign?: boolean; decimals?: number }) {
  return <bdi dir="ltr">{formatMoney(amount, { sign, decimals })}</bdi>
}
