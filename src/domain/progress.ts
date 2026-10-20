// Learner progress: the shape, how it is read from saved text, and every rule that changes it (streaks, the play-money
// bank, spaced review, streak freezes, activity). Pure functions only: no React, no storage, no clock unless passed in, so
// everything here is unit-tested directly. Saving and subscribing live in src/state/progress.ts.

import { lessonPayout, START_BANK, PAY_PER_CORRECT } from './money'

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
  /** The play-money bank: starts at START_BANK and grows by lesson payouts (src/domain/money.ts) */
  bank: number
  streak: Streak
  /** questionId -> Leitner box (1 = shaky … MAX_BOX = known); lessons favour low boxes */
  boxes: Record<string, number>
  /** `${courseId}/${moduleId}/${lessonId}` of every finished roadmap lesson (see src/domain/lessons.ts) */
  lessonsDone: string[]
  /** Key of the roadmap lesson finished most recently: Home's "Continue" starts from the lesson after it */
  lastLesson?: string
  /** Dollars earned per local day ('YYYY-MM-DD'), last ACTIVITY_DAYS days: the week strips. A day with a finished
   *  lesson is present even when it paid nothing (a replay). */
  activity: Record<string, number>
  /** Roadmap lessons finished with every question right on the first finish (the "Quiz ace" milestone) */
  perfect: number
  /** Streak freezes in hand (0 … MAX_FREEZES): each covers one missed day, so the streak survives it. A perfect
   *  lesson earns one. */
  freezes: number
}

/** Nothing learned yet. Also what unreadable saved text parses to. */
export const emptyProgress: Progress = {
  answers: {},
  sectionsRead: {},
  bank: START_BANK,
  streak: { count: 0, lastDay: '' },
  boxes: {},
  lessonsDone: [],
  activity: {},
  perfect: 0,
  freezes: 0,
}

export const MAX_BOX = 5
/** Streak freezes you can hold at once */
export const MAX_FREEZES = 2

const isRecord = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v)

/** Reads saved progress. Also the v1 → v2 migration: v1 counted XP; v2 counts dollars, so a player who has none
 *  yet gets the starting bank plus $10 for every question they have answered right, and the XP is dropped. Their
 *  per-day activity keeps its days (the numbers stay as they were: only the days and their relative heights show). */
