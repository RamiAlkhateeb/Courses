// The learner's guide for this session: Saud (سعود) or Sara (سارة), picked at random each time the app loads.
// Kept in memory only, so every new session may bring the other guide. `?guide=saud|sara` pins one (tests, screenshots).

export const GUIDES = ['saud', 'sara'] as const
export type GuideId = (typeof GUIDES)[number]

function pick(): GuideId {
  const asked = typeof location === 'undefined' ? null : new URLSearchParams(location.search).get('guide')
  if (asked === 'saud' || asked === 'sara') return asked
  return Math.random() < 0.5 ? 'saud' : 'sara'
}

export const currentGuide: GuideId = pick()
