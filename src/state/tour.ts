import { createPersistedStore } from './createPersistedStore'
import { useStore } from './useStore'

/** Whether the simulator's three-tip tour (first practice lesson) has been seen on this device. */
export const tourStore = createPersistedStore<boolean>({
  key: 'tour:simulator',
  empty: false,
  parse: (raw) => raw === 'seen',
  serialize: (seen) => (seen ? 'seen' : 'new'),
})

export const useTourSeen = () => useStore(tourStore)
export const finishTour = () => tourStore.update(() => true)
