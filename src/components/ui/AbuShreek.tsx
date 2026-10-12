import { useTranslation } from 'react-i18next'

export type MascotPose = 'wave' | 'think' | 'cheer' | 'oops' | 'point'

/** Abu Shreek (أبو شريك), the mascot and guide. `public/abu-shreek/abu-shreek-<pose>.png`. Faces the other way in
 *  RTL so he keeps pointing into the screen; pass `flip` to override. */
export function AbuShreek({
  pose,
  height = 140,
  flip,
  className,
}: {
  pose: MascotPose
  height?: number
  flip?: boolean
  className?: string
}) {
  const { i18n } = useTranslation()
  const mirrored = flip ?? i18n.dir() === 'rtl'
  return (
    <img
      src={`${import.meta.env.BASE_URL}abu-shreek/abu-shreek-${pose}.png`}
      alt=""
      height={height}
      className={className}
      draggable={false}
      style={{ height, width: 'auto', transform: mirrored ? 'scaleX(-1)' : undefined }}
    />
  )
}
