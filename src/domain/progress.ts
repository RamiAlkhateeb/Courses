// Learner progress: the shape, how it is read from saved text, and every rule that changes it (streaks, XP,
// spaced review, rest day, activity). Pure functions only: no React, no storage, no clock unless passed in, so
// everything here is unit-tested directly. Saving and subscribing live in src/state/progress.ts.

export interface Streak {
  /** Consecutive days with at least one finished lesson, as of `lastDay` */
  count: number
  /** Local date of the latest finished lesson, 'YYYY-MM-DD' ('' = never) */
  lastDay: string
}

export interface Progress {
  /** questionId -> the option the reader picked on their latest check */
  answers: Record<string, { selected: number; correct: boolean }>
  /** `${courseId}/${moduleId}` -> section ids scrolled into view */
  sectionsRead: Record<string, string[]>
  /** Total XP earned from lessons */
  xp: number
  streak: Streak
  /** questionId -> Leitner box (1 = shaky … MAX_BOX = known); lessons favour low boxes */
  boxes: Record<string, number>
  /** `${courseId}/${moduleId}/${lessonId}` of every finished roadmap lesson (see src/domain/lessons.ts) */
  lessonsDone: string[]
  /** Key of the roadmap lesson finished most recently: Home's "Continue" starts from the lesson after it */
  lastLesson?: string
  /** XP earned per local day ('YYYY-MM-DD'), last ACTIVITY_DAYS days: Home's week strip */
  activity: Record<string, number>
}

/** Nothing learned yet. Also what unreadable saved text parses to. */
export const emptyProgress: Progress = {
  answers: {},
  sectionsRead: {},
  xp: 0,
  streak: { count: 0, lastDay: '' },
  boxes: {},
  lessonsDone: [],
  activity: {},
}

export const MAX_BOX = 5
/** For finishing any lesson, so a reading-only lesson still counts. */
export const LESSON_BASE_XP = 5
export const XP_PER_CORRECT = 10
export const XP_PERFECT_BONUS = 20

const isRecord = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v)

export function parseProgress(raw: string | null): Progress {
  if (!raw) return emptyProgress
  try {
    const data = JSON.parse(raw) as Record<string, unknown>
    const streak: Record<string, unknown> = isRecord(data.streak) ? data.streak : {}
    return {
      answers: isRecord(data.answers) ? (data.answers as Progress['answers']) : {},
      sectionsRead: isRecord(data.sectionsRead) ? (data.sectionsRead as Progress['sectionsRead']) : {},
      xp: typeof data.xp === 'number' ? data.xp : 0,
      streak: {
        count: typeof streak.count === 'number' ? streak.count : 0,
        lastDay: typeof streak.lastDay === 'string' ? streak.lastDay : '',
      },
      boxes: isRecord(data.boxes) ? (data.boxes as Progress['boxes']) : {},
      lessonsDone: Array.isArray(data.lessonsDone) ? data.lessonsDone.filter((k) => typeof k === 'string') : [],
      ...(typeof data.lastLesson === 'string' ? { lastLesson: data.lastLesson } : {}),
      activity: isRecord(data.activity) ? (data.activity as Progress['activity']) : {},
    }
  } catch {
    return emptyProgress
  }
}

export const recordAnswer = (p: Progress, questionId: string, selected: number, correct: boolean): Progress => ({
  ...p,
  answers: { ...p.answers, [questionId]: { selected, correct } },
})

export function markRead(p: Progress, moduleKey: string, sectionId: string): Progress {
  const read = p.sectionsRead[moduleKey] ?? []
  if (read.includes(sectionId)) return p
  return { ...p, sectionsRead: { ...p.sectionsRead, [moduleKey]: [...read, sectionId] } }
}

