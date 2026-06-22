import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { StudentsClient } from './StudentsClient'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Students Management' }

export default async function StudentsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('users').select('name, role, school_id, schools(name)').eq('id', user.id).single()
  
  const cookieStore = await cookies()
  const impersonatedSchoolId = cookieStore.get('impersonate_school_id')?.value
  const isImpersonating = profile?.role === 'super_admin' && impersonatedSchoolId

  if (!isImpersonating && (profile?.role !== 'school_admin' || !profile?.school_id)) {
    redirect('/login')
  }

  const schoolId = isImpersonating ? impersonatedSchoolId : profile.school_id!
  
  // Fetch school details to get the name
  const { data: school } = await supabase.from('schools').select('name').eq('id', schoolId).single()
  const schoolName = school?.name ?? ''

  const { data: students } = await supabase
    .from('students')
    .select('*, users!inner(id, name, email, phone, is_active)')
    .eq('school_id', schoolId)
    .order('created_at', { ascending: false })

  return (
    <DashboardShell role="school_admin" userName={profile.name} schoolName={schoolName} pageTitle="Students Management">
      <StudentsClient students={(students ?? []) as any} schoolId={schoolId} />
    </DashboardShell>
  )
}
