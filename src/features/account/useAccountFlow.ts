import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import type { AuthError } from '../../state/auth'
import { useSyncStatus } from '../../state/sync'
import { useAuth } from '../../state/auth'
import { RESEND_SECONDS } from '../../domain/auth'

/** The i18n key of each failure, for messages shown under a form. */
export const errorKey = (e: AuthError) =>
  ({ invalid: 'acc_err_invalid', exists: 'acc_err_exists', weak: 'acc_err_weak', email: 'acc_err_email', rate: 'acc_err_rate', network: 'acc_err_network', unknown: 'acc_err_unknown' })[e] as 'acc_err_unknown'

/** Just signed in or up: stay a moment while the account's data is merged in (otherwise a device that has not been
 *  through onboarding could bounce back to Welcome), then go home. Never wait more than a few seconds. */
export function useArrive() {
  const navigate = useNavigate()
  const auth = useAuth()
  const sync = useSyncStatus()
  // idle → working (the request is out) → arriving (signed in; waiting for the merge, then home)
  const [phase, setPhase] = useState<'idle' | 'working' | 'arriving'>('idle')
  const arriving = phase === 'arriving'
  const settled = sync === 'synced' || sync === 'error' || sync === 'offline'
  const signedIn = auth.status === 'signedIn'
  useEffect(() => {
    if (!arriving) return
    // Signed up without a session (never expected: the app asks for no email confirmation): go to Learn anyway.
    if (!signedIn) return void navigate('/', { replace: true })
    if (settled) return void navigate('/', { replace: true })
    const id = setTimeout(() => navigate('/', { replace: true }), 6000)
    return () => clearTimeout(id)
  }, [arriving, signedIn, settled, navigate])
  return {
    arriving,
    /** True from the moment the form is sent: the page must not bounce a signed-in visitor away mid-request */
    holding: phase !== 'idle',
    begin: () => setPhase('working'),
    fail: () => setPhase('idle'),
    start: () => setPhase('arriving'),
  }
}

/** The email carried from one screen to the next (`navigate(path, { state: { email } })`); empty when opened directly. */
export function useEmailFromState(): string {
  const { state } = useLocation()
  const email = (state as { email?: unknown } | null)?.email
  return typeof email === 'string' ? email : ''
}

/** Seconds left before "Resend" works again; `restart()` begins a new wait. */
export function useCountdown(from = RESEND_SECONDS) {
  const [left, setLeft] = useState(from)
  useEffect(() => {
    if (left <= 0) return
    const id = setTimeout(() => setLeft((s) => s - 1), 1000)
    return () => clearTimeout(id)
  }, [left])
  return { left, restart: () => setLeft(from) }
}
