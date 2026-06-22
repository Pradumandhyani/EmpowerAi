import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: profile } = await supabase.from('users').select('role').eq('id', user.id).single()
    if (profile?.role !== 'super_admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { schoolId, action } = await request.json()

    const response = NextResponse.json({ success: true })

    if (action === 'stop') {
      response.cookies.delete('impersonate_school_id')
    } else if (schoolId) {
      response.cookies.set('impersonate_school_id', schoolId, {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      })
    } else {
      return NextResponse.json({ error: 'Missing schoolId or stop action' }, { status: 400 })
    }

    return response
  } catch (err: any) {
    console.error('Impersonation API error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
