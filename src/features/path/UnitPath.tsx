import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Tree, Bush, Sprout, Mound } from '../../components/GardenArt'
import { AbuShreek, PathNode, type NodeState } from '../../components/ui'
import { practiceHref } from '../../content/courses'
import { useLocalized } from '../../content/useLocalized'
import { learnHref } from '../../domain/lessons'
import type { Chapter } from '../../state/useTrail'
import styles from './UnitPath.module.css'

/** Horizontal offsets from the centre, in px: 0, +46, +70, +46, 0, −46, repeating. Logical, so RTL mirrors them. */
const OFFSETS = [0, 46, 70, 46, 0, -46]
const STEP = 92 // px between node centres
const ABOVE_CURRENT = 30 // room for the START bubble above the bigger current node
const BELOW_CURRENT = 16
const TOP = 34
const BOTTOM = 56
const CENTRE = 195 // the connector is drawn on a 390px-wide canvas centred on the column

/** What a node shows: the unit's own states with only the path's single "current" lesson lit. */
export type NodeKind = 'done' | 'current' | 'locked'

const GARDEN = [Tree, Sprout, Bush, Mound, Sprout, Tree]

/**
 * One unit of the Learn path: round lesson nodes in a zigzag from top to bottom, a dotted connector behind them (solid
 * green over the finished part), garden pieces on both sides, the mascot beside the current lesson, and the unit's reward
 * chest at the end. Nothing is written under the nodes; each one has a spoken label instead.
 */
export function UnitPath({ chapter, kinds, onCurrent }: { chapter: Chapter; kinds: NodeKind[]; onCurrent?: (el: HTMLElement | null) => void }) {
  const { t, i18n } = useTranslation()
  const tc = useLocalized()
  const navigate = useNavigate()
  const rtl = i18n.dir() === 'rtl'
  const n = chapter.lessons.length
  const currentIndex = kinds.indexOf('current')
  const allDone = n > 0 && kinds.every((k) => k === 'done')

  // Centre of each node (0..n-1 lessons, n = the chest).
  const centres: { y: number; dx: number }[] = []
  let y = TOP + 34
  for (let i = 0; i <= n; i++) {
    if (i > 0) y += STEP + (i === currentIndex ? ABOVE_CURRENT : i - 1 === currentIndex ? BELOW_CURRENT : 0)
    centres.push({ y, dx: OFFSETS[i % OFFSETS.length] })
  }
  const height = y + BOTTOM

  const path = centres.slice(1).map((to, i) => {
    const from = centres[i]
    const mid = (from.y + to.y) / 2
    return `M ${CENTRE + from.dx} ${from.y} C ${CENTRE + from.dx} ${mid}, ${CENTRE + to.dx} ${mid}, ${CENTRE + to.dx} ${to.y}`
  })
  const doneSegments = path.filter((_, i) => kinds[i] === 'done')

  const currentRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    onCurrent?.(currentIndex >= 0 ? currentRef.current : null)
  }, [currentIndex, onCurrent])

  const cur = currentIndex >= 0 ? centres[currentIndex] : null
  // The mascot stands on the empty side of the current node and faces it.
  const mascotAtStart = cur ? cur.dx > 10 : true
  const mascotFlip = mascotAtStart === rtl ? true : false

  return (
    <div className={styles.unit} style={{ blockSize: height }}>
      <svg className={styles.lines} width="390" height={height} viewBox={`0 0 390 ${height}`} fill="none" aria-hidden focusable="false">
        {path.map((d, i) => (
          <path key={i} d={d} stroke="var(--sky)" strokeWidth="6" strokeLinecap="round" strokeDasharray="1 13" />
        ))}
        {doneSegments.map((d, i) => (
          <path key={`d${i}`} d={d} stroke="var(--leaf)" strokeWidth="7" strokeLinecap="round" strokeOpacity="0.55" />
        ))}
      </svg>

      {/* Garden pieces: alternate sides, never on top of a node */}
      {centres.map((c, i) => {
        const Piece = GARDEN[i % GARDEN.length]
        const side = c.dx > 0 ? -1 : 1
        const dx = side * (118 + ((i * 17) % 28))
        const size = 36 + ((i * 7) % 3) * 10
        return <Piece key={i} size={size} style={{ position: 'absolute', insetBlockStart: c.y - size / 2 + 6, insetInlineStart: `calc(50% + ${dx}px - ${size / 2}px)` }} />
      })}

      {cur && (
        <div className={styles.mascot} style={{ insetBlockStart: cur.y - 56, ...(mascotAtStart ? { insetInlineStart: 4 } : { insetInlineEnd: 4 }) }}>
          <AbuShreek pose="point" height={128} flip={mascotFlip} />
        </div>
      )}

      {kinds.map((kind, i) => {
        const lesson = chapter.lessons[i]
        const c = centres[i]
        const state: NodeState = kind === 'current' ? 'next' : kind
        const size = state === 'next' ? 84 : 68
        const label = t('nodeLabel', { n: i + 1, title: tc(lesson.title), status: t(kind === 'done' ? 'nodeDone' : kind === 'current' ? 'nodeStart' : 'nodeLocked') })
        const go = kind === 'locked' ? undefined : () => navigate(learnHref(chapter.mod!.courseId, chapter.mod!.id, lesson.id))
        return (
          <div key={lesson.id} ref={kind === 'current' ? currentRef : undefined} className={styles.stop} style={{ insetBlockStart: c.y - size / 2, insetInlineStart: `calc(50% + ${c.dx}px)` }}>
            {kind === 'current' && (
              <span className={styles.start} aria-hidden>
                {t('startBubble')}
              </span>
            )}
            <PathNode state={state} size={size} onClick={go} label={label} />
          </div>
        )
      })}

      <div className={styles.stop} style={{ insetBlockStart: centres[n].y - 34, insetInlineStart: `calc(50% + ${centres[n].dx}px)` }}>
        <PathNode
          state={allDone ? 'chest' : 'chestLocked'}
          onClick={allDone ? () => navigate(practiceHref(chapter.mod!.courseId, chapter.mod!.id)) : undefined}
          label={t(allDone ? 'nodeRewardReady' : 'nodeRewardLocked')}
        />
      </div>
    </div>
  )
}
