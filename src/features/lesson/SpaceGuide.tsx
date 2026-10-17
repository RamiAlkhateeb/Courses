import { useLayoutEffect, useRef, useState } from 'react'
import type { Block } from '../../content/types'
import { Guide } from '../../components/ui'
import { fillerPose } from '../../domain/guide'
import styles from './LessonPage.module.css'

/** The guide only appears when at least this much room is left under the step; never taller than MAX. */
const MIN = 160
const MAX = 280
const GAP = 24

/** Fills the empty space under a lesson step with the guide: measures the room between the end of the step and the
 *  docked footer, and shows the guide (sized to fit, at most MAX) only when there is at least MIN of it. */
export function SpaceGuide({ blocks, step }: { blocks: Block[]; step: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState(0)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const measure = () => {
      const footer = document.querySelector('[data-lesson-footer]')
      const limit = footer ? footer.getBoundingClientRect().top : window.innerHeight
      const free = Math.floor(limit - el.getBoundingClientRect().top - GAP * 2)
      setHeight(free >= MIN ? Math.min(free, MAX) : 0)
    }
    measure()
    const settle = setTimeout(measure, 320) // after the card's entrance animation
    const observer = new ResizeObserver(measure)
    if (el.parentElement) observer.observe(el.parentElement)
    window.addEventListener('resize', measure)
    return () => {
      clearTimeout(settle)
      observer.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [])

  return <div ref={ref} className={styles.spaceGuide}>{height > 0 && <Guide pose={fillerPose(blocks, step)} height={height} />}</div>
}
