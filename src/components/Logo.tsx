// The Abu Shreek mark: three rounded rising bars (sky) with a white upward trend line and arrowhead, on an indigo rounded
// square. The one logo in the app (Welcome header, the Me avatar); public/logo.svg is the same drawing with fixed colours,
// and the favicon / home-screen icons are rendered from it (CLAUDE.md, "app icon").

/** The geometry, on a 64-unit square, shared with public/logo.svg. */
export const LOGO_PATHS = {
  bars: [
    { x: 17, y: 34, h: 12 },
    { x: 28, y: 28, h: 18 },
    { x: 39, y: 20, h: 26 },
  ],
  trend: 'M15 31 L25.5 23.5 L33 27.5 L46 16.5',
  arrow: 'M39.5 16.5 H46 V23',
}

/** The logo mark. Decorative by default (it sits next to the app name); pass `label` when it stands alone. */
export function Logo({ size = 34, label }: { size?: number; label?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
      style={{ display: 'block', flexShrink: 0 }}
    >
      <rect width="64" height="64" rx="16" fill="var(--indigo)" />
      {LOGO_PATHS.bars.map((b) => (
        <rect key={b.x} x={b.x} y={b.y} width="8" height={b.h} rx="2" fill="var(--sky)" />
      ))}
      <path d={LOGO_PATHS.trend} fill="none" stroke="var(--white)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <path d={LOGO_PATHS.arrow} fill="none" stroke="var(--white)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
