import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { generatePassword } from '@/lib/utils'
import { resend, FROM_EMAIL, APP_NAME } from '@/lib/email/resend'
import { WelcomeStudentEmail } from '@/lib/email/templates'

export async function POST(request: NextRequest) {
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

    const body = await request.json()
    const {
      name,
      email,
      phone,
      school_id,
      class_grade,
      section,
      roll_number,
      parent_name,
      parent_email,
      parent_phone
    } = body

    if (!name || !email || !school_id || !class_grade) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // If school admin, ensure school matches
    if (isSchoolAdmin && school_id !== profile.school_id) {
      return NextResponse.json({ error: 'Forbidden school context' }, { status: 403 })
    }

    const password = generatePassword()
    const adminSupabase = await createServiceClient()

    // Create user in Auth using Service Role to auto-confirm email
    const { data: authData, error: authError } = await adminSupabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        name,
        role: 'student',
        schoolId: school_id,
        school_id: school_id,
        classGrade: class_grade,
        class_grade: class_grade,
        section: section || null,
      }
    })

    if (authError) {
      console.error('Error creating auth user:', authError)
      return NextResponse.json({ error: authError.message }, { status: 400 })
    }

    const userId = authData.user.id

    // Update phone on users table (created by trigger)
    if (phone) {
      await adminSupabase
        .from('users')
        .update({ phone: phone })
        .eq('id', userId)
    }

    // Update remaining student details (created by trigger)
    await adminSupabase
      .from('students')
      .update({
        class_grade: class_grade,
        section: section || null,
        roll_number: roll_number || null,
        parent_name: parent_name || null,
        parent_email: parent_email || null,
        parent_phone: parent_phone || null,
      })
      .eq('user_id', userId)

    // Send welcome email
    try {
      const { data: school } = await adminSupabase.from('schools').select('name').eq('id', school_id).single()
      await resend.emails.send({
        from: FROM_EMAIL,
        to: email,
        subject: `Welcome to ${APP_NAME} — Your Student Credentials`,
        html: WelcomeStudentEmail({
          studentName: name,
          email: email,
          password,
          schoolName: school?.name ?? 'your school',
        }),
      })
    } catch (emailError) {
      console.error('Email send failed:', emailError)
    }

    // Fetch the newly created student record to return to caller
    const { data: newStudent } = await adminSupabase
      .from('students')
      .select('*, users!inner(*)')
      .eq('user_id', userId)
      .single()

    return NextResponse.json({ success: true, student: newStudent })
  } catch (err: any) {
    console.error('Create student API error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
