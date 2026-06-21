'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { isSupabaseConfigured } from '@/lib/supabase/config'
import type { DbClient } from '@/lib/supabase/queries'

export async function updateClientStatus(
  id: string,
  status: DbClient['status']
): Promise<{ error?: string }> {
  if (!isSupabaseConfigured()) return { error: 'Supabase is not configured.' }

  const supabase = await createClient()
  const { error } = await supabase
    .from('clients')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/dashboard/clients')
  revalidatePath(`/dashboard/clients/${id}`)
  return {}
}

export async function deleteClient(id: string): Promise<void> {
  if (!isSupabaseConfigured()) return

  const supabase = await createClient()
  await supabase.from('clients').delete().eq('id', id)

  revalidatePath('/dashboard/clients')
  redirect('/dashboard/clients')
}
