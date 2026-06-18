import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { TutorStudentsClient } from './TutorStudentsClient'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'My Students' }

export default async function TutorStudentsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('users').select('name, role').eq('id', user.id).single()
  if (profile?.role !== 'tutor') redirect('/login')

  const { data: tutor } = await supabase.from('tutors').select('id').eq('user_id', user.id).single()
  if (!tutor) redirect('/login')

  // Fetch tutor assignments to figure out schools and classes
  const { data: assignments } = await supabase
    .from('tutor_assignments')
    .select('*, schools(id, name)')
    .eq('tutor_id', tutor.id)

  const schoolIds = Array.from(new Set(assignments?.map(a => a.school_id) ?? []))
  const grades = Array.from(new Set(assignments?.map(a => a.class_grade) ?? []))

  let students: any[] = []
  if (schoolIds.length > 0 && grades.length > 0) {
    // Fetch all students for the tutor's assigned schools
    const { data: rawStudents } = await supabase
      .from('students')
      .select('id, school_id, class_grade, section, roll_number, users(name, email, phone), schools(name)')
      .in('school_id', schoolIds)
      .in('class_grade', grades)
      .order('class_grade', { ascending: true })

    // Filter in JS to strictly match school_id and class_grade combinations this tutor is assigned to
    students = (rawStudents ?? []).filter((student: any) => {
      return assignments?.some(a => a.school_id === student.school_id && a.class_grade === student.class_grade)
    })
  }

  return (
    <DashboardShell role="tutor" userName={profile.name} pageTitle="My Students">
      <TutorStudentsClient 
        students={students} 
        assignments={assignments ?? []} 
      />
    </DashboardShell>
  )
}
