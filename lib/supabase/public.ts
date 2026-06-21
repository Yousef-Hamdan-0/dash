import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { getSupabaseConfig } from './config'

export function createPublicClient() {
  const config = getSupabaseConfig()

  if (!config) {
    throw new Error('Supabase is not configured.')
  }

  return createSupabaseClient(config.url, config.anonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}
