import { createContext, useContext } from 'react'
import type { Question } from '../../content/types'

/** The questions of the mod currently being rendered (set by ModulePage), so an Exercise block can
 *  resolve its `questionId` without importing every module's content. */
export const ModuleQuestionsContext = createContext<Question[]>([])

export const useQuestion = (id: string) => useContext(ModuleQuestionsContext).find((q) => q.id === id)
