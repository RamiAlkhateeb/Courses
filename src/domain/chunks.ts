// Cuts a section's content into bite-size cards (one idea each) for the lesson flow. Pure, no DOM:
// course HTML is author-controlled and simple, so a small tag scanner is enough (and runs in tests).
import type { Block, Localized } from '../content/types'

/** Block-level tags that start a new piece of a split html block. Inline tags (strong, code…) never split. */
const BLOCK_TAGS = new Set(['p', 'ul', 'ol', 'h3', 'h4', 'table', 'pre', 'div', 'blockquote'])

/** The top-level block elements of an html string, in order. Text between them is kept as its own part. */
export function splitHtml(html: string): string[] {
  const parts: string[] = []
  const tag = /<(\/?)([a-z][a-z0-9]*)\b[^>]*>/gi
  let depth = 0
  let start = 0
  let m: RegExpExecArray | null
  const pushText = (end: number) => {
    const text = html.slice(start, end).trim()
    if (text) parts.push(text)
  }
  while ((m = tag.exec(html))) {
    const name = m[2].toLowerCase()
    if (!BLOCK_TAGS.has(name)) continue
    if (m[1] === '') {
      if (depth === 0) {
        pushText(m.index)
        start = m.index
      }
      depth++
    } else if (depth > 0) {
      depth--
      if (depth === 0) {
        parts.push(html.slice(start, tag.lastIndex).trim())
        start = tag.lastIndex
      }
    }
  }
  pushText(html.length)
  return parts
}

/** Splits both languages in step; if they don't split into the same number of parts, keeps the text whole
 *  so English and Arabic cards always line up. */
export function splitLocalized(text: Localized): Localized[] {
  const en = splitHtml(text.en)
  if (!text.ar) return en.length > 1 ? en.map((e) => ({ en: e })) : [text]
  const ar = splitHtml(text.ar)
  if (en.length <= 1 || en.length !== ar.length) return [text]
  return en.map((e, i) => ({ en: e, ar: ar[i] }))
}

const plain = (html: string) => html.replace(/<[^>]+>/g, '').trim()
const isHeading = (b: Block) => b.type === 'html' && /^<h[34]\b/i.test(b.html.en)
/** "Keep these sections, in this order:" — introduces the block after it, so they share a card. */
const isLeadIn = (b: Block) => b.type === 'html' && /[:：]$/.test(plain(b.html.en))

export interface Cards {
  /** Content cards, each a short run of blocks. */
  cards: Block[][]
  /** Exercise question ids with the index of the card they followed (−1: before any card). */
  exercises: { questionId: string; afterCard: number }[]
}

/** One idea per card: each paragraph, list, box, table, code sample… is a card; a heading or a lead-in
 *  ending in ":" sticks to what follows, as does a code example after a formula. `cardBreak` forces a cut. */
export function toCards(blocks: Block[]): Cards {
  const pieces: Block[] = blocks.flatMap((b): Block[] =>
    b.type === 'html' ? splitLocalized(b.html).map((html) => ({ type: 'html', html })) : [b],
  )
  const cards: Block[][] = []
  const exercises: Cards['exercises'] = []
  let current: Block[] = []
  let glue = false // the last piece wants the next one on the same card
  const close = () => {
    if (current.length) cards.push(current)
    current = []
  }
  for (const piece of pieces) {
    if (piece.type === 'exercise') {
      // A pending card is part of what the question tests, so it counts as shown before it.
      close()
      glue = false
      exercises.push({ questionId: piece.questionId, afterCard: cards.length - 1 })
      continue
    }
    if (piece.type === 'cardBreak') {
      close()
      glue = false
      continue
    }
    const prev = current.at(-1)
    const joins = glue || (piece.type === 'code' && prev?.type === 'formula')
    if (!joins) close()
    current.push(piece)
    glue = isHeading(piece) || isLeadIn(piece)
  }
  close()
  return { cards, exercises }
}
