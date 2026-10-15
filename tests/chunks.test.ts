import { describe, expect, it } from 'vitest'
import type { Block } from '../src/content/types'
import { splitHtml, splitLocalized, toCards } from '../src/domain/chunks'

const html = (en: string, ar = en): Block => ({ type: 'html', html: { en, ar } })

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
    const box: Block = { type: 'box', variant: 'mistake', label: { en: 'M' }, html: { en: 'x' } }
    const { cards } = toCards([html('<p>a</p><p>b</p>'), box])
    expect(cards.map((c) => c.length)).toEqual([1, 1, 1])
  })

  it('keeps a heading or a lead-in ending in ":" with what follows, and a code example with its formula', () => {
    const table: Block = { type: 'table', headers: [], rows: [] }
    const formula: Block = { type: 'formula', eq: 'a = b', note: { en: 'n' } }
    const code: Block = { type: 'code', code: 'x' }
    const { cards } = toCards([html('<h3>Q?</h3><p>Answer.</p>'), html('<p>Keep these:</p>'), table, formula, code])
    expect(cards.map((c) => c.map((b) => b.type))).toEqual([['html', 'html'], ['html', 'table'], ['formula', 'code']])
  })

  it('keeps a picture on the card of the paragraph before it', () => {
    const fig: Block = { type: 'diagram', fig: { en: 'F' }, title: { en: 'T' }, src: '/x.svg', alt: { en: 'A' }, caption: { en: 'C' } }
    const { cards } = toCards([html('<p>a</p><p>b</p>'), fig, html('<p>c</p>')])
    expect(cards.map((c) => c.map((b) => b.type))).toEqual([['html'], ['html', 'diagram'], ['html']])
  })

  it('cuts at cardBreak and records where each exercise was', () => {
    const { cards, exercises } = toCards([
      html('<p>a</p>'),
      { type: 'exercise', questionId: 'x-q001' },
      html('<p>b</p>'),
      { type: 'cardBreak' },
      html('<p>c</p>'),
    ])
    expect(cards).toHaveLength(3)
    expect(exercises).toEqual([{ questionId: 'x-q001', afterCard: 0 }])
  })
})
