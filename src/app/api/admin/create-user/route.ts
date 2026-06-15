import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    // Verify caller is super_admin
    const callerSupabase = await createClient()
    const { data: { user } } = await callerSupabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: profile } = await callerSupabase.from('users').select('role').eq('id', user.id).single()
    if (profile?.role !== 'super_admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const { name, email, password, role, school_id } = body

    // Use service role to create user (bypasses email confirmation)
    const adminSupabase = await createServiceClient()
    const { data: authUser, error: authError } = await adminSupabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { name, role, school_id: school_id ?? null },
    })

    if (authError) return NextResponse.json({ error: authError.message }, { status: 400 })

    return NextResponse.json({ userId: authUser.user.id, success: true })
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
