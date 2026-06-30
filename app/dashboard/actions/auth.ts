'use server'

import { createClient } from '@/lib/supabase/server'
import { isSupabaseConfigured } from '@/lib/supabase/config'
import { isAllowedAdminEmail } from '@/lib/validation'
import { redirect } from 'next/navigation'

export async function login(_prev: unknown, formData: FormData) {
  const email    = String(formData.get('email') ?? '')
  const password = String(formData.get('password') ?? '')

  if (!email || !password) {
    return { error: 'Email and password are required.' }
  }

  if (!isSupabaseConfigured()) {
    return { error: 'Supabase is not configured yet.' }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    return { error: 'Invalid credentials. Please try again.' }
  }

  // Enforce the admin allowlist (no-op when ADMIN_EMAILS is unset)
  if (!isAllowedAdminEmail(email)) {
    await supabase.auth.signOut()
    return { error: 'This account is not authorized to access the dashboard.' }
  }

  redirect('/dashboard')
}

export async function logout() {
  if (!isSupabaseConfigured()) redirect('/dashboard/login')

  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/dashboard/login')
}
