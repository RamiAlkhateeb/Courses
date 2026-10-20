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
export const stripTags = (html: string) => html.replace(/<[^>]+>/g, ' ')
export const wordCount = (text: string) => text.split(/\s+/).filter(Boolean).length

/** Reading words in a block (English text; tabs count their first tab only — the others are alternatives). */
export function blockWords(block: Block): number {
  switch (block.type) {
    case 'html':
    case 'box':
    case 'keyIdea':
      return wordCount(stripTags(block.html.en))
    case 'objectives':
    case 'takeaways':
      return block.items.reduce((n, item) => n + wordCount(stripTags(item.en)), 0)
    case 'table':
      return [...block.headers, ...block.rows.flat()].reduce((n, cell) => n + wordCount(stripTags(cell.en)), 0)
    case 'formula':
      return wordCount(block.eq) + wordCount(block.note.en)
    case 'code':
      return block.code.split('\n').length * 3
    case 'tabs':
      return (block.tabs[0]?.blocks ?? []).reduce((n, b) => n + blockWords(b), 0)
    case 'diagram':
      return wordCount(stripTags(block.caption.en)) + 20
    case 'calculator':
      return 40 // a moment to play with the sliders
    default:
      return 0
  }
}

/** Words on a card. */
export const cardWords = (blocks: Block[]) => blocks.reduce((n, b) => n + blockWords(b), 0)

/** A card under this many words is "short": it joins the card before it when it can. */
export const SHORT_CARD = 35
/** Two cards merge only while together they stay this short (one screen of reading); a key idea is a single
 *  sentence on its own coloured panel, so it may stretch a card a little further. */
export const CARD_WORDS = 90
const KEY_IDEA_WORDS = 110
/** A card over this many words is too long for one screen: `splitLong` cuts it in two. */
export const LONG_CARD = CARD_WORDS
/** Blocks that fill a card on their own: such a card never takes on another, and is never "short". */
const MEDIA = new Set<Block['type']>(['table', 'diagram', 'calculator', 'code', 'tabs', 'practice'])
export const hasMedia = (blocks: Block[]) => blocks.some((b) => MEDIA.has(b.type))
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
 *  ending in ":" sticks to what follows, as does a code example after a formula, a picture after its paragraph, and an example box after a
 *  lone paragraph (a definition and its example share a card). `cardBreak` forces a cut. */
export function toCards(blocks: Block[]): Cards {
  const pieces: Block[] = blocks.flatMap((b): Block[] =>
    b.type === 'html' ? splitLocalized(b.html).map((html) => ({ type: 'html', html })) : [b],
  )
  const cards: Block[][] = []
  const exercises: Cards['exercises'] = []
  const forced = new Set<number>() // cards that start at a cardBreak: never merged into the one before
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
      forced.add(cards.length)
      glue = false
      continue
    }
    const prev = current.at(-1)
    const joins =
      glue ||
      (piece.type === 'code' && prev?.type === 'formula') ||
      (piece.type === 'diagram' && prev?.type === 'html') ||
      (piece.type === 'box' && piece.variant === 'example' && current.length === 1 && prev?.type === 'html')
    if (!joins) close()
    current.push(piece)
    glue = isHeading(piece) || isLeadIn(piece)
  }
  close()
  return splitLong(mergeShort(cards, exercises, forced))
}

/** No near-empty steps: a short card (or a key idea) joins the card before it, as long as no question sits between
 *  them, the author did not force a cut, neither card holds a table / picture / calculator / code, and together they
 *  stay within one screen of reading. */
function mergeShort(cards: Block[][], exercises: Cards['exercises'], forced: Set<number>): Cards {
  const out: Block[][] = []
  const remap: number[] = [] // old card index -> new card index
  cards.forEach((card, i) => {
    const prev = out.at(-1)
    const idea = card.length === 1 && card[0].type === 'keyIdea'
    const short = cardWords(card) < SHORT_CARD || idea
    const canJoin =
      prev &&
      short &&
      !forced.has(i) &&
      !exercises.some((e) => e.afterCard === i - 1) &&
      !hasMedia(prev) &&
      !hasMedia(card) &&
      cardWords(prev) + cardWords(card) <= (idea ? KEY_IDEA_WORDS : CARD_WORDS)
    if (canJoin) prev.push(...card)
    else out.push([...card])
    remap.push(out.length - 1)
  })
  return { cards: out, exercises: exercises.map((e) => ({ ...e, afterCard: e.afterCard < 0 ? e.afterCard : remap[e.afterCard] })) }
}

