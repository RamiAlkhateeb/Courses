import { createPersistedStore } from './createPersistedStore'

/** Where the learner is in an unfinished lesson, so leaving (✕, a closed tab) and coming back carries on from the same
 *  step with the same answers. One lesson at a time, on this device only; cleared when the lesson is finished. */
export interface LessonRun {
  /** `course/module/lesson` */
  key: string
  /** The step they were on */
  index: number
  /** Each answered question step: its first-try result, the choice, and whether it is settled (see CardRun) */
  answers: Record<number, { first: boolean; selected: number; settled: boolean }>
}

function parse(raw: string | null): LessonRun | null {
  try {
    const d = JSON.parse(raw ?? 'null') as Partial<LessonRun> | null
    if (!d || typeof d.key !== 'string' || typeof d.index !== 'number' || typeof d.answers !== 'object' || d.answers === null) return null
    return { key: d.key, index: Math.max(0, Math.floor(d.index)), answers: d.answers }
  } catch {
    return null
  }
}

export const lessonRunStore = createPersistedStore<LessonRun | null>({ key: 'lessonRun:v1', empty: null, parse })

export const saveLessonRun = (run: LessonRun) => lessonRunStore.update(() => run)
/** Forget the saved place of `key` (the lesson was finished). */
export const clearLessonRun = (key: string) => lessonRunStore.update((r) => (r?.key === key ? null : r))
