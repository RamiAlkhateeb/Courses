import { completeLesson, localDay, markRead, recordAnswer, recordReview } from '../domain/progress'
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
      update((p) => recordReview(recordAnswer(p, questionId, selected, correct), questionId, correct)),
    completeLesson: (correct: number, lessonKey?: string) => update((p) => completeLesson(p, correct, localDay(), lessonKey)),
    markRead: (moduleKey: string, sectionId: string) => update((p) => markRead(p, moduleKey, sectionId)),
    reset,
  }
}
