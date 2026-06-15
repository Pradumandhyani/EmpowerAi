import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { SchoolsClient } from './SchoolsClient'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Schools Management' }

export default async function SchoolsPage({ searchParams }: { searchParams: Promise<{ filter?: string }> }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('users').select('name, role').eq('id', user.id).single()
  if (profile?.role !== 'super_admin') redirect('/login')

  const params = await searchParams
  const filter = params.filter

  let query = supabase.from('schools').select('*').order('created_at', { ascending: false })
  if (filter === 'pending') query = query.eq('status', 'pending')

  const { data: schools } = await query

  return (
    <DashboardShell role="super_admin" userName={profile?.name ?? 'Admin'} pageTitle="Schools Management">
      <SchoolsClient schools={schools ?? []} initialFilter={filter} />
    </DashboardShell>
  )
}
