import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type ReactNode, type RefObject } from 'react'
import { createPortal } from 'react-dom'
import { Icon } from './Icon'
import styles from './Dropdown.module.css'

export interface DropdownOption {
  key: string
  label: ReactNode
  selected?: boolean
  onSelect: () => void
}

/** Room kept between the list and the screen's edges, and between the list and its button */
const EDGE = 16
const GAP = 6
const MIN_WIDTH = 260

/**
 * A choice list that drops down right under the button that opened it (`anchor`), or rises above it when there is
 * no room below. Fixed to the screen and drawn on `document.body`, so no card clips it. A tap outside, Escape, a
 * scroll or a resize close it; focus starts on the selected option and returns to the button. ↑ ↓ Home End move.
 */
export function Dropdown({ anchor, label, options, footer, onClose }: { anchor: RefObject<HTMLElement | null>; label: string; options: DropdownOption[]; footer?: ReactNode; onClose: () => void }) {
  const box = useRef<HTMLDivElement>(null)
  const [place, setPlace] = useState<CSSProperties>({ visibility: 'hidden' })
  const close = useRef(onClose)
  close.current = onClose

  // Measure the button and the list, then place the list below it (or above, when below is too short)
  useLayoutEffect(() => {
    const a = anchor.current?.getBoundingClientRect()
    const list = box.current
    if (!a || !list) return
    const vw = document.documentElement.clientWidth
    const vh = window.innerHeight
    const width = Math.min(Math.max(a.width, MIN_WIDTH), vw - 2 * EDGE)
    const rtl = getComputedStyle(list).direction === 'rtl'
    const start = Math.min(Math.max(EDGE, rtl ? vw - a.right : a.left), vw - EDGE - width)
    const below = vh - a.bottom - GAP - EDGE
    const above = a.top - GAP - EDGE
    const up = list.scrollHeight > below && above > below
    setPlace({
      insetInlineStart: start,
      inlineSize: width,
      ...(up ? { insetBlockEnd: vh - a.top + GAP, maxBlockSize: above } : { insetBlockStart: a.bottom + GAP, maxBlockSize: below }),
    })
  }, [anchor])

  // Once placed (a hidden list can't take focus): focus the selected option
  const placed = place.visibility !== 'hidden'
  useEffect(() => {
    const list = box.current
    if (placed) (list?.querySelector<HTMLElement>('[aria-selected="true"]') ?? list?.querySelector<HTMLElement>('[role="option"]'))?.focus()
  }, [placed])

  useEffect(() => {
    const button = anchor.current
    const list = box.current
    const onKey = (e: globalThis.KeyboardEvent) => e.key === 'Escape' && close.current()
    const onScroll = (e: Event) => !(e.target instanceof Node && list?.contains(e.target)) && close.current()
    const onResize = () => close.current()
    window.addEventListener('keydown', onKey)
    window.addEventListener('scroll', onScroll, true)
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('scroll', onScroll, true)
      window.removeEventListener('resize', onResize)
      button?.focus()
    }
  }, [anchor])

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    const items = [...(box.current?.querySelectorAll<HTMLElement>('[role="option"]') ?? [])]
    const at = items.indexOf(document.activeElement as HTMLElement)
    const to = e.key === 'ArrowDown' ? at + 1 : e.key === 'ArrowUp' ? at - 1 : e.key === 'Home' ? 0 : e.key === 'End' ? items.length - 1 : null
    if (to === null || !items.length) return
    e.preventDefault()
    items[(to + items.length) % items.length].focus()
  }

  return createPortal(
    <>
      <div className={styles.catcher} onClick={onClose} aria-hidden />
      <div ref={box} className={styles.box} style={place} onKeyDown={onKeyDown}>
        <div role="listbox" aria-label={label} className={styles.list}>
          {options.map((o) => (
            <button key={o.key} type="button" role="option" aria-selected={!!o.selected} className={styles.option} onClick={o.onSelect}>
              <span className={styles.text}>{o.label}</span>
              {o.selected && <Icon name="check" size={20} />}
            </button>
          ))}
        </div>
        {footer && <div className={styles.footer}>{footer}</div>}
      </div>
    </>,
    document.body,
  )
}
