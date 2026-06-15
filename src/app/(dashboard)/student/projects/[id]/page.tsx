import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { StudentProjectDetailClient } from './StudentProjectDetailClient'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Project Details' }

export default async function StudentProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('users').select('name, role').eq('id', user.id).single()
  if (profile?.role !== 'student') redirect('/login')

  const { data: student } = await supabase.from('students').select('id, schools(name)').eq('user_id', user.id).single()
  if (!student) redirect('/login')

  const { id } = await params

  // Get project details
  const { data: project } = await supabase
    .from('projects')
    .select('*, tutors!inner(users!inner(name))')
    .eq('id', id)
    .single()

  if (!project) redirect('/student/projects')

  // Get student's submission if any
  const { data: submission } = await supabase
    .from('submissions')
    .select('*')
    .eq('project_id', id)
    .eq('student_id', student.id)
    .single()

  return (
    <DashboardShell role="student" userName={profile.name} schoolName={(student.schools as any)?.name} pageTitle="Project Details">
      <StudentProjectDetailClient 
        project={project as any} 
        submission={submission}
        studentId={student.id}
        schoolId={(project as any).school_id}
      />
    </DashboardShell>
  )
}
