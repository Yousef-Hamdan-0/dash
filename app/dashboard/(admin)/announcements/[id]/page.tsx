import { getAnnouncementById } from '@/lib/supabase/queries'
import { notFound } from 'next/navigation'
import EditAnnouncementForm from './edit-form'

export default async function EditAnnouncementPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const item = await getAnnouncementById(id)
  if (!item) notFound()
  return <EditAnnouncementForm item={item} />
}
