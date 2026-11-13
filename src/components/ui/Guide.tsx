import { useTranslation } from 'react-i18next'
import { currentGuide } from '../../state/guide'
import type { GuidePose } from '../../domain/guide'
import { GUIDE_RATIO } from './guideSizes'

export type { GuidePose }

/** The learner's guide, Saud or Sara (`currentGuide`, random per session): `public/guides/<guide>-<pose>.webp`, made from
 *  the PNG originals by scripts/make-guides.mjs. Its width is known in advance (GUIDE_RATIO), so nothing moves as it loads.
 *  Decorative (the words beside it carry the meaning). Faces the other way in RTL so the guide keeps pointing into the
 *  screen; pass `flip` to override. */
export function Guide({
  pose,
  height = 140,
  flip,
  className,
}: {
  pose: GuidePose
  height?: number
  flip?: boolean
  className?: string
}) {
  const { i18n } = useTranslation()
  const mirrored = flip ?? i18n.dir() === 'rtl'
  const name = `${currentGuide}-${pose}`
  const width = Math.round(height * (GUIDE_RATIO[name] ?? 1))
  return (
    <img
      src={`${import.meta.env.BASE_URL}guides/${name}.webp`}
      alt=""
      width={width}
      height={height}
      className={className}
      draggable={false}
      decoding="async"
      style={{ height, width, transform: mirrored ? 'scaleX(-1)' : undefined }}
    />
  )
}
