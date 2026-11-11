// Activity steps inside a lesson: guess first (predict), what would you do (choice), sort, and myth or fact. None is
// scored or pays; they make the learner commit before the lesson explains. The lesson's Next waits until the activity
// on the step is answered (first run only). Pure rules; the UI is src/components/content/Activity.tsx.
import type { Block } from '../content/types'

export type ActivityBlock = Extract<Block, { type: 'predict' | 'choice' | 'sort' | 'myth' }>

export const ACTIVITY_TYPES = new Set<Block['type']>(['predict', 'choice', 'sort', 'myth'])

export const isActivity = (b: Block): b is ActivityBlock => ACTIVITY_TYPES.has(b.type)

/** The activity on a card, if any (a card holds at most one). */
export const activityIn = (blocks: Block[]): ActivityBlock | undefined => blocks.find(isActivity)

/** How close a guess was: the right option, the one next to it, or further off. */
export type Verdict = 'exact' | 'close' | 'far'
export function predictVerdict(pick: number, answer: number): Verdict {
  const gap = Math.abs(pick - answer)
  return gap === 0 ? 'exact' : gap === 1 ? 'close' : 'far'
}

/** Sort: how many items are placed, how many of those are right, and whether every item is placed. */
export function sortTally(items: { bucket: 0 | 1 }[], picks: Record<number, 0 | 1>) {
  const placed = Object.keys(picks).length
  const right = items.filter((item, i) => picks[i] === item.bucket).length
  return { placed, right, total: items.length, done: placed === items.length }
}

/** Myth or fact: was the tap right? (`pickedFact` true = the learner said "fact") */
export const mythRight = (pickedFact: boolean, fact: boolean) => pickedFact === fact
