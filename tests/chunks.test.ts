import { describe, expect, it } from 'vitest'
import type { Block } from '../src/content/types'
import { cardWords, CARD_WORDS, splitHtml, splitLocalized, toCards } from '../src/domain/chunks'

const html = (en: string, ar = en): Block => ({ type: 'html', html: { en, ar } })
/** A paragraph long enough (40 words) to stand on its own card */
const long = (tag: string) => `<p>${tag} ${'word '.repeat(39).trim()}</p>`

describe('splitHtml', () => {
  it('splits top-level block elements and keeps inline markup and nesting intact', () => {
    expect(splitHtml('<p>One <strong>bold</strong></p>\n<ul><li><p>nested</p></li></ul><p>Two</p>')).toEqual([
      '<p>One <strong>bold</strong></p>',
      '<ul><li><p>nested</p></li></ul>',
      '<p>Two</p>',
    ])
  })

  it('keeps bare text between elements as its own part', () => {
    expect(splitHtml('Intro <code>x</code><p>Body</p>')).toEqual(['Intro <code>x</code>', '<p>Body</p>'])
    expect(splitHtml('just text')).toEqual(['just text'])
  })
})

describe('splitLocalized', () => {
  it('splits both languages in step', () => {
    expect(splitLocalized({ en: '<p>a</p><p>b</p>', ar: '<p>أ</p><p>ب</p>' })).toEqual([
      { en: '<p>a</p>', ar: '<p>أ</p>' },
      { en: '<p>b</p>', ar: '<p>ب</p>' },
    ])
  })

  it('keeps the text whole when the languages split differently', () => {
    const text = { en: '<p>a</p><p>b</p>', ar: '<p>أ ب</p>' }
    expect(splitLocalized(text)).toEqual([text])
  })
})

describe('toCards', () => {
  it('gives each paragraph, box and table its own card', () => {
    const box: Block = { type: 'box', variant: 'mistake', label: { en: 'M' }, html: { en: long('x') } }
    const { cards } = toCards([html(long('a') + long('b')), box])
    expect(cards.map((c) => c.length)).toEqual([1, 1, 1])
  })

  it('keeps a heading or a lead-in ending in ":" with what follows, and a code example with its formula', () => {
    const table: Block = { type: 'table', headers: [], rows: [] }
    const formula: Block = { type: 'formula', eq: 'a = b', note: { en: 'n' } }
    const code: Block = { type: 'code', code: 'x' }
    const { cards } = toCards([html('<h3>Q?</h3>' + long('Answer.')), html('<p>Keep these:</p>'), table, formula, code])
    expect(cards.map((c) => c.map((b) => b.type))).toEqual([['html', 'html'], ['html', 'table'], ['formula', 'code']])
  })

  it('keeps a picture on the card of the paragraph before it', () => {
    const fig: Block = { type: 'diagram', fig: { en: 'F' }, title: { en: 'T' }, src: '/x.svg', alt: { en: 'A' }, caption: { en: 'C' } }
    const { cards } = toCards([html(long('a') + long('b')), fig, html(long('c'))])
    expect(cards.map((c) => c.map((b) => b.type))).toEqual([['html'], ['html', 'diagram'], ['html']])
  })

  it('puts an example box on the card of a lone paragraph before it', () => {
    const example: Block = { type: 'box', variant: 'example', label: { en: 'E' }, html: { en: long('x') } }
    const tip: Block = { type: 'box', variant: 'analogy', label: { en: 'A' }, html: { en: long('y') } }
    const { cards } = toCards([html(long('a')), example, tip])
    expect(cards.map((c) => c.map((b) => b.type))).toEqual([['html', 'box'], ['box']])
  })

  it('merges a short card, or a key idea, into the card before it while they fit one screen', () => {
    const idea: Block = { type: 'keyIdea', html: { en: '<p>The one thing to remember.</p>' } }
    const { cards } = toCards([html(long('a')), html('<p>A short follow-up.</p>'), idea])
    expect(cards.map((c) => c.map((b) => b.type))).toEqual([['html', 'html', 'keyIdea']])
  })

  it('does not merge past a picture, a table, a question, a forced cut, or one screen of reading', () => {
    const fig: Block = { type: 'diagram', fig: { en: 'F' }, title: { en: 'T' }, src: '/x.svg', alt: { en: 'A' }, caption: { en: 'C' } }
    const table: Block = { type: 'table', headers: [], rows: [] }
    const short = html('<p>Short.</p>')
    expect(toCards([html(long('a')), fig, short]).cards).toHaveLength(2)
    expect(toCards([table, short]).cards).toHaveLength(2)
    expect(toCards([html(long('a')), { type: 'exercise', questionId: 'x-q001' }, short]).cards).toHaveLength(2)
    expect(toCards([html(long('a')), { type: 'cardBreak' }, short]).cards).toHaveLength(2)
    expect(toCards([html(long('a') + long('b')), short]).cards.map((c) => c.length)).toEqual([1, 2])
    expect(toCards([html(long('a') + long('b') + long('c'))]).cards).toHaveLength(3)
  })

  it('cuts at cardBreak and records where each exercise was', () => {
    const { cards, exercises } = toCards([
      html(long('a')),
      { type: 'exercise', questionId: 'x-q001' },
      html(long('b')),
      { type: 'cardBreak' },
      html(long('c')),
    ])
    expect(cards).toHaveLength(3)
    expect(exercises).toEqual([{ questionId: 'x-q001', afterCard: 0 }])
  })
})

