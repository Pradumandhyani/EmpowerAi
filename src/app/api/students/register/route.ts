import { createServiceClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { name, email, password, schoolId, classGrade, section } = await request.json()

    // Validation
    if (!name || !email || !password || !schoolId || !classGrade) {
      return NextResponse.json(
        { error: 'Name, email, password, school, and class/grade are required.' },
        { status: 400 }
      )
    }

    const supabase = await createServiceClient()

    // Create user in Auth using Service Role to auto-confirm email
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email for easy demo login
      user_metadata: {
        name,
        role: 'student',
        school_id: schoolId,
        class_grade: classGrade,
        section: section || null,
      }
    })

    if (authError) {
      console.error('Error creating auth user:', authError)
      return NextResponse.json({ error: authError.message }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: 'Student account registered successfully. You can now log in.',
      user: {
        id: authData.user.id,
        email: authData.user.email,
        name
      }
    })
  } catch (error: any) {
    console.error('Registration API error:', error)
    return NextResponse.json(
      { error: error.message || 'An unexpected error occurred during registration.' },
      { status: 500 }
    )
  }
}
