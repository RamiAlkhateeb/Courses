export type Lang = 'en' | 'ar'

/** Text with an English original and an Arabic translation; ar falls back to en. */
export interface Localized {
  en: string
  ar?: string
}

export interface Question {
  /** Stable ID, e.g. "w01-q003". Never change once shipped: progress rows reference it. */
  id: string
  moduleId: string
  topic?: string
  prompt: Localized
  options: Localized[]
  /** Index into `options` */
  answer: number
  /** Why the answer is right, shown on the result card after a check */
  explain?: Localized
}

export type Block =
  | { type: 'html'; html: Localized }
  | { type: 'objectives'; label: Localized; items: Localized[] }
  | { type: 'takeaways'; label: Localized; items: Localized[] }
  | { type: 'box'; variant: 'analogy' | 'mistake' | 'keypoint' | 'example'; label: Localized; html: Localized }
  | { type: 'code'; code: string; lang?: string }
  | { type: 'diagram'; fig: Localized; title: Localized; src: string; alt: Localized; caption: Localized }
  | { type: 'exercise'; questionId: string }
  | { type: 'formula'; eq: string; note: Localized }
  | { type: 'table'; headers: Localized[]; rows: Localized[][] }
  | { type: 'tabs'; tabs: { label: Localized; blocks: Block[] }[] }
  /** Lessons only: forces a new card here (cards are otherwise cut automatically, see
   *  src/domain/chunks.ts). The one-page view ignores it. */
  | { type: 'cardBreak' }
  /** The one idea to remember from a lesson: its own card, just before the questions */
  | { type: 'keyIdea'; html: Localized }
  /** A "try it" calculator; `compound` shows what a starting amount grows to */
  | { type: 'calculator'; kind: 'compound' }
  /** A hands-on task in the live market simulator (the Playground): its own card; the lesson moves on once it is done
   *  (src/domain/playground/practice.ts) */
  | { type: 'practice'; task: PracticeTask }

/** The simulator tasks a practice lesson can set (checked by `practiceDone` in src/domain/playground/practice.ts). */
export type PracticeTask = 'first-buy' | 'spread' | 'rebalance' | 'income' | 'auto' | 'goal'

export interface Section {
  id: string
  /** Short sidebar label, e.g. "Choosing your sample" (vs. the fuller <h2> text in headingHtml) */
  navLabel: Localized
  sectionLabel: Localized
  timeEst?: Localized
  /** Heading + standfirst markup, e.g. "<h2>...</h2><p class='standfirst'>...</p>" */
  headingHtml: Localized
  blocks: Block[]
  /** The roadmap lesson ids this section is cut into, fixed by the author. Finished lessons are saved by id, so
   *  with this set, editing the text never moves or drops a learner's ✓: the number of lessons is the number of
   *  ids and the cards are shared out between them. Without it, ids come from how the cards happen to split. */
  lessonIds?: string[]
}

/** One module of a course (the type keeps its original "Module" name; a course is free to call them modules). */
export interface Module {
  id: string
  courseId: string
  order: number
  cover: {
    kicker: Localized
    titleHtml: Localized
    timeEstimate: Localized
  }
  sections: Section[]
  questions: Question[]
}
