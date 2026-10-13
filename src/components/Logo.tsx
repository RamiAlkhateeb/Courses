import { resolveAssetPath } from '../content/resolveAssetPath'

/** The app icon: Abu Shreek's face on the navy tile. Same image as the favicon and home-screen icon (public/icon-*.png). */
export function LogoMark({ size = 32 }: { size?: number }) {
  return <img src={resolveAssetPath('/icon-192.png')} width={size} height={size} alt="" decoding="async" style={{ display: 'block' }} />
}
