import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { CSVUploadClient } from './CSVUploadClient'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Bulk Upload Students' }

export default async function BulkUploadPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('users').select('name, role, school_id').eq('id', user.id).single()
  
  const cookieStore = await cookies()
  const impersonatedSchoolId = cookieStore.get('impersonate_school_id')?.value
  const isImpersonating = profile?.role === 'super_admin' && impersonatedSchoolId

  if (!isImpersonating && (profile?.role !== 'school_admin' || !profile?.school_id)) {
    redirect('/login')
  }

  const schoolId = isImpersonating ? impersonatedSchoolId : profile.school_id!

  return (
    <DashboardShell role="school_admin" userName={profile.name} pageTitle="Bulk Upload Students">
      <CSVUploadClient schoolId={schoolId} />
    </DashboardShell>
  )
}