export function parseProgress(raw: string | null): Progress {
  if (!raw) return emptyProgress
  try {
    const data = JSON.parse(raw) as Record<string, unknown>
    const answers = isRecord(data.answers) ? (data.answers as Progress['answers']) : {}
    const bank =
      typeof data.bank === 'number' && Number.isFinite(data.bank)
        ? data.bank
        : START_BANK + PAY_PER_CORRECT * Object.values(answers).filter((a) => a?.correct === true).length
    const streak: Record<string, unknown> = isRecord(data.streak) ? data.streak : {}
    return {
      answers,
      sectionsRead: isRecord(data.sectionsRead) ? (data.sectionsRead as Progress['sectionsRead']) : {},
      bank,
      streak: {
        count: typeof streak.count === 'number' ? streak.count : 0,
        lastDay: typeof streak.lastDay === 'string' ? streak.lastDay : '',
      },
      boxes: isRecord(data.boxes) ? (data.boxes as Progress['boxes']) : {},
      lessonsDone: Array.isArray(data.lessonsDone) ? data.lessonsDone.filter((k) => typeof k === 'string') : [],
      ...(typeof data.lastLesson === 'string' ? { lastLesson: data.lastLesson } : {}),
      activity: isRecord(data.activity) ? (data.activity as Progress['activity']) : {},
      perfect: typeof data.perfect === 'number' && data.perfect > 0 ? Math.floor(data.perfect) : 0,
      freezes: typeof data.freezes === 'number' && data.freezes > 0 ? Math.min(MAX_FREEZES, Math.floor(data.freezes)) : 0,
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

/** The streak to show on `today`: it survives until the end of the day after the last lesson, and one more day for
 *  each streak freeze in hand (they are spent when the next lesson is finished). */
export function currentStreak(streak: Streak, today: string, freezes = 0): number {
  const gap = daysBetween(streak.lastDay, today)
  return gap >= 0 && gap <= 1 + freezes ? streak.count : 0
}

/** Days missed since the last lesson (0 when it was today or yesterday). */
const missedDays = (streak: Streak, today: string) => Math.max(0, daysBetween(streak.lastDay, today) - 1)

/** Streak after finishing a lesson on `today`: same day keeps it, next day extends it, a gap restarts it. */
export function bumpStreak(streak: Streak, today: string): Streak {
  const gap = daysBetween(streak.lastDay, today)
  if (gap === 0) return streak
  return { count: gap === 1 ? streak.count + 1 : 1, lastDay: today }
}

/** Leitner step: a right answer moves the question up a box, a wrong one sends it back to box 1. */
export function recordReview(p: Progress, questionId: string, correct: boolean): Progress {
  const box = p.boxes[questionId] ?? 0
  return { ...p, boxes: { ...p.boxes, [questionId]: correct ? Math.min(box + 1, MAX_BOX) : 1 } }
}

/** What finishing a lesson pays: $10 per correct answer, and only the first time that roadmap lesson is finished
 *  (replays and practice runs pay nothing, so they can't be farmed). */
export function payoutFor(p: Progress, correct: number, lessonKey?: string): number {
  return lessonKey && !p.lessonsDone.includes(lessonKey) ? lessonPayout(correct) : 0
}

/** Freezes a lesson finished on `today` spends: one per missed day, when there are enough to cover them all. */
export function freezesSpent(p: Progress, today: string): number {
  const missed = p.streak.lastDay ? missedDays(p.streak, today) : 0
  return missed > 0 && missed <= p.freezes ? missed : 0
}

/** Pay a finished lesson into the bank, count `today` towards the streak and mark the roadmap lesson (if given) done. */
export function completeLesson(p: Progress, correct: number, today: string, lessonKey?: string, total = 0): Progress {
  const lessonsDone = lessonKey && !p.lessonsDone.includes(lessonKey) ? [...p.lessonsDone, lessonKey] : p.lessonsDone
  const payout = payoutFor(p, correct, lessonKey)
  // Missed days covered by freezes keep the streak going (one freeze per missed day); otherwise it restarts.
  const spent = freezesSpent(p, today)
  const streak = spent > 0 ? { count: p.streak.count + 1, lastDay: today } : bumpStreak(p.streak, today)
  const perfectNow = lessonKey && lessonsDone !== p.lessonsDone && total > 0 && correct === total ? 1 : 0
  return {
    ...p,
    bank: p.bank + payout,
    streak,
    lessonsDone,
    lastLesson: lessonKey ?? p.lastLesson,
    activity: addActivity(p.activity, today, payout),
    perfect: p.perfect + perfectNow,
    freezes: Math.min(MAX_FREEZES, p.freezes - spent + perfectNow),
  }
}

/** Did finishing this lesson on `today` earn a streak freeze? Freezes it spent on missed days make room first.
 *  (For the Lesson complete screen.) */
export const earnedFreeze = (before: Progress, after: Progress, today: string) =>
  after.perfect > before.perfect && before.freezes - freezesSpent(before, today) < MAX_FREEZES

/** Days of per-day earnings kept for the week strip; older days are dropped. */
export const ACTIVITY_DAYS = 60

/** Adds dollars to `today` (the day is recorded even for 0) and drops days more than ACTIVITY_DAYS old. */
export function addActivity(activity: Record<string, number>, today: string, dollars: number): Record<string, number> {
  const next: Record<string, number> = {}
  for (const [day, value] of Object.entries(activity)) {
    if (daysBetween(day, today) < ACTIVITY_DAYS) next[day] = value
  }
  next[today] = (next[today] ?? 0) + dollars
  return next
}

/** The last seven days (today included) from the per-day activity: days with a finished lesson, and play money earned. */
export function weekSummary(activity: Record<string, number>, today: string): { days: number; earned: number } {
  const recent = Object.entries(activity).filter(([day]) => {
    const gap = daysBetween(day, today)
    return gap >= 0 && gap < 7
  })
  return { days: recent.length, earned: recent.reduce((n, [, v]) => n + v, 0) }
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
