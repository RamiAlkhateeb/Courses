// Which pose the guide (Saud or Sara) takes. Pure: no React, no browser APIs.
import type { Block } from '../content/types'

/** wave: hello · point: guidance, analogies · think: quizzes, room to fill · cheer: right answer, done · oops: wrong,
 *  mistakes · coins: paid (+$10) · news: real-world examples, market news · streak: days in a row */
export type GuidePose = 'wave' | 'think' | 'cheer' | 'oops' | 'point' | 'coins' | 'news' | 'streak'

/** The small guide beside a tip box: pointing at an analogy, wincing at a mistake, reading out an example. */
export const TIP_POSES: Partial<Record<string, GuidePose>> = { analogy: 'point', mistake: 'oops', example: 'news' }

/** Which pose fills the room under a lesson step: a key idea makes the guide think, a picture or calculator gets a
 *  point; otherwise the poses take turns by step number. Never the pose of a tip guide already on the step. */
export function fillerPose(blocks: Block[], step: number): GuidePose {
  const taken = new Set(blocks.flatMap((b) => (b.type === 'box' && TIP_POSES[b.variant] ? [TIP_POSES[b.variant]] : [])))
  const wanted: GuidePose[] = []
  if (blocks.some((b) => b.type === 'keyIdea')) wanted.push('think')
  if (blocks.some((b) => b.type === 'diagram' || b.type === 'calculator')) wanted.push('point')
  const turn: GuidePose[] = ['wave', 'cheer', 'think', 'point']
  for (let i = 0; i < turn.length; i++) wanted.push(turn[(step + i) % turn.length])
  return wanted.find((p) => !taken.has(p)) ?? 'wave'
}
