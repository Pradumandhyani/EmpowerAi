import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { DashboardShell } from '@/components/layout/DashboardShell'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Tutor Dashboard' }

export default async function TutorPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('users').select('name, role').eq('id', user.id).single()
  if (profile?.role !== 'tutor') redirect('/login')

  return (
    <DashboardShell role="tutor" userName={profile.name} pageTitle="My Schedule">
      <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-500 shadow-sm">
        <p>Calendar view coming soon. Check your projects page for now.</p>
      </div>
    </DashboardShell>
  )
}
