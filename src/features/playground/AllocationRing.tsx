import { useTranslation } from 'react-i18next'
import { Money } from '../../components/Money'
import { Button } from '../../components/ui'
import { allocation } from '../../domain/playground/risk'
import type { PlaygroundState } from '../../domain/playground/engine'
import { assetName, ASSET_DOT } from './shared'
import styles from './Playground.module.css'

const R = 42
const STROKE = 16
const C = 2 * Math.PI * R

/** Where the money is: a flat ring of each holding's share of net worth (cash included), and the same as a list (the
 *  list is the text alternative, so the ring itself is hidden from screen readers). */
export function AllocationRing({ state, onRebalance }: { state: PlaygroundState; onRebalance?: () => void }) {
  const { t } = useTranslation()
  const a = allocation(state)
  const parts = [...a.assets.map((x) => ({ key: x.id, name: assetName(t, x.id, true), value: x.value, share: x.share })), ...(a.cash.value > 0 ? [{ key: 'cash' as const, name: t('pg_cash'), value: a.cash.value, share: a.cash.share }] : [])]
  if (parts.length === 0) return null
  let offset = 0
  return (
    <section className={styles.ringCard} aria-labelledby="alloc-title">
      <div className={styles.ringHead}>
        <h2 id="alloc-title" className={styles.kicker}>
          {t('pg_allocation')}
        </h2>
        {onRebalance && (
          <Button variant="secondary" size="sm" onClick={onRebalance}>
            {t('pg_rebalance')}
          </Button>
        )}
      </div>
      <div className={styles.ringRow}>
        <svg viewBox="0 0 100 100" className={styles.ring} aria-hidden>
          <circle cx="50" cy="50" r={R} className={styles.ringTrack} strokeWidth={STROKE} />
          {parts.map((p) => {
            const len = p.share * C
            const seg = (
              <circle
                key={p.key}
                cx="50"
                cy="50"
                r={R}
                fill="none"
                stroke={ASSET_DOT[p.key]}
                strokeWidth={STROKE}
                strokeDasharray={`${len} ${C - len}`}
                strokeDashoffset={-offset}
                transform="rotate(-90 50 50)"
              />
            )
            offset += len
            return seg
          })}
        </svg>
        <ul className={styles.ringList}>
          {parts.map((p) => (
            <li key={p.key}>
              <span className={styles.dot} style={{ background: ASSET_DOT[p.key] }} />
              <span className={styles.ringName}>{p.name}</span>
              <strong>{Math.round(p.share * 100)}%</strong>
              <span className="visually-hidden">
                <Money amount={p.value} />
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
