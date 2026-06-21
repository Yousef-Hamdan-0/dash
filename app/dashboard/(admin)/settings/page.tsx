import { getSiteSettings } from '@/lib/supabase/queries'
import SettingsForm from './settings-form'

export default async function SettingsPage() {
  const settings = await getSiteSettings()
  return <SettingsForm settings={settings} />
}
