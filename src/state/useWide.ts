import { useSyncExternalStore } from 'react'

/** The laptop layout's breakpoint. CSS uses the same width: `@media (min-width: 1024px)`. */
export const WIDE_QUERY = '(min-width: 1024px)'

const query = () => (typeof matchMedia === 'undefined' ? null : matchMedia(WIDE_QUERY))
const subscribe = (onChange: () => void) => {
  const q = query()
  q?.addEventListener('change', onChange)
  return () => q?.removeEventListener('change', onChange)
}

/** True on a laptop-wide window: the sidebar shows and the tab bar hides. */
export const useWide = () => useSyncExternalStore(subscribe, () => query()?.matches ?? false, () => false)
