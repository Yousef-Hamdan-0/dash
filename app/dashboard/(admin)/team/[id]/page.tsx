import { getTeamMemberById } from '@/lib/supabase/queries'
import { notFound } from 'next/navigation'
import EditTeamMemberForm from './edit-form'

export default async function EditTeamMemberPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const member = await getTeamMemberById(id)
  if (!member) notFound()
  return <EditTeamMemberForm member={member} />
}
