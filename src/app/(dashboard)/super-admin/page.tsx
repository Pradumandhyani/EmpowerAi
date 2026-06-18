import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { StatCard } from '@/components/ui'
import { School, Users, UserCircle, CheckCircle2 } from 'lucide-react'
import type { Metadata } from 'next'
import { RecentInquiries } from './RecentInquiries'

export const metadata: Metadata = { title: 'Super Admin — Overview' }

export default async function SuperAdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('users').select('name, role').eq('id', user.id).single()
  if (profile?.role !== 'super_admin') redirect('/login')

  // Fetch platform stats
  const [
    { count: totalSchools },
    { count: approvedSchools },
    { count: pendingSchools },
    { count: totalStudents },
    { count: totalTutors },
    { data: recentInquiries },
  ] = await Promise.all([
    supabase.from('schools').select('*', { count: 'exact', head: true }),
    supabase.from('schools').select('*', { count: 'exact', head: true }).eq('status', 'approved'),
    supabase.from('schools').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('students').select('*', { count: 'exact', head: true }),
    supabase.from('tutors').select('*', { count: 'exact', head: true }),
    supabase.from('school_inquiries').select('*').eq('status', 'new').order('created_at', { ascending: false }).limit(5),
  ])

  return (
    <DashboardShell role="super_admin" userName={profile?.name ?? 'Admin'} pageTitle="Platform Overview">
      <div className="space-y-6">
        {/* Stats grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Total Schools"
            value={totalSchools ?? 0}
            icon={<School size={20} />}
            color="indigo"
          />
          <StatCard
            label="Active Schools"
            value={approvedSchools ?? 0}
            icon={<CheckCircle2 size={20} />}
            color="emerald"
          />
          <StatCard
            label="Total Students"
            value={totalStudents ?? 0}
            icon={<Users size={20} />}
            color="sky"
          />
          <StatCard
            label="Total Tutors"
            value={totalTutors ?? 0}
            icon={<UserCircle size={20} />}
            color="violet"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pending approvals */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="font-semibold text-slate-900">Pending Approvals</h2>
              <span className="bg-amber-100 text-amber-700 text-xs font-medium px-2 py-1 rounded-full">
                {pendingSchools ?? 0} pending
              </span>
            </div>
            <div className="p-6">
              {(pendingSchools ?? 0) === 0 ? (
                <div className="text-center py-8 text-slate-400">
                  <CheckCircle2 className="mx-auto mb-2 text-emerald-400" size={32} />
                  <p className="text-sm">All schools are approved</p>
                </div>
              ) : (
                <a href="/super-admin/schools?filter=pending" className="block w-full py-3 bg-amber-50 hover:bg-amber-100 text-amber-700 text-sm font-medium text-center rounded-lg transition-colors">
                  Review {pendingSchools} pending school{(pendingSchools ?? 0) > 1 ? 's' : ''} →
                </a>
              )}
            </div>
          </div>

          {/* Recent inquiries */}
          <RecentInquiries inquiries={(recentInquiries as any) || []} />
        </div>
      </div>
    </DashboardShell>
  )
}
