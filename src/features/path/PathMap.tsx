import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { PathNode, Rafiq, type NodeState } from '../../components/ui'
import { practiceHref } from '../../content/courses'
import { useLocalized } from '../../content/useLocalized'
import { learnHref } from '../lesson/lessons'
import type { Chapter } from './useTrail'
import styles from './PathMap.module.css'

const STEP = 125 // px between nodes
const TOP = 110 // room above the checkpoint for the flag
const BOTTOM = 120 // room below the first node for Rafiq
/** Horizontal position (% from the inline-start edge) of the n-th node, bottom up: a gentle zig-zag. */
const X = [34, 66, 40, 62]

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
      <svg className={styles.flag} viewBox="0 0 60 80" aria-hidden>
        <path d="M14 78V4" stroke="var(--accent)" strokeWidth="3" strokeLinecap="round" />
        <path d="M14 6h40l-10 12 10 12H14z" fill="var(--accent)" stroke="var(--brand)" strokeWidth="2" strokeLinejoin="round" />
      </svg>
      <svg className={styles.lines} viewBox={`0 0 100 ${height}`} preserveAspectRatio="none" aria-hidden>
        {segments.map((s, i) => (
          <path key={i} d={s.d} className={s.solid ? styles.lineDone : styles.lineTodo} vectorEffect="non-scaling-stroke" />
        ))}
      </svg>
      {pos.map((p, k) => {
        const isCheckpoint = k === n
        const lesson = chapter.lessons[k]
        const state: NodeState = isCheckpoint ? 'checkpoint' : chapter.states[k] === 'current' ? 'next' : chapter.states[k]
        const label = isCheckpoint ? tUi('pathUnitCheckpoint') : t(lesson.title)
        const go = isCheckpoint
          ? allDone
            ? () => navigate(practiceHref(chapter.mod!.courseId, chapter.mod!.id))
            : undefined
          : state === 'locked'
            ? undefined
            : () => navigate(learnHref(chapter.mod!.courseId, chapter.mod!.id, lesson.id))
        return (
          <div key={k} className={styles.stop} style={{ insetInlineStart: `${p.x}%`, insetBlockStart: p.y - (state === 'next' ? 40 : 30) }}>
            <PathNode state={state} size={state === 'next' ? 80 : 60} onMountain onClick={go} label={label} />
            <span className={`${styles.label} ${state === 'next' ? styles.labelNext : ''}`}>{label}</span>
          </div>
        )
      })}
      <Rafiq pose="point" height={130} className={styles.guide} />
    </div>
  )
}
