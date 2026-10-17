import { useTranslation } from 'react-i18next'
import { currentGuide } from '../../state/guide'
import type { GuidePose } from '../../domain/guide'

export type { GuidePose }

/** The learner's guide, Saud or Sara (`currentGuide`, random per session): `public/guides/<guide>-<pose>.png`.
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
  return (
    <img
      src={`${import.meta.env.BASE_URL}guides/${currentGuide}-${pose}.png`}
      alt=""
      height={height}
      className={className}
      draggable={false}
      style={{ height, width: 'auto', transform: mirrored ? 'scaleX(-1)' : undefined }}
    />
  )
}
