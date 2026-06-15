import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { StudentsClient } from './StudentsClient'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Students Management' }

export default async function StudentsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('users').select('name, role, school_id, schools(name)').eq('id', user.id).single()
  if (profile?.role !== 'school_admin' || !profile?.school_id) redirect('/login')

  const { data: students } = await supabase
    .from('students')
    .select('*, users!inner(id, name, email, phone, is_active)')
    .eq('school_id', profile.school_id)
    .order('created_at', { ascending: false })

  return (
    <DashboardShell role="school_admin" userName={profile.name} schoolName={(profile.schools as any)?.name} pageTitle="Students Management">
      <StudentsClient students={(students ?? []) as any} schoolId={profile.school_id} />
    </DashboardShell>
  )
}
