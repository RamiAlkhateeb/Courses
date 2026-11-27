/** The play-money wallet and the market simulator (the Playground, its practice lessons, money on Learn, Me and Lesson
 *  complete). Hidden unless the build sets VITE_SIMULATOR=1; the code and saved data stay, so it can come back.
 *  (`?.`: e2e specs import content files in plain Node, where import.meta.env does not exist.) */
export const SIMULATOR_ON = (import.meta.env?.VITE_SIMULATOR ?? '') === '1'
