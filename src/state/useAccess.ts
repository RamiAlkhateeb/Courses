import { useAuth } from './auth'
import { accountsEnabled } from './supabase'

/** True for a guest who could sign up: accounts exist and nobody is signed in. Without accounts (no Supabase) there is
 *  no way to sign up, so nothing is limited. While the session is still loading, nothing is limited either. */
export function useGuestLimited(): boolean {
  const auth = useAuth()
  return accountsEnabled && auth.status === 'signedOut'
}
