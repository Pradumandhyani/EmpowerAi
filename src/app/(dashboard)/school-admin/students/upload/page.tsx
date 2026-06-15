import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { CSVUploadClient } from './CSVUploadClient'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Bulk Upload Students' }

export default async function BulkUploadPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('users').select('name, role, school_id').eq('id', user.id).single()
  if (profile?.role !== 'school_admin' || !profile?.school_id) redirect('/login')

  return (
    <DashboardShell role="school_admin" userName={profile.name} pageTitle="Bulk Upload Students">
      <CSVUploadClient schoolId={profile.school_id} />
    </DashboardShell>
  )
}
