import type { CSSProperties } from 'react'

/** The little garden pieces drawn beside the Learn path and on Welcome. Pure decoration (hidden from screen readers),
 *  coloured only with tokens. Pass `style` to place them (position, flip). */
type Piece = { size: number; style?: CSSProperties }

const svg = (size: number, style?: CSSProperties) => ({ width: size, height: size, viewBox: '0 0 48 48', 'aria-hidden': true as const, focusable: 'false' as const, style })

export function Tree({ size, style }: Piece) {
  return (
    <svg {...svg(size, style)}>
      <ellipse cx="24" cy="43" rx="14" ry="3" fill="var(--mint)" />
      <rect x="22" y="27" width="4" height="15" rx="2" fill="var(--leaf-dark)" />
      <circle cx="24" cy="19" r="13" fill="var(--leaf)" />
      <circle cx="16" cy="24" r="8" fill="var(--leaf-mid)" />
      <circle cx="32" cy="23" r="8" fill="var(--leaf-soft)" />
    </svg>
  )
}

export function Bush({ size, style }: Piece) {
  return (
    <svg {...svg(size, style)}>
      <ellipse cx="24" cy="42" rx="14" ry="3" fill="var(--mint)" />
      <circle cx="15" cy="34" r="8" fill="var(--leaf-mid)" />
      <circle cx="33" cy="34" r="8" fill="var(--leaf-soft)" />
      <circle cx="24" cy="29" r="10" fill="var(--leaf)" />
    </svg>
  )
}

export function Sprout({ size, style }: Piece) {
  return (
    <svg {...svg(size, style)}>
      <ellipse cx="24" cy="43" rx="12" ry="3" fill="var(--mint)" />
      <path d="M24 42V26" stroke="var(--leaf-dark)" strokeWidth="3" strokeLinecap="round" />
      <path d="M24 28c0-8 6-12 14-12 0 8-6 12-14 12z" fill="var(--leaf)" />
      <path d="M24 33c0-6-4-9-11-9 0 6 4 9 11 9z" fill="var(--leaf-mid)" />
    </svg>
  )
}

export function Mound({ size, style }: Piece) {
  return (
    <svg {...svg(size, style)}>
      <ellipse cx="24" cy="40" rx="14" ry="5" fill="var(--mint)" stroke="var(--sky)" strokeWidth="1.4" />
      <ellipse cx="24" cy="37" rx="4" ry="2.4" fill="var(--leaf-dark)" fillOpacity="0.55" />
    </svg>
  )
}

export const GARDEN = { tree: Tree, bush: Bush, sprout: Sprout, mound: Mound }
export type GardenKind = keyof typeof GARDEN
