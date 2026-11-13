import { completeLesson, localDay, recordAnswer, recordReview, visitPortfolio } from '../domain/progress'
import { claimChest } from '../domain/quests'
import { progressStore } from './progress'
import { useStore } from './useStore'

const { update, reset } = progressStore

export function useProgress() {
  const progress = useStore(progressStore)
  return {
    progress,
    recordAnswer: (questionId: string, selected: number, correct: boolean) =>
      update((p) => recordAnswer(p, questionId, selected, correct)),
    /** A lesson answer: saved like a quick-check answer, and moves the question's Leitner box. */
    recordLessonAnswer: (questionId: string, selected: number, correct: boolean) =>
      update((p) => recordReview(recordAnswer(p, questionId, selected, correct), questionId, correct, localDay())),
    completeLesson: (correct: number, lessonKey?: string, total?: number, seconds?: number) =>
      update((p) => completeLesson(p, correct, localDay(), lessonKey, total, seconds)),
    visitPortfolio: () => update((p) => visitPortfolio(p, localDay())),
    /** Open today's chest (every quest done): pays its play money once. `ctx` is what the quests depend on. */
    claimChest: (ctx: { portfolio: boolean; goalSeconds: number }) => update((p) => claimChest(p, localDay(), ctx)),
    reset,
  }
}
