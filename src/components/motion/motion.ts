import { useEffect, useState } from 'react'

/** Whether the reader is fine with motion (no "reduce motion" setting). Checked at call time. */
export const motionOk = () => typeof window === 'undefined' || !window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

/** A short tap of the phone's vibration for a right answer, where the device has one and motion is welcome. */
export function buzz(ms = 25) {
  if (motionOk() && typeof navigator !== 'undefined' && 'vibrate' in navigator) navigator.vibrate?.(ms)
}

/** A number that counts from `from` up to `to` over `ms` (straight to `to` when motion is reduced). */
export function useCountUp(from: number, to: number, ms = 900): number {
  const [value, setValue] = useState(motionOk() ? from : to)
  useEffect(() => {
    if (!motionOk() || from === to) return setValue(to)
    let frame = 0
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / ms)
      setValue(Math.round(from + (to - from) * (1 - (1 - t) ** 3)))
      if (t < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [from, to, ms])
  return value
}
