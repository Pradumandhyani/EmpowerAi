import { redirect } from 'next/navigation'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { AttendanceClient } from './AttendanceClient'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Attendance' }

export default async function AttendancePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('users')
    .select('name, role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'tutor') redirect('/login')

  const { data: tutor } = await supabase
    .from('tutors')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!tutor) redirect('/login')

  const serviceSupabase = await createServiceClient()

  // Fetch all tutor assignments with school info
  const { data: assignments } = await serviceSupabase
    .from('tutor_assignments')
    .select('*, schools(id, name)')
    .eq('tutor_id', tutor.id)
    .eq('is_active', true)

  return (
    <DashboardShell role="tutor" userName={profile.name} pageTitle="Attendance">
      <AttendanceClient
        assignments={assignments ?? []}
        tutorId={tutor.id}
      />
    </DashboardShell>
  )
}