/** Local calendar day as 'YYYY-MM-DD' (the streak follows the reader's own midnight, not UTC). */
export function localDay(date: Date = new Date()): string {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

/** Whole days from `from` to `to` (both 'YYYY-MM-DD'); NaN if either is empty or malformed. */
export function daysBetween(from: string, to: string): number {
  const toUtc = (day: string) => {
    const [y, m, d] = day.split('-').map(Number)
    return Date.UTC(y, m - 1, d)
  }
  return Math.round((toUtc(to) - toUtc(from)) / 86_400_000)
}

/** The streak to show on `today`: it survives until the end of the day after the last lesson. */
export function currentStreak(streak: Streak, today: string): number {
  const gap = daysBetween(streak.lastDay, today)
  return gap === 0 || gap === 1 ? streak.count : 0
}

/** The weekly rest day: pretends the last lesson was yesterday, so today's lesson extends the streak instead of restarting it. */
export function applyRestDay(p: Progress, today: string): Progress {
  const [y, m, d] = today.split('-').map(Number)
  return { ...p, streak: { ...p.streak, lastDay: localDay(new Date(y, m - 1, d - 1)) } }
}

/** Monday of `day`'s week, 'YYYY-MM-DD': the rest day resets on it. */
export function weekStart(day: string): string {
  const [y, m, d] = day.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  return localDay(new Date(y, m - 1, d - ((date.getDay() + 6) % 7)))
}

/** Streak after finishing a lesson on `today`: same day keeps it, next day extends it, a gap restarts it. */
export function bumpStreak(streak: Streak, today: string): Streak {
  const gap = daysBetween(streak.lastDay, today)
  if (gap === 0) return streak
  return { count: gap === 1 ? streak.count + 1 : 1, lastDay: today }
}

export const lessonXp = (correct: number, total: number) =>
  LESSON_BASE_XP + correct * XP_PER_CORRECT + (total > 0 && correct === total ? XP_PERFECT_BONUS : 0)

/** Leitner step: a right answer moves the question up a box, a wrong one sends it back to box 1. */
export function recordReview(p: Progress, questionId: string, correct: boolean): Progress {
  const box = p.boxes[questionId] ?? 0
  return { ...p, boxes: { ...p.boxes, [questionId]: correct ? Math.min(box + 1, MAX_BOX) : 1 } }
}

/** Award a finished lesson's XP, count `today` towards the streak and mark the roadmap lesson (if given) done. */
export function completeLesson(
  p: Progress,
  correct: number,
  total: number,
  today: string,
  lessonKey?: string,
): Progress {
  const lessonsDone = lessonKey && !p.lessonsDone.includes(lessonKey) ? [...p.lessonsDone, lessonKey] : p.lessonsDone
  const xp = lessonXp(correct, total)
  return {
    ...p,
    xp: p.xp + xp,
    streak: bumpStreak(p.streak, today),
    lessonsDone,
    lastLesson: lessonKey ?? p.lastLesson,
    activity: addActivity(p.activity, today, xp),
  }
}

/** Days of per-day XP kept for the week strip; older days are dropped. */
export const ACTIVITY_DAYS = 60

/** Adds XP to `today` and drops days more than ACTIVITY_DAYS old. */
export function addActivity(activity: Record<string, number>, today: string, xp: number): Record<string, number> {
  const next: Record<string, number> = {}
  for (const [day, value] of Object.entries(activity)) {
    if (daysBetween(day, today) < ACTIVITY_DAYS) next[day] = value
  }
  next[today] = (next[today] ?? 0) + xp
  return next
}

/** Ids of the questions whose latest answer was wrong, in the given order: "Review mistakes". */
export const mistakes = (questionIds: string[], answers: Progress['answers']) =>
  questionIds.filter((id) => answers[id]?.correct === false)

/** Up to `size` question ids for a lesson: never-seen and low-box questions first, ties shuffled. */
export function pickLessonQuestions(
  ids: string[],
  boxes: Record<string, number>,
  size: number,
  random: () => number = Math.random,
): string[] {
  return ids
    .map((id) => ({ id, box: boxes[id] ?? 0, tie: random() }))
    .sort((a, b) => a.box - b.box || a.tie - b.tie)
    .slice(0, size)
    .map((q) => q.id)
}
