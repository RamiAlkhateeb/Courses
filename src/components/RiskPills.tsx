import styles from './RiskPills.module.css'

/** Five pills, `level` of them filled saffron: the 1–5 risk of an asset or of the whole portfolio. */
export function RiskPills({ level }: { level: number }) {
  return (
    <span className={styles.pills} aria-hidden>
      {[1, 2, 3, 4, 5].map((n) => (
        <i key={n} className={n <= level ? styles.on : ''} />
      ))}
    </span>
  )
}
