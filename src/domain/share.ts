// Social carousel slides cut from a roadmap lesson (the share route, src/app/SharePage.tsx). Pure: the page draws
// them with the app's own components, and scripts/social/export-post.mjs screenshots them.
import type { Block, Localized, Question } from '../content/types'
import { blockWords } from './chunks'
import type { Lesson } from './lessons'

export type Slide =
  | { kind: 'hook'; title: Localized; standfirst?: Localized }
  | { kind: 'content'; blocks: Block[] }
  | { kind: 'idea'; html: Localized }
  | { kind: 'question'; question: Question }
  | { kind: 'answer'; question: Question }
  | { kind: 'cta' }

/** Blocks a still image can't carry: lists of goals, the live simulator, sliders, and the lesson's own plumbing. */
const DROPPED = new Set<Block['type']>(['objectives', 'takeaways', 'practice', 'calculator', 'exercise', 'cardBreak'])
/** Pictures and tables get a slide of their own. */
const ALONE = new Set<Block['type']>(['diagram', 'table', 'code', 'tabs', 'formula'])
/** Most words of text on one slide (the image is read at a glance; a step of the app is up to 90). */
export const SLIDE_WORDS = 55

/** The standfirst inside a section's heading markup (`heading()` in src/content/helpers.ts). */
const standfirstOf = (html?: Localized): Localized | undefined => {
  const pick = (s?: string) => s?.match(/<p class="standfirst">([\s\S]*?)<\/p>/)?.[1]
  const en = pick(html?.en)
  return en ? { en, ar: pick(html?.ar) } : undefined
}

/** The slides of a lesson: a hook, its text in short slides (a picture or table alone), the key idea, and a closing
 *  call to action. With `quiz`, each question also comes twice before the call to action (asked, then answered with
 *  why); posts leave them out by default. */
export function shareSlides(lesson: Lesson, { quiz = false }: { quiz?: boolean } = {}): Slide[] {
  const first = lesson.steps.find((s) => s.kind === 'content')
  const slides: Slide[] = [{ kind: 'hook', title: lesson.title, standfirst: standfirstOf(first?.kind === 'content' ? first.heading?.html : undefined) }]
  const ideas: Slide[] = []
  let text: Block[] = []
  const flush = () => {
    if (text.length) slides.push({ kind: 'content', blocks: text })
    text = []
  }
  for (const step of lesson.steps) {
    if (step.kind !== 'content') continue
    for (const block of step.blocks) {
      if (DROPPED.has(block.type)) continue
      if (block.type === 'keyIdea') {
        ideas.push({ kind: 'idea', html: block.html })
      } else if (ALONE.has(block.type)) {
        flush()
        slides.push({ kind: 'content', blocks: [block] })
      } else {
        const words = text.reduce((n, b) => n + blockWords(b), 0)
        if (text.length && words + blockWords(block) > SLIDE_WORDS) flush()
        text.push(block)
      }
    }
    flush()
  }
  slides.push(...ideas)
  for (const step of quiz ? lesson.steps : []) {
    if (step.kind === 'question') slides.push({ kind: 'question', question: step.question }, { kind: 'answer', question: step.question })
  }
  slides.push({ kind: 'cta' })
  return slides
}
