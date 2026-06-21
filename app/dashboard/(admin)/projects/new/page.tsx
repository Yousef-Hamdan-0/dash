import NewProjectForm from './new-project-form'
import { getNextProjectId } from '@/lib/project-id'
import { getAllProjects } from '@/lib/supabase/queries'

export default async function NewProjectPage() {
  const projects = await getAllProjects()
  const nextProjectId = getNextProjectId(projects)

  return <NewProjectForm nextProjectId={nextProjectId} />
}
