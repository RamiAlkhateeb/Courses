import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { PathNode, AbuShreek, Button, Icon, type NodeState } from '../../components/ui'
import { practiceHref } from '../../content/courses'
import { useLocalized } from '../../content/useLocalized'
import { learnHref } from '../../domain/lessons'
import type { Chapter } from '../../state/useTrail'
import styles from './PathMap.module.css'

const STEP = 125 // px between nodes
const TOP = 110 // room above the checkpoint for the flag
const BOTTOM = 300 // room below the first node: AbuShreek, and enough page below it to centre the first lessons
/** Horizontal position (% from the inline-start edge) of the n-th node, bottom up: a gentle zig-zag. */
const X = [34, 66, 40, 62]
/** Set once the path has been opened in this browser session: later visits scroll to the lesson smoothly. */
const SCROLLED = 'pathScrolled'
const MOUNTAIN_TOP = 70 // px: where the mountain polygon starts (see PathMap.module.css)

const prefersReducedMotion = () => typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches
function firstVisit(): boolean {
  try {
    const first = sessionStorage.getItem(SCROLLED) === null
    sessionStorage.setItem(SCROLLED, '1')
    return first
  } catch {
    return true
  }
}

/** The mountain: a chapter's lessons climb from the base to a unit-checkpoint star below the flag. Mirrors in RTL. */
export function PathMap({ chapter }: { chapter: Chapter }) {
  const t = useLocalized()
  const { t: tUi } = useTranslation()
  const navigate = useNavigate()
  const n = chapter.lessons.length
  const height = TOP + (n + 1) * STEP + BOTTOM
  // Node k (0 = first lesson, n = checkpoint): centre in px, bottom up.
  const pos = Array.from({ length: n + 1 }, (_, k) => ({ x: X[k % X.length], y: height - BOTTOM - k * STEP }))
  const allDone = chapter.done === n && n > 0

  // Open on the lesson: scroll the current node to the middle of the screen (at once the first time, smoothly after
  // that), and offer a way back when it scrolls out of view.
  const currentRef = useRef<HTMLDivElement>(null)
  const [away, setAway] = useState(false)
  useEffect(() => {
    const el = currentRef.current
    if (!el) return
    el.scrollIntoView({ block: 'center', behavior: firstVisit() || prefersReducedMotion() ? 'auto' : 'smooth' })
    const observer = new IntersectionObserver(([entry]) => setAway(!entry.isIntersecting), { rootMargin: '0px 0px -100px 0px' }) // the tab bar covers the bottom
    observer.observe(el)
    return () => observer.disconnect()
  }, [chapter.id, chapter.done])
  const backToCamp = () => currentRef.current?.scrollIntoView({ block: 'center', behavior: prefersReducedMotion() ? 'auto' : 'smooth' })

  // Contour lines across the mountain, inside its slopes (the polygon runs from 40–60% wide at the top to full width).
  const slope = (y: number) => 40 - (40 * (y - MOUNTAIN_TOP)) / (height - MOUNTAIN_TOP)
  const contours = [0.3, 0.5, 0.7, 0.88].map((f) => {
    const y = Math.round(height * f)
    const x = slope(y) + 4
    return `M ${x} ${y} Q 50 ${y - 14} ${100 - x} ${y}`
  })

  const segments = pos.slice(1).map((to, i) => {
    const from = pos[i]
    const midY = (from.y + to.y) / 2
    const d = `M ${from.x} ${from.y} C ${from.x} ${midY}, ${to.x} ${midY}, ${to.x} ${to.y}`
    return { d, solid: chapter.states[i] === 'done' }
  })

  return (
    <div className={styles.map} style={{ blockSize: height }}>
      <span className={styles.hillL} aria-hidden />
      <span className={styles.hillR} aria-hidden />
      <span className={styles.sun} aria-hidden />
      <div className={styles.mountain} aria-hidden />
      <span className={styles.snow} aria-hidden />
      <svg className={styles.flag} viewBox="0 0 60 80" aria-hidden>
        <path d="M14 78V4" stroke="var(--accent)" strokeWidth="3" strokeLinecap="round" />
        <path d="M14 6h40l-10 12 10 12H14z" fill="var(--accent)" stroke="var(--brand)" strokeWidth="2" strokeLinejoin="round" />
      </svg>
      <svg className={styles.lines} viewBox={`0 0 100 ${height}`} preserveAspectRatio="none" aria-hidden>
        {contours.map((d, i) => (
          <path key={`c${i}`} d={d} className={styles.contour} vectorEffect="non-scaling-stroke" />
        ))}
        {segments.map((s, i) => (
          <path key={i} d={s.d} className={s.solid ? styles.lineDone : styles.lineTodo} vectorEffect="non-scaling-stroke" />
        ))}
      </svg>
      {pos.map((p, k) => {
        const isCheckpoint = k === n
        const lesson = chapter.lessons[k]
        const state: NodeState = isCheckpoint ? "chestLocked" : chapter.states[k] === 'current' ? 'next' : chapter.states[k]
        const label = isCheckpoint ? tUi('pathUnitCheckpoint') : t(lesson.title)
        const go = isCheckpoint
          ? allDone
            ? () => navigate(practiceHref(chapter.mod!.courseId, chapter.mod!.id))
            : undefined
          : state === 'locked'
            ? undefined
            : () => navigate(learnHref(chapter.mod!.courseId, chapter.mod!.id, lesson.id))
        return (
          <div key={k} ref={state === 'next' ? currentRef : undefined} className={styles.stop} style={{ insetInlineStart: `${p.x}%`, insetBlockStart: p.y - (state === 'next' ? 40 : 30) }}>
            <PathNode state={state} onClick={go} label={label} />
            <span className={`${styles.label} ${state === 'next' ? styles.labelNext : ''}`}>{label}</span>
          </div>
        )
      })}
      <AbuShreek pose="point" height={130} className={styles.guide} />
      {away && (
        <div className={styles.backToCamp}>
          <Button variant="indigo" size="sm" onClick={backToCamp}>
            <Icon name="play" size={16} /> {tUi('backToCamp')}
          </Button>
        </div>
      )}
    </div>
  )
}
