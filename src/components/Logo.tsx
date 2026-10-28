// The Zubda mark: the word زبدة in teal with a mustard three-ray burst above it, on a cream rounded square (flat, no
// shadow). The one logo in the app (Welcome header, the Me avatar, share slides); public/logo.svg is the same drawing
// with fixed colours, and the favicon / home-screen icons are rendered from it (scripts/make-icons.mjs).
import { LOGO_PATHS, LOGO_RADIUS } from './logoPaths'

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
      <rect width="64" height="64" rx={LOGO_RADIUS} fill="var(--logo-cream)" />
      <path d={LOGO_PATHS.word} fill="var(--logo-teal)" fillRule="evenodd" />
      <path d={LOGO_PATHS.burst} fill="var(--logo-sun)" />
    </svg>
  )
}
