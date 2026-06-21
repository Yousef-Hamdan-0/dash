import { getTestimonialById } from '@/lib/supabase/queries'
import { notFound } from 'next/navigation'
import EditTestimonialForm from './edit-form'

export default async function EditTestimonialPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const item = await getTestimonialById(id)
  if (!item) notFound()
  return <EditTestimonialForm item={item} />
}
