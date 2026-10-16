import type { Block, Localized, Question, Module } from '../content/types'
import { blockWords, stripTags, toCards, wordCount } from './chunks'

/** Most content cards in one lesson; a longer section is split into balanced parts. */
export const MAX_CARDS = 7

export type CardStep =
  | {
      kind: 'content'
      sectionId: string
      /** On a lesson's first card: kicker ("Step 1"), plus the section's `<h2>` markup on its first part. */
      heading?: { label: Localized; html?: Localized }
      blocks: Block[]
    }
  | { kind: 'question'; sectionId: string; question: Question }

/** One roadmap node: a short run of small cards from one section, then the questions on what it taught. */
export interface Lesson {
  /** Stable within the module: the section id, or `${sectionId}-${part}` when the section is split. */
  id: string
  sectionId: string
  /** 1-based part of the section, and how many parts it has. */
  part: number
  parts: number
  title: Localized
  steps: CardStep[]
}

/** Every lesson of a module, in reading order. */
export function lessonsFor(mod: Module): Lesson[] {
  const lessons: Lesson[] = []
  for (const section of mod.sections) {
    const { cards, exercises } = toCards(section.blocks)
    if (cards.length === 0) cards.push([]) // heading-only section: still one card to show the heading
    const fixed = section.lessonIds
    const parts = fixed?.length || Math.ceil(cards.length / MAX_CARDS)
    const size = Math.max(1, Math.ceil(cards.length / parts)) // balanced, e.g. 9 cards → 5 + 4, not 7 + 2
    const partOf = (card: number) => Math.min(Math.floor(Math.max(card, 0) / size), parts - 1)

    for (let p = 0; p < parts; p++) {
      const steps: CardStep[] = cards.slice(p * size, (p + 1) * size).map((blocks, i) => ({
        kind: 'content' as const,
        sectionId: section.id,
        heading: i > 0 ? undefined : { label: section.sectionLabel, html: p === 0 ? section.headingHtml : undefined },
        blocks,
      }))
      for (const ex of exercises) {
        if (partOf(ex.afterCard) !== p) continue
        const question = mod.questions.find((q) => q.id === ex.questionId)
        if (question) steps.push({ kind: 'question', sectionId: section.id, question })
      }
      lessons.push({
        id: fixed ? fixed[p]! : parts === 1 ? section.id : `${section.id}-${p + 1}`,
        sectionId: section.id,
        part: p + 1,
        parts,
        title: section.navLabel,
        steps,
      })
    }
  }
  return lessons
}

/** Progress key of a lesson (see `lessonsDone` in src/domain/progress.ts). */
export const lessonKey = (courseId: string, moduleId: string, lessonId: string) => `${courseId}/${moduleId}/${lessonId}`

/** URL of a roadmap lesson (the quiz-only practice run is `practiceHref` in src/content/courses.ts). */
export const learnHref = (courseId: string, moduleId: string, lessonId: string) =>
  `/course/${courseId}/${moduleId}/learn/${lessonId}`

const strip = stripTags
const words = wordCount

/** Estimated minutes for a lesson: reading at ~200 words/min plus half a minute per question; at least 1. */
export function lessonMinutes(lesson: Lesson): number {
  let reading = 0
  let questions = 0
  for (const step of lesson.steps) {
    if (step.kind === 'question') questions++
    else reading += step.blocks.reduce((n, b) => n + blockWords(b), 0) + (step.heading?.html ? words(strip(step.heading.html.en)) : 0)
  }
  return Math.max(1, Math.ceil(reading / 200 + questions * 0.5))
}

export const moduleMinutes = (lessons: Lesson[]) => lessons.reduce((n, l) => n + lessonMinutes(l), 0)

export type Recap = { kind: 'takeaways' | 'terms'; items: Localized[] }

/** "What you learned" for a lesson's summary: its takeaways block if it has one, otherwise up to 6 key terms
 *  (the bold phrases of its cards, English and Arabic matched in order, deduplicated). Null if neither. */
export function lessonRecap(lesson: Lesson): Recap | null {
  for (const step of lesson.steps) {
    if (step.kind !== 'content') continue
    for (const block of step.blocks) if (block.type === 'takeaways') return { kind: 'takeaways', items: block.items }
  }
  const terms = lessonTerms(lesson)
  return terms.length ? { kind: 'terms', items: terms.slice(0, 6) } : null
}

/** The key terms of a lesson: bold phrases of its cards, English and Arabic matched in order, deduplicated. */
export function lessonTerms(lesson: Lesson): Localized[] {
  const terms: Localized[] = []
  const seen = new Set<string>()
  for (const step of lesson.steps) {
    if (step.kind !== 'content') continue
    for (const block of step.blocks) {
      if (block.type !== 'html' && block.type !== 'box') continue
      const en = boldTerms(block.html.en)
      const ar = block.html.ar ? boldTerms(block.html.ar) : en
      if (ar.length !== en.length) continue // can't pair them up safely
      en.forEach((term, i) => {
        const key = term.toLowerCase()
        if (term.length > 40 || !/\p{L}{3}/u.test(term) || seen.has(key)) return
        seen.add(key)
        terms.push({ en: term, ar: ar[i] })
      })
    }
  }
  return terms
}

const boldTerms = (html: string) =>
  [...html.matchAll(/<strong>(.*?)<\/strong>/g)].map((m) => strip(m[1]).replace(/\s+/g, ' ').trim()).filter(Boolean)

/** Where "Continue" goes in a course: the first unfinished lesson of the first chapter already started but not
 *  finished, else of the first chapter not finished. `mods` holds the loaded modules, in course order. */
export function nextInCourse(
  courseId: string,
  mods: Module[],
  lessonsDone: string[],
): { mod: Module; lesson: Lesson } | null {
  const chapters = mods.map((mod) => {
    const lessons = lessonsFor(mod)
    const done = lessons.filter((l) => lessonsDone.includes(lessonKey(courseId, mod.id, l.id)))
    return { mod, lessons, done: done.length }
  })
  const pick = chapters.find((c) => c.done > 0 && c.done < c.lessons.length) ?? chapters.find((c) => c.done < c.lessons.length)
  if (!pick) return null
  const lesson = pick.lessons.find((l) => !lessonsDone.includes(lessonKey(courseId, pick.mod.id, l.id)))!
  return { mod: pick.mod, lesson }
}

/** "≈ 25 min" or "≈ 1 h 40 min". */
export function formatDuration(minutes: number, tUi: (key: 'minutes' | 'hoursMinutes' | 'hours', opts: Record<string, number>) => string) {
  if (minutes < 60) return tUi('minutes', { n: minutes })
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m ? tUi('hoursMinutes', { h, m }) : tUi('hours', { h })
}
