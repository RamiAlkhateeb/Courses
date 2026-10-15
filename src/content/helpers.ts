// Small builders shared by every course's content files. They only shape data — no logic.
import type { Block, Localized, Question, Section } from './types'

/** Bilingual text: `L('Budget', 'الميزانية')`. */
export const L = (en: string, ar: string): Localized => ({ en, ar })

/** `<h2>` + standfirst markup for a section heading. */
export const heading = (title: Localized, standfirst?: Localized): Localized => ({
  en: `<h2>${title.en}</h2>${standfirst ? `<p class="standfirst">${standfirst.en}</p>` : ''}`,
  ar: `<h2>${title.ar ?? title.en}</h2>${standfirst ? `<p class="standfirst">${standfirst.ar ?? standfirst.en}</p>` : ''}`,
})

export const cover = (kicker: Localized, title: Localized, time: Localized) => ({
  kicker,
  titleHtml: { en: `<h1>${title.en}</h1>`, ar: `<h1>${title.ar ?? title.en}</h1>` },
  timeEstimate: time,
})

export const html = (value: Localized): Block => ({ type: 'html', html: value })

export const box = (
  variant: 'analogy' | 'mistake' | 'keypoint' | 'example',
  label: Localized,
  value: Localized,
): Block => ({ type: 'box', variant, label, html: value })

export const objectives = (items: Localized[], label = L('You will learn', 'ستتعلم')): Block => ({
  type: 'objectives',
  label,
  items,
})

export const takeaways = (items: Localized[], label = L('Key takeaways', 'أهم النقاط')): Block => ({
  type: 'takeaways',
  label,
  items,
})

export const table = (headers: Localized[], rows: Localized[][]): Block => ({ type: 'table', headers, rows })

export const formula = (eq: string, note: Localized): Block => ({ type: 'formula', eq, note })

/** A picture (`src` root-absolute under public/, e.g. '/diagrams/inflation.svg'). Keep words out of the image: numbers only, with the
 *  title, caption and alt text here so they follow the reader's language. It shares a card with the text before it. */
export const diagram = (d: { fig: Localized; title: Localized; src: string; alt: Localized; caption: Localized }): Block => ({ type: 'diagram', ...d })

export const exercise = (questionId: string): Block => ({ type: 'exercise', questionId })

/** The one idea to remember from a lesson; put it after the content, before the lesson's questions. */
export const keyIdea = (value: Localized): Block => ({ type: 'keyIdea', html: value })

/** A "try it" calculator card: sliders for years and yearly return, and what 1,000 grows to. */
export const compoundCalculator: Block = { type: 'calculator', kind: 'compound' }

/** Forces a new lesson card here (cards are otherwise cut automatically). */
export const cardBreak: Block = { type: 'cardBreak' }

/** A section; `label` is the small kicker ("Part 1"), `nav` the sidebar text. */
export const section = (s: {
  id: string
  label: Localized
  nav: Localized
  title: Localized
  standfirst?: Localized
  time?: Localized
  /** Fixed roadmap lesson ids (see `Section.lessonIds`) */
  lessons?: string[]
  blocks: Block[]
}): Section => ({
  id: s.id,
  navLabel: s.nav,
  sectionLabel: s.label,
  timeEst: s.time,
  headingHtml: heading(s.title, s.standfirst),
  blocks: s.blocks,
  ...(s.lessons ? { lessonIds: s.lessons } : {}),
})

/** Multiple-choice question with stable id `<prefix>-qNNN`; `answer` is the index into `options`. */
export function mcq(
  prefix: string,
  moduleId: string,
  n: number,
  topic: string,
  prompt: Localized,
  options: Localized[],
  answer: number,
  /** Why the answer is right, shown after the learner checks */
  explain?: Localized,
): Question {
  return { id: `${prefix}-q${String(n).padStart(3, '0')}`, moduleId, topic, prompt, options, answer, ...(explain ? { explain } : {}) }
}
