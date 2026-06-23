import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url)
    const school_id = searchParams.get('school_id')
    const class_grade = searchParams.get('class_grade') // optional
    const date = searchParams.get('date') // YYYY-MM-DD

    if (!school_id) {
      return NextResponse.json({ error: 'school_id is required' }, { status: 400 })
    }

    // Verify the tutor is assigned to this school
    const { data: assignments } = await supabase
      .from('tutor_assignments')
      .select('id')
      .eq('tutor_id', tutor.id)
      .eq('school_id', school_id)

    if (!assignments || assignments.length === 0) {
      return NextResponse.json({ error: 'Not assigned to this school' }, { status: 403 })
    }

    const serviceSupabase = await createServiceClient()

    // Build student query — filter by school, optionally by class_grade
    let query = serviceSupabase
      .from('students')
      .select('id, school_id, class_grade, section, roll_number, users!inner(name, email), schools(name)')
      .eq('school_id', school_id)

    if (class_grade) {
      query = query.eq('class_grade', class_grade)
    }

    // Sort by roll_number ascending (nulls last via JS)
    const { data: students, error: studentsError } = await query

    if (studentsError) {
      console.error('Error fetching students:', studentsError)
      return NextResponse.json({ error: 'Failed to fetch students' }, { status: 500 })
    }

    // Sort in JS: numeric roll numbers first, then alphanumeric, then nulls last
    const sorted = (students ?? []).sort((a: any, b: any) => {
      const rA = a.roll_number
      const rB = b.roll_number
      if (!rA && !rB) return 0
      if (!rA) return 1
      if (!rB) return -1
      const nA = Number(rA)
      const nB = Number(rB)
      if (!isNaN(nA) && !isNaN(nB)) return nA - nB
      return rA.localeCompare(rB)
    })

    // Fetch existing attendance for this date (if date is provided)
    let existingAttendance: any[] = []
    if (date && sorted.length > 0) {
      const studentIds = sorted.map((s: any) => s.id)
      const { data: att } = await serviceSupabase
        .from('attendance')
        .select('student_id, status')
        .in('student_id', studentIds)
        .eq('date', date)

      existingAttendance = att ?? []
    }

    // Build a map for easy lookup: student_id -> status
    const attendanceMap: Record<string, string> = {}
    for (const record of existingAttendance) {
      attendanceMap[record.student_id] = record.status
    }

    return NextResponse.json({
      students: sorted,
      attendanceMap,
    })
  } catch (err: any) {
    console.error('Students-for-attendance API error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
