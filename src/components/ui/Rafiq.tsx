export type RafiqPose = 'wave' | 'think' | 'cheer' | 'oops' | 'point'

/** Rafiq (رفيق), Masar's guide. `public/rafiq/rafiq-<pose>.png`; mirrored in RTL (see ui.module.css). */
export function Rafiq({ pose, height = 140, className }: { pose: RafiqPose; height?: number; className?: string }) {
  return (
    <img
      src={`${import.meta.env.BASE_URL}rafiq/rafiq-${pose}.png`}
      alt=""
      height={height}
      className={`rafiq ${className ?? ''}`}
      draggable={false}
      style={{ height, width: 'auto' }}
    />
  )
}
