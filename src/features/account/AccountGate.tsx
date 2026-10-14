import { Navigate, Outlet } from 'react-router-dom'
import { accountsEnabled } from '../../state/supabase'

/** Every account route sits under this: without Supabase configured there are no accounts, so go back to Me. */
export function AccountGate() {
  return accountsEnabled ? <Outlet /> : <Navigate to="/me" replace />
}
