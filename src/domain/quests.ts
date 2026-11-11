// Daily quests: three small things to do today, the same for everyone on a given day, and a chest of play money for
// doing all three. Pure: the day, today's counters (Progress.daily) and the goal are passed in. Play money only:
// the chest is a study reward, never a prize with real value.
import { addActivity, dailyFor, studiedToday, type Daily, type Progress } from './progress'

export type QuestId = 'lesson' | 'lesson2' | 'correct5' | 'perfect' | 'goal' | 'portfolio'

/** Quests picked from each day, besides "finish a lesson" (which is there every day) */
const POOL: QuestId[] = ['correct5', 'perfect', 'lesson2', 'goal', 'portfolio']
export const QUESTS_PER_DAY = 3

/** A small stable number from a day string (so a day's quests and chest are the same for everyone, and testable). */
function dayHash(day: string): number {
  let h = 2166136261
  for (const c of day) h = Math.imul(h ^ c.charCodeAt(0), 16777619)
  return h >>> 0
}

export interface QuestContext {
  /** Can the learner open the portfolio yet? Without it the portfolio quest is never picked. */
  portfolio: boolean
  /** The daily goal, in seconds */
  goalSeconds: number
}

/** Today's quests: "finish a lesson", then two more from the pool, chosen by the day. */
export function questsFor(day: string, ctx: Pick<QuestContext, 'portfolio'>): QuestId[] {
  const pool = POOL.filter((q) => q !== 'portfolio' || ctx.portfolio)
  const start = dayHash(day) % pool.length
  const rotated = [...pool.slice(start), ...pool.slice(0, start)]
  return ['lesson', ...rotated.slice(0, QUESTS_PER_DAY - 1)]
}

/** How far a quest is: `value` of `target` (capped), and whether it is done. */
export function questProgress(id: QuestId, daily: Daily, studied: number, goalSeconds: number): { value: number; target: number; done: boolean } {
  const of = (value: number, target: number) => ({ value: Math.min(value, target), target, done: value >= target })
  switch (id) {
    case 'lesson':
      return of(daily.lessons, 1)
    case 'lesson2':
      return of(daily.lessons, 2)
    case 'correct5':
      return of(daily.correct, 5)
    case 'perfect':
      return of(daily.perfect, 1)
    case 'goal':
      return of(Math.floor(studied / 60), Math.max(1, Math.round(goalSeconds / 60)))
    case 'portfolio':
      return of(daily.portfolio ? 1 : 0, 1)
  }
}

/** Play money in a day's chest: $5 to $25 in steps of 5, decided by the day. */
export const chestAmount = (day: string) => 5 + (dayHash(`chest:${day}`) % 5) * 5

/** Today's quests with their progress, and the chest: ready when every quest is done and it was not opened yet. */
export function questsToday(p: Progress, today: string, ctx: QuestContext) {
  const daily = dailyFor(p, today)
  const quests = questsFor(today, ctx).map((id) => ({ id, ...questProgress(id, daily, studiedToday(p, today), ctx.goalSeconds) }))
  const allDone = quests.every((q) => q.done)
  return { quests, allDone, claimed: daily.claimed, chestReady: allDone && !daily.claimed, chest: chestAmount(today) }
}

/** Open today's chest: its play money goes into the bank, once. Nothing happens unless every quest is done. */
export function claimChest(p: Progress, today: string, ctx: QuestContext): Progress {
  const { chestReady, chest } = questsToday(p, today, ctx)
  if (!chestReady) return p
  return {
    ...p,
    bank: p.bank + chest,
    activity: addActivity(p.activity, today, chest),
    daily: { ...dailyFor(p, today), claimed: true },
    // The first chest ever opened is a badge (src/domain/badges.ts), saved here so it can't be missed
    badges: p.badges.chest ? p.badges : { ...p.badges, chest: today },
  }
}
