import { useSyncExternalStore } from 'react'
import { applyRestDay, completeLesson, getSnapshot, localDay, markRead, recordAnswer, recordReview, reset, subscribe, update } from './store'

export function useProgress() {
  const progress = useSyncExternalStore(subscribe, getSnapshot)
  return {
    progress,
    recordAnswer: (questionId: string, selected: number, correct: boolean) =>
      update((p) => recordAnswer(p, questionId, selected, correct)),
    /** A lesson answer: saved like a quick-check answer, and moves the question's Leitner box. */
    recordLessonAnswer: (questionId: string, selected: number, correct: boolean) =>
      update((p) => recordReview(recordAnswer(p, questionId, selected, correct), questionId, correct)),
    completeLesson: (correct: number, total: number, lessonKey?: string) =>
      update((p) => completeLesson(p, correct, total, localDay(), lessonKey)),
    markRead: (moduleKey: string, sectionId: string) => update((p) => markRead(p, moduleKey, sectionId)),
    takeRestDay: () => update((p) => applyRestDay(p, localDay())),
    reset,
  }
}
