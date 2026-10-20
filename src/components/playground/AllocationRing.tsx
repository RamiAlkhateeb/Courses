import { allocation } from '../../domain/playground/risk'
import type { PlaygroundState } from '../../domain/playground/engine'
import { ASSET_DOT } from './shared'
import styles from './Playground.module.css'

const R = 42
const STROKE = 16
const C = 2 * Math.PI * R

/** A small flat ring of each holding's share of net worth (cash included), at the head of "What you own". Decorative:
 *  the list beside it says the same in words and numbers. */
export function AllocationRing({ state, size = 56 }: { state: PlaygroundState; size?: number }) {
  const a = allocation(state)
  const parts = [...a.assets.map((x) => ({ key: x.id, share: x.share })), ...(a.cash.value > 0 ? [{ key: 'cash' as const, share: a.cash.share }] : [])]
  if (parts.length === 0) return null
  let offset = 0
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={styles.ring} aria-hidden>
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
  )
}
