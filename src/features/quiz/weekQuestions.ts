import { createContext, useContext } from 'react'
import type { Question } from '../../content/types'

/** The questions of the week currently being rendered (set by the lesson), so an Exercise block can
 *  resolve its `questionId` without importing every week's content. */
export const WeekQuestionsContext = createContext<Question[]>([])

export const useQuestion = (id: string) => useContext(WeekQuestionsContext).find((q) => q.id === id)
