// What a guest (not signed in, with accounts available) may open. Pure: the screens and the tests share it.

/** Guests get this many lessons, in path order, before they need a free account. */
export const FREE_LESSONS = 3

/** `module/lesson` keys of a course's lessons in path order, from its chapters. */
export const lessonOrder = (chapters: { id: string; lessons: { id: string }[] }[]) => chapters.flatMap((c) => c.lessons.map((l) => `${c.id}/${l.id}`))

/** Whether a lesson is open: everything is for members (and when there are no accounts at all); a guest gets the first
 *  FREE_LESSONS of the course. */
export function canOpenLesson(order: string[], moduleId: string, lessonId: string, guest: boolean): boolean {
  if (!guest) return true
  const i = order.indexOf(`${moduleId}/${lessonId}`)
  return i >= 0 && i < FREE_LESSONS
}

/** Unit reviews (quiz-only practice) are for members. */
export const canOpenPractice = (guest: boolean) => !guest
