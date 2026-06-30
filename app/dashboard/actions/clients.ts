'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requireAdmin } from '@/lib/auth'
import { isSupabaseConfigured } from '@/lib/supabase/config'
import { isValidEmail } from '@/lib/validation'
import type { DbClient } from '@/lib/supabase/queries'

export async function updateClientStatus(
  id: string,
  status: DbClient['status']
): Promise<{ error?: string }> {
  if (!isSupabaseConfigured()) return { error: 'Supabase is not configured.' }

  if (!['new', 'contacted', 'qualified', 'closed'].includes(status)) {
    return { error: 'Invalid client status.' }
  }

  const { supabase, user } = await requireAdmin()
  if (!user) return { error: 'Unauthorized' }

  const { error } = await supabase
    .from('clients')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/dashboard/clients')
  revalidatePath(`/dashboard/clients/${id}`)
  return {}
}

export async function markClientsSeen(ids: string[]): Promise<void> {
  if (!isSupabaseConfigured()) return

  const validIds = ids.filter((id) => /^[0-9a-f-]{36}$/i.test(id)).slice(0, 250)
  if (validIds.length === 0) return

  const { supabase, user } = await requireAdmin()
  if (!user) return

  await supabase
    .from('clients')
    .update({ seen_at: new Date().toISOString() })
    .in('id', validIds)
    .is('seen_at', null)

  revalidatePath('/dashboard/clients')
  revalidatePath('/dashboard')
}

export async function deleteClient(id: string): Promise<void> {
  if (!isSupabaseConfigured()) return

  const { supabase, user } = await requireAdmin()
  if (!user) throw new Error('Unauthorized')

  const { error } = await supabase.from('clients').delete().eq('id', id)
  if (error) throw new Error(error.message)

  revalidatePath('/dashboard/clients')
  redirect('/dashboard/clients')
}

export async function createClientManual(
  _prev: unknown,
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  if (!isSupabaseConfigured()) return { error: 'Supabase is not configured.' }

  const { supabase, user } = await requireAdmin()
  if (!user) return { error: 'Unauthorized' }

  const name  = String(formData.get('name') ?? '').trim()
  const phone = String(formData.get('phone') ?? '').trim()
  const email = String(formData.get('email') ?? '').trim()
  const desc  = String(formData.get('request_description') ?? '').trim()
  const type  = String(formData.get('request_type') ?? '').trim()

  if (!name)  return { error: 'Full name is required.' }
  if (!phone) return { error: 'Phone number is required.' }
  if (!email) return { error: 'Email address is required.' }

  if (email && !isValidEmail(email)) {
    return { error: 'Invalid email address.' }
  }

  const { error } = await supabase.from('clients').insert({
    name,
    phone,
    email,
    service:             type || 'Manual entry',
    message:             desc || '(Added manually from dashboard)',
    request_description: desc || null,
    request_type:        type || null,
    source:              'website',
    status:              'new',
    seen_at:             new Date().toISOString(),
  })

  if (error) return { error: error.message }

  revalidatePath('/dashboard/clients')
  return { success: true }
}
