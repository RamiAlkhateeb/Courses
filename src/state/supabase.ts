import type { SupabaseClient } from '@supabase/supabase-js'

// Accounts are optional. With no env vars (a fork, CI, local dev without .env.local) the app is exactly the guest
// app: nothing here runs and no Supabase code is downloaded. The values are the project URL and the anon /
// publishable key, both public by design; the data is protected by row-level security (supabase/migrations).
const url = (import.meta.env.VITE_SUPABASE_URL ?? '').trim()
const anonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY ?? '').trim()

export const accountsEnabled = /^https?:\/\//.test(url) && anonKey.length > 20

let client: Promise<SupabaseClient> | undefined

/** The Supabase client, downloaded on first use (about 50 KB gzipped, so guests never pay for it). */
export function loadSupabase(): Promise<SupabaseClient> {
  if (!accountsEnabled) return Promise.reject(new Error('accounts are not configured'))
  client ??= import('@supabase/supabase-js').then(({ createClient }) =>
    createClient(url, anonKey, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } }),
  )
  return client
}

/** Is there a saved sign-in in this browser? (Checked without loading the client: the library keeps it under `sb-…-auth-token`.) */
export function hasStoredSession(): boolean {
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i)
      if (k && k.startsWith('sb-') && k.endsWith('-auth-token')) return true
    }
  } catch {
    // storage blocked: no saved session
  }
  return false
}

/** Did the browser just arrive from an email link (password reset)? Those carry tokens or a code in the address. */
export const arrivedFromEmailLink = () => typeof location !== 'undefined' && /[#?&](access_token|code|type=recovery|error_code)=?/.test(location.hash + location.search)