describe('long steps are cut in two', () => {
  const sentence = (n: number, lang: 'en' | 'ar') => (lang === 'en' ? `Sentence ${n} has a few plain words in it to read.` : `الجملة ${n} فيها بعض الكلمات البسيطة للقراءة هنا.`)
  const para = (count: number, lang: 'en' | 'ar') => `<p>${Array.from({ length: count }, (_, i) => sentence(i + 1, lang)).join(' ')}</p>`
  it('a long paragraph splits at a sentence near its middle, in both languages', () => {
    const { cards } = toCards([{ type: 'html', html: { en: para(16, 'en'), ar: para(16, 'ar') } }])
    expect(cards).toHaveLength(2)
    for (const card of cards) {
      expect(cardWords(card)).toBeLessThanOrEqual(CARD_WORDS)
      const b = card[0] as Extract<Block, { type: 'html' }>
      expect(b.html.en).toMatch(/^<p>Sentence \d+ .*\.<\/p>$/)
      expect(b.html.ar).toMatch(/^<p>الجملة/)
    }
  })
  it('never cuts inside a tag, and leaves pictures and tables whole', () => {
    const bold = `<p><strong>${Array.from({ length: 16 }, (_, i) => sentence(i + 1, 'en')).join(' ')}</strong></p>`
    expect(toCards([{ type: 'html', html: { en: bold } }]).cards).toHaveLength(1)
    const rows = Array.from({ length: 30 }, (_, i) => [{ en: `row ${i} with some words` }, { en: 'more words here' }])
    expect(toCards([{ type: 'table', headers: [{ en: 'A' }, { en: 'B' }], rows }]).cards).toHaveLength(1)
  })
  it('keeps a key idea with the text before it and questions after the same content', () => {
    const blocks: Block[] = [
      { type: 'html', html: { en: para(6, 'en') } },
      { type: 'html', html: { en: para(6, 'en') } },
      { type: 'keyIdea', html: { en: '<p>Remember this one idea.</p>' } },
      { type: 'exercise', questionId: 'x-q001' },
    ]
    const { cards, exercises } = toCards(blocks)
    expect(cards.length).toBe(2)
    expect(cards[1].at(-1)?.type).toBe('keyIdea')
    expect(exercises).toEqual([{ questionId: 'x-q001', afterCard: 1 }])
  })
})
