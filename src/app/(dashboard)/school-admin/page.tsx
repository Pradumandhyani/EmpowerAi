import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { StatCard } from '@/components/ui'
import { Users, BookOpen, Calendar, TrendingUp } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'School Admin Dashboard' }

export default async function SchoolAdminPage() {
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

  const [
    { data: school },
    { count: totalStudents },
    { count: totalTutors },
    { count: activeProjects },
  ] = await Promise.all([
    supabase.from('schools').select('name').eq('id', schoolId).single(),
    supabase.from('students').select('*', { count: 'exact', head: true }).eq('school_id', schoolId),
    supabase.from('tutor_assignments').select('*', { count: 'exact', head: true }).eq('school_id', schoolId),
    supabase.from('projects').select('*', { count: 'exact', head: true }).eq('school_id', schoolId).gte('due_date', new Date().toISOString()),
  ])

  return (
    <DashboardShell role="school_admin" userName={profile.name} schoolName={school?.name} pageTitle="Dashboard">
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total Students" value={totalStudents ?? 0} icon={<Users size={20} />} color="indigo" />
          <StatCard label="Assigned Tutors" value={totalTutors ?? 0} icon={<BookOpen size={20} />} color="emerald" />
          <StatCard label="Active Projects" value={activeProjects ?? 0} icon={<TrendingUp size={20} />} color="sky" />
          <StatCard label="Today's Classes" value={0} icon={<Calendar size={20} />} color="amber" />
        </div>
      </div>
    </DashboardShell>
  )
}
