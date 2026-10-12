import { useEffect, useState } from 'react'

/**
 * Tracks which of the given section ids is currently "active" (nearest the top of the viewport).
 * Ported from ../../../../course/_shared/scripts/week.js's IntersectionObserver scrollspy.
 */
export function useScrollSpy(sectionIds: string[]) {
  const [activeId, setActiveId] = useState<string | null>(sectionIds[0] ?? null)

  useEffect(() => {
    if (!sectionIds.length || !('IntersectionObserver' in window)) return

    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)
    if (!elements.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id)
        })
      },
      { rootMargin: '-10% 0px -80% 0px', threshold: 0 },
    )
    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [sectionIds])

  return activeId
}
