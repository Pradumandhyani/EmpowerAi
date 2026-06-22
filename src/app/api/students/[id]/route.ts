import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const callerSupabase = await createClient()
    const { data: { user } } = await callerSupabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: profile } = await callerSupabase
      .from('users')
      .select('role, school_id')
      .eq('id', user.id)
      .single()

    const isSuperAdmin = profile?.role === 'super_admin'
    const isSchoolAdmin = profile?.role === 'school_admin'

    if (!isSuperAdmin && !isSchoolAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { id } = await params
    const body = await request.json()
    const {
      name,
      phone,
      class_grade,
      section,
      roll_number,
      parent_name,
      parent_email,
      parent_phone,
      is_active
    } = body

    const adminSupabase = await createServiceClient()

    // Fetch student to verify school context
    const { data: student, error: fetchError } = await adminSupabase
      .from('students')
      .select('*')
      .eq('id', id)
      .single()

    if (fetchError || !student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 })
    }

    if (isSchoolAdmin && student.school_id !== profile.school_id) {
      return NextResponse.json({ error: 'Forbidden school context' }, { status: 403 })
    }

    // 1. Update users table (name, phone, is_active)
    const { error: userError } = await adminSupabase
      .from('users')
      .update({
        name: name,
        phone: phone || null,
        is_active: is_active !== undefined ? is_active : true
      })
      .eq('id', student.user_id)

    if (userError) {
      return NextResponse.json({ error: userError.message }, { status: 400 })
    }

    // 2. Update students table
    const { error: studentError } = await adminSupabase
      .from('students')
      .update({
        class_grade: class_grade,
        section: section || null,
        roll_number: roll_number || null,
        parent_name: parent_name || null,
        parent_email: parent_email || null,
        parent_phone: parent_phone || null
      })
      .eq('id', id)

    if (studentError) {
      return NextResponse.json({ error: studentError.message }, { status: 400 })
    }

    // 3. Update auth user metadata to keep in sync
    await adminSupabase.auth.admin.updateUserById(student.user_id, {
      user_metadata: {
        name,
        classGrade: class_grade,
        class_grade: class_grade,
        section: section || null
      }
    })

    // Fetch the updated student record to return
    const { data: updatedStudent } = await adminSupabase
      .from('students')
      .select('*, users!inner(*)')
      .eq('id', id)
      .single()

    return NextResponse.json({ success: true, student: updatedStudent })
  } catch (err: any) {
    console.error('Update student API error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const callerSupabase = await createClient()
    const { data: { user } } = await callerSupabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: profile } = await callerSupabase
      .from('users')
      .select('role, school_id')
      .eq('id', user.id)
      .single()

    const isSuperAdmin = profile?.role === 'super_admin'
    const isSchoolAdmin = profile?.role === 'school_admin'

    if (!isSuperAdmin && !isSchoolAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { id } = await params
    const adminSupabase = await createServiceClient()

    // Fetch student to get user_id and verify school
    const { data: student, error: fetchError } = await adminSupabase
      .from('students')
      .select('*')
      .eq('id', id)
      .single()

    if (fetchError || !student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 })
    }

    if (isSchoolAdmin && student.school_id !== profile.school_id) {
      return NextResponse.json({ error: 'Forbidden school context' }, { status: 403 })
    }

    // Delete auth user, cascading to users and students DB tables
    const { error: deleteError } = await adminSupabase.auth.admin.deleteUser(student.user_id)

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 400 })
    }

    return NextResponse.json({ success: true, message: 'Student account deleted successfully' })
  } catch (err: any) {
    console.error('Delete student API error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
