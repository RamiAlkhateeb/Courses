/** The play-money coin: a sky disc with an indigo rim and a dollar stroke. Drawn with the design tokens as colours. */
export function Coin({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden focusable="false">
      <circle cx="12" cy="12" r="9" fill="var(--sky)" stroke="var(--indigo)" strokeWidth="1.6" />
      <path d="M12 7v10M9.6 9.6c0-1 1-1.6 2.4-1.6s2.4.6 2.4 1.6-1 1.4-2.4 1.7-2.4.7-2.4 1.8 1 1.5 2.4 1.5 2.4-.5 2.4-1.5" stroke="var(--indigo)" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}
