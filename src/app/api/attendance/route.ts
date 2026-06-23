import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'tutor') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Get the tutor record
    const { data: tutor } = await supabase
      .from('tutors')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (!tutor) return NextResponse.json({ error: 'Tutor record not found' }, { status: 404 })

    const body = await request.json()
    const { records } = body as {
      records: Array<{
        student_id: string
        school_id: string
        date: string
        status: 'present' | 'absent'
      }>
    }

    if (!records || !Array.isArray(records) || records.length === 0) {
      return NextResponse.json({ error: 'No attendance records provided' }, { status: 400 })
    }

    // Verify that this tutor is assigned to the school in the records
    const schoolId = records[0].school_id
    const { data: assignments } = await supabase
      .from('tutor_assignments')
      .select('id')
      .eq('tutor_id', tutor.id)
      .eq('school_id', schoolId)

    if (!assignments || assignments.length === 0) {
      return NextResponse.json({ error: 'Not assigned to this school' }, { status: 403 })
    }

    const serviceSupabase = await createServiceClient()

    // Upsert all attendance records
    // The UNIQUE constraint is on (student_id, date), so conflicts will update the status
    const upsertData = records.map((rec) => ({
      student_id: rec.student_id,
      school_id: rec.school_id,
      tutor_id: tutor.id,
      date: rec.date,
      status: rec.status,
    }))

    const { error: upsertError } = await serviceSupabase
      .from('attendance')
      .upsert(upsertData, {
        onConflict: 'student_id,date',
        ignoreDuplicates: false,
      })

    if (upsertError) {
      console.error('Attendance upsert error:', upsertError)
      return NextResponse.json({ error: upsertError.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, count: records.length })
  } catch (err: any) {
    console.error('Attendance POST error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
