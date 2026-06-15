import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { ProjectsClient } from './ProjectsClient'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Manage Projects' }

export default async function ProjectsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('users').select('name, role').eq('id', user.id).single()
  if (profile?.role !== 'tutor') redirect('/login')

  const { data: tutor } = await supabase.from('tutors').select('id').eq('user_id', user.id).single()
  
  const [
    { data: projects },
    { data: assignments }
  ] = await Promise.all([
    supabase.from('projects').select('*, schools(name)').eq('tutor_id', tutor?.id).order('created_at', { ascending: false }),
    supabase.from('tutor_assignments').select('*, schools(id, name)').eq('tutor_id', tutor?.id)
  ])

  return (
    <DashboardShell role="tutor" userName={profile.name} pageTitle="Manage Projects">
      <ProjectsClient projects={projects ?? []} assignments={assignments ?? []} tutorId={tutor?.id} />
    </DashboardShell>
  )
}
