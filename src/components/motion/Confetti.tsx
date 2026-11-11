import styles from './Confetti.module.css'

const COLOURS = ['blue', 'sky', 'leaf', 'streak', 'gold', 'mint'] as const
const PIECES = 28

/** Flat confetti in the brand colours, falling once over the top of the screen. Decoration only: hidden from screen
 *  readers, never in the way of a tap, and not drawn at all when the reader prefers reduced motion (CSS). */
export function Confetti() {
  return (
    <div className={styles.confetti} aria-hidden>
      {Array.from({ length: PIECES }, (_, i) => {
        // Spread evenly with a little jitter, so it looks random but renders the same every time
        const left = ((i * 37) % 100) + ((i * 13) % 7) / 2
        const delay = (i % 7) * 90
        const duration = 1400 + ((i * 53) % 700)
        const turn = (i % 2 ? 1 : -1) * (180 + ((i * 29) % 360))
        return (
          <span
            key={i}
            className={`${styles.piece} ${styles[COLOURS[i % COLOURS.length]]} ${i % 3 === 0 ? styles.round : ''}`}
            style={{ insetInlineStart: `${left}%`, animationDelay: `${delay}ms`, animationDuration: `${duration}ms`, ['--turn' as string]: `${turn}deg` }}
          />
        )
      })}
    </div>
  )
}
