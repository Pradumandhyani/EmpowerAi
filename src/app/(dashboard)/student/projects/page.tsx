import { redirect } from 'next/navigation'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { StudentProjectsClient } from './StudentProjectsClient'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'My Projects' }

export default async function StudentProjectsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('users').select('name, role, school_id').eq('id', user.id).single()
  if (profile?.role !== 'student' || !profile?.school_id) redirect('/login')

  const { data: student } = await supabase
    .from('students')
    .select('id, class_grade, section, schools(name)')
    .eq('user_id', user.id)
    .single()

  if (!student) redirect('/login')

  // Get active projects for this student's grade/section (using service client to bypass RLS for user profile queries)
  const serviceSupabase = await createServiceClient()
  const { data: projects } = await serviceSupabase
    .from('projects')
    .select('id, title, description, due_date, max_marks, created_at, tutors!inner(users!inner(name))')
    .eq('school_id', profile.school_id)
    .or(`class_grade.eq.${student.class_grade},class_grade.eq.ALL`)
    .or(`section.eq.${student.section},section.is.null`)
    .order('due_date', { ascending: true })

  // Get student's submissions
  let submissions: any[] = []
  if (projects && projects.length > 0) {
    const { data } = await supabase
      .from('submissions')
      .select('*')
      .eq('student_id', student.id)
      .in('project_id', projects.map(p => p.id))
    submissions = data ?? []
  }

  return (
    <DashboardShell role="student" userName={profile.name} schoolName={(student.schools as any)?.name} pageTitle="My Projects">
      <StudentProjectsClient projects={projects ?? []} submissions={submissions} studentId={student.id} />
    </DashboardShell>
  )
}