/** The sentences of a paragraph's text (inline tags kept), or null when it is not one plain `<p>`. */
function sentences(html: string): { open: string; parts: string[]; close: string } | null {
  const m = /^(<p\b[^>]*>)([\s\S]*)(<\/p>)$/i.exec(html.trim())
  const inner = m ? m[2] : html.trim()
  if (/<(p|ul|ol|table|div|h\d|pre|blockquote)\b/i.test(inner)) return null
  // A sentence ends at . ! ? or the Arabic ؟ followed by a space (decimals like 3.5 have no space after the dot)
  const parts = inner.split(/(?<=[.!?؟])\s+/).filter(Boolean)
  return parts.length > 1 ? { open: m?.[1] ?? '<p>', parts, close: m?.[3] ?? '</p>' } : null
}

/** Tags opened and closed in step (an inline <strong> must not straddle the cut). */
const balanced = (html: string) => (html.match(/<[a-z][^>]*>/gi) ?? []).length === (html.match(/<\/[a-z][^>]*>/gi) ?? []).length

/** Cut one long paragraph in two at the sentence end nearest its middle, in each language on its own sentences. */
function splitParagraph(text: Localized): [Localized, Localized] | null {
  const cut = (html: string): [string, string] | null => {
    const s = sentences(html)
    if (!s) return null
    const total = wordCount(stripTags(s.parts.join(' ')))
    let best: [string, string] | null = null
    let bestGap = Infinity
    for (let i = 1; i < s.parts.length; i++) {
      const head = s.parts.slice(0, i).join(' ')
      const gap = Math.abs(wordCount(stripTags(head)) * 2 - total)
      if (gap < bestGap && balanced(head)) {
        bestGap = gap
        best = [`${s.open}${head}${s.close}`, `${s.open}${s.parts.slice(i).join(' ')}${s.close}`]
      }
    }
    return best
  }
  const en = cut(text.en)
  if (!en) return null
  if (!text.ar) return [{ en: en[0] }, { en: en[1] }]
  const ar = cut(text.ar)
  return ar ? [{ en: en[0], ar: ar[0] }, { en: en[1], ar: ar[1] }] : null
}

/** Cut a long card in two: between blocks where the halves come out most even (never just before a key idea or
 *  right after a heading or a lead-in, which belong with their neighbour), or a lone long paragraph at a sentence. */
function halve(card: Block[]): [Block[], Block[]] | null {
  if (card.length === 1) {
    const b = card[0]
    const parts = b.type === 'html' ? splitParagraph(b.html) : null
    return parts ? [[{ type: 'html', html: parts[0] }], [{ type: 'html', html: parts[1] }]] : null
  }
  const total = cardWords(card)
  let best: [Block[], Block[]] | null = null
  let bestGap = Infinity
  for (let k = 1; k < card.length; k++) {
    if (card[k].type === 'keyIdea' || isHeading(card[k - 1]) || isLeadIn(card[k - 1])) continue
    const gap = Math.abs(cardWords(card.slice(0, k)) * 2 - total)
    if (gap < bestGap) {
      bestGap = gap
      best = [card.slice(0, k), card.slice(k)]
    }
  }
  return best
}

/** No step longer than one screen: a card over LONG_CARD words (pictures, tables, code and the simulator aside) is
 *  cut in two, again if a half is still too long. Questions stay after the same content. */
function splitLong({ cards, exercises }: Cards): Cards {
  const out: Block[][] = []
  const remap: number[] = [] // old card index -> index of its last piece
  const push = (card: Block[], depth: number) => {
    const halves = !hasMedia(card) && cardWords(card) > LONG_CARD && depth < 3 ? halve(card) : null
    if (!halves) return out.push(card)
    push(halves[0], depth + 1)
    push(halves[1], depth + 1)
  }
  cards.forEach((card) => {
    push(card, 0)
    remap.push(out.length - 1)
  })
  return { cards: out, exercises: exercises.map((e) => ({ ...e, afterCard: e.afterCard < 0 ? e.afterCard : remap[e.afterCard] })) }
}
