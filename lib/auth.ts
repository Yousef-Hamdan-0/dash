import { createClient } from '@/lib/supabase/server'
import { isAllowedAdminEmail } from '@/lib/validation'

/**
 * Resolves the Supabase server client together with the current admin user.
 * `user` is null unless the request is authenticated AND the account passes
 * the ADMIN_EMAILS allowlist (see isAllowedAdminEmail). Callers decide whether
 * to return an { error } or throw on `!user`.
 */
export async function requireAdmin() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const authorized = !!user && isAllowedAdminEmail(user.email)
  return { supabase, user: authorized ? user : null }
}
