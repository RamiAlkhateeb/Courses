// Levels: a title that grows with learning. Points come from finished lessons and right answers (never from money or
// simulator returns). Pure rules; Me shows the level and Lesson complete celebrates a new one.
import type { Progress } from './progress'

/** Points for each finished roadmap lesson, and for each question whose latest answer is right */
export const POINTS_PER_LESSON = 10
export const POINTS_PER_RIGHT = 1

/** Points where each level starts (level 1 at 0). The titles are UI strings: `level_1` … `level_6`. */
export const LEVELS = [0, 40, 110, 200, 310, 440]

export const levelPoints = (p: Pick<Progress, 'lessonsDone' | 'answers'>) =>
  p.lessonsDone.length * POINTS_PER_LESSON + Object.values(p.answers).filter((a) => a?.correct === true).length * POINTS_PER_RIGHT

export interface Level {
  /** 1 … LEVELS.length */
  level: number
  points: number
  /** Where this level starts, and where the next one does (null at the top) */
  from: number
  to: number | null
}

export function levelFor(points: number): Level {
  let level = 1
  LEVELS.forEach((from, i) => {
    if (points >= from) level = i + 1
  })
  return { level, points, from: LEVELS[level - 1], to: LEVELS[level] ?? null }
}

/** The level `after` reached, if it is higher than `before`'s (for the level-up moment), else null. */
export function levelUp(before: Pick<Progress, 'lessonsDone' | 'answers'>, after: Pick<Progress, 'lessonsDone' | 'answers'>): number | null {
  const a = levelFor(levelPoints(before)).level
  const b = levelFor(levelPoints(after)).level
  return b > a ? b : null
}
