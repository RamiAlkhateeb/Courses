import { useTranslation } from 'react-i18next'

/** The Masar mark: a winding path from a start dot to a saffron goal. Same drawing as public/favicon.svg. */
export function LogoMark({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden focusable="false">
      <rect width="64" height="64" rx="16" fill="#14213d" />
      <path d="M14 48c10 0 10-12 18-12s8-14 18-14" fill="none" stroke="#f2a93b" strokeWidth="5" strokeLinecap="round" />
      <circle cx="14" cy="48" r="5" fill="#f6f1e6" />
      <circle cx="50" cy="22" r="6" fill="#f2a93b" />
    </svg>
  )
}

/** Mark + wordmark ("Masar" / "مسار"). */
export function Logo({ size = 32, className }: { size?: number; className?: string }) {
  const { t } = useTranslation()
  return (
    <span className={className} style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
      <LogoMark size={size} />
      <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: size * 0.68, color: 'var(--ink)' }}>
        {t('appName')}
      </span>
    </span>
  )
}
