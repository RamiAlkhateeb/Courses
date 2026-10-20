import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { appCourses } from '../src/content/courses'
import type { Block, Module } from '../src/content/types'
import { CARD_WORDS, cardWords, hasMedia, SHORT_CARD } from '../src/domain/chunks'
import { lessonsFor } from '../src/domain/lessons'

// Lesson steps: none near-empty, all in one typography. The rules are explained in .claude/skills/lesson-cards.

async function offeredModules() {
  const mods: Module[] = []
  for (const course of appCourses) for (const load of Object.values(course.loaders)) mods.push(await load())
  return mods
}

/** A card that fills a screen on its own: a list, a formula, or a lone key idea (which gets Abu Shreek beside it). */
const fullOnItsOwn = (blocks: Block[]) =>
  hasMedia(blocks) ||
  blocks.some((b) => b.type === 'objectives' || b.type === 'takeaways' || b.type === 'formula') ||
  (blocks.length === 1 && blocks[0].type === 'keyIdea')

describe('lesson cards', () => {
  it(`no step of an offered course is a short card on its own (under ${SHORT_CARD} words, nothing to look at)`, async () => {
    const offenders: string[] = []
    for (const mod of await offeredModules()) {
      for (const lesson of lessonsFor(mod)) {
        lesson.steps.forEach((step, i) => {
          if (step.kind !== 'content' || step.heading) return // the first step carries the lesson's title
          if (cardWords(step.blocks) >= SHORT_CARD || fullOnItsOwn(step.blocks)) return
          offenders.push(`${mod.courseId}/${mod.id}/${lesson.id} step ${i + 1}: ${cardWords(step.blocks)} words`)
        })
      }
    }
    // Fix: lengthen the text, move it next to related text (it then merges), or add a diagram.
    expect(offenders).toEqual([])
  })

  it(`no text step of an offered course is longer than ${CARD_WORDS} words (long ones are cut in two)`, async () => {
    const offenders: string[] = []
    for (const mod of await offeredModules())
      for (const lesson of lessonsFor(mod))
        lesson.steps.forEach((step, i) => {
          if (step.kind === 'content' && !hasMedia(step.blocks) && cardWords(step.blocks) > CARD_WORDS)
            offenders.push(`${mod.courseId}/${mod.id}/${lesson.id} step ${i + 1}: ${cardWords(step.blocks)} words`)
        })
    expect(offenders).toEqual([])
  })

  it('card text uses the lesson type tokens only (one size and face on every step)', () => {
    // Exceptions: headings and display numbers, and code (monospace by design; not used in offered lessons).
    const allowed = new Set(['.timeEst', '.content h2', '.content code', '.codeBlock code', '.codeCopyBtn', '.calcResult strong', '.tabHeads button', '.tabPanel::before'])
    const css = readFileSync('src/components/content/content.module.css', 'utf8')
    const offenders: string[] = []
    for (const [, selector, body] of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
      const sel = selector.trim().replace(/\s+/g, ' ')
      const size = body.match(/font-size:\s*([^;]+);/)?.[1].trim()
      if (size && !/^(var\(--lesson-(text|small|label)\)|inherit|[\d.]+em)$/.test(size) && !allowed.has(sel)) offenders.push(`${sel}: ${size}`)
      if (/font-family:\s*(?!inherit)/.test(body) && !allowed.has(sel)) offenders.push(`${sel}: its own font-family`)
    }
    expect(offenders).toEqual([])
  })
})
