import { getJourneyItemById } from '@/lib/supabase/queries'
import { notFound } from 'next/navigation'
import EditJourneyItemForm from './edit-form'

export default async function EditJourneyItemPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const item = await getJourneyItemById(id)
  if (!item) notFound()
  return <EditJourneyItemForm item={item} />
}
