import { getProjectById } from '@/lib/supabase/queries'
import { notFound } from 'next/navigation'
import EditProjectForm from './edit-form'

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const project = await getProjectById(id)
  if (!project) notFound()
  return <EditProjectForm project={project} />
}
