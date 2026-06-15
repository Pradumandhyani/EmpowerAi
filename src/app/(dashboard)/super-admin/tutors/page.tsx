import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { TutorsClient } from './TutorsClient'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Tutors Management' }

export default async function TutorsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('users').select('name, role').eq('id', user.id).single()
  if (profile?.role !== 'super_admin') redirect('/login')

  const { data: tutors } = await supabase
    .from('tutors')
    .select('*, users!inner(id, name, email, phone, is_active)')
    .order('created_at', { ascending: false })

  const { data: schools } = await supabase
    .from('schools')
    .select('id, name')
    .eq('status', 'approved')
    .order('name')

  const { data: assignments } = await supabase
    .from('tutor_assignments')
    .select('*, schools(name)')

  return (
    <DashboardShell role="super_admin" userName={profile?.name ?? 'Admin'} pageTitle="Tutors Management">
      <TutorsClient
        tutors={(tutors ?? []) as any}
        schools={schools ?? []}
        assignments={assignments ?? []}
      />
    </DashboardShell>
  )
}
