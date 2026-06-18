import { redirect } from 'next/navigation'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { ProjectDetailClient } from './ProjectDetailClient'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Project Details' }

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('users').select('name, role').eq('id', user.id).single()
  if (profile?.role !== 'tutor') redirect('/login')

  const { id } = await params

  // Get project details
  const { data: project } = await supabase
    .from('projects')
    .select('*, schools(name)')
    .eq('id', id)
    .single()

  if (!project) redirect('/tutor/projects')

  // Use the service client to bypass RLS restrictions on joining public.users
  const serviceSupabase = await createServiceClient()

  // Get all students for this project's school/grade/section
  let studentsQuery = serviceSupabase
    .from('students')
    .select('id, class_grade, section, users!inner(name, email)')
    .eq('school_id', project.school_id)
    .eq('class_grade', project.class_grade)

  if (project.section) {
    studentsQuery = studentsQuery.eq('section', project.section)
  }

  const { data: students } = await studentsQuery

  // Get existing submissions
  const { data: submissions } = await supabase
    .from('submissions')
    .select('*')
    .eq('project_id', id)

  return (
    <DashboardShell role="tutor" userName={profile.name} pageTitle="Project Details">
      <ProjectDetailClient 
        project={project as any} 
        students={(students ?? []) as any} 
        submissions={submissions ?? []} 
      />
    </DashboardShell>
  )
}
