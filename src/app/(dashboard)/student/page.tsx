import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { StudentDashboardClient } from './StudentDashboardClient'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Student Dashboard' }

export default async function StudentPage() {
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

  // Get active projects for this student's grade/section
  const { data: projects } = await supabase
    .from('projects')
    .select('id, title, due_date, max_marks, tutors!inner(users!inner(name))')
    .eq('school_id', profile.school_id)
    .eq('class_grade', student.class_grade)
    .or(`section.eq.${student.section},section.is.null`)
    .order('due_date', { ascending: true })
    .limit(5)

  // Get student's submissions for those projects
  let submissions: any[] = []
  if (projects && projects.length > 0) {
    const { data } = await supabase
      .from('submissions')
      .select('project_id, submitted_at, marks_obtained')
      .eq('student_id', student.id)
      .in('project_id', projects.map(p => p.id))
    submissions = data ?? []
  }

  return (
    <DashboardShell role="student" userName={profile.name} schoolName={(student.schools as any)?.name} pageTitle="Dashboard">
      <StudentDashboardClient projects={projects ?? []} submissions={submissions} studentId={student.id} />
    </DashboardShell>
  )
}
