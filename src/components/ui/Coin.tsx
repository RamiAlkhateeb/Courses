/** The play-money coin: saffron disc, ink rim, a dollar stroke. A drawing with the design tokens as colours. */
export function Coin({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden focusable="false">
      <circle cx="12" cy="12" r="10.5" fill="var(--accent)" stroke="var(--ink)" strokeWidth="1.5" />
      <path d="M14.5 8.5c-.6-.8-1.5-1.2-2.600-1.2-1.500 0-2.500.8-2.500 1.900 0 2.800 5.300 1.400 5.300 4.100 0 1.2-1.100 2-2.700 2-1.2 0-2.200-.5-2.800-1.400M12 5.500v13" fill="none" stroke="var(--ink)" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}
