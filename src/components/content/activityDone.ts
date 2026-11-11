import { createContext } from 'react'

/** Called by an activity step (guess, choice, sort, myth) once it is answered, so the lesson's Next can move on.
 *  Outside a lesson (the one-page view, share slides) nothing listens. */
export const ActivityDoneContext = createContext<(() => void) | null>(null)
