import { emptyPlayground } from '../domain/playground/engine'
import { parsePlayground } from '../domain/playground/persist'
import { createPersistedStore } from './createPersistedStore'

/** The Playground (simulated markets, your holdings, finished seasons), saved in this browser. The rules are pure
 *  functions in src/domain/playground; this is only where the value lives. */
export const playgroundStore = createPersistedStore({
  key: 'playground:v1',
  empty: emptyPlayground,
  parse: parsePlayground,
})
