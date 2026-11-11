import { useEffect } from 'react'
import { awardBadges, newBadges, playgroundFacts, progressFacts, unitFacts, type BadgeFacts } from '../domain/badges'
import { lessonKey } from '../domain/lessons'
import { localDay } from '../domain/progress'
import { playgroundStore } from './playground'
import { progressStore } from './progress'
import { useProgress } from './useProgress'
import { useStore } from './useStore'
import { useTrail, useTrailId } from './useTrail'

/** Save the badges `facts` earn. Lesson complete calls it with the facts after the lesson. */
export const saveBadges = (facts: BadgeFacts) => progressStore.update((p) => awardBadges(p, facts, localDay()))

/** Saves any badge that is earned but not saved yet: simulator firsts, and anything earned elsewhere. Used by the screens
 *  that show or cause them (Me, the portfolio); kept off the first screen so the first load stays small. */
export function useAwardBadges() {
  const { progress } = useProgress()
  const pg = useStore(playgroundStore)
  const { course, chapters, loaded } = useTrail(useTrailId())
  const units = loaded ? chapters.map((c) => c.lessons.map((l) => lessonKey(course.id, c.id, l.id))) : []
  const facts: BadgeFacts = { ...progressFacts(progress, localDay()), ...unitFacts(units, progress.lessonsDone), ...playgroundFacts(pg) }
  const pending = newBadges(progress, facts).join()
  useEffect(() => {
    if (pending) saveBadges(facts)
    // facts is rebuilt every render; what matters is which badges are waiting
  }, [pending])
}
