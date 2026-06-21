import SidebarNav from './sidebar-nav'
import { getNewClientsCount } from '@/lib/supabase/queries'

export default async function Sidebar() {
  const newClients = await getNewClientsCount()
  return <SidebarNav newClientsCount={newClients} />
}
