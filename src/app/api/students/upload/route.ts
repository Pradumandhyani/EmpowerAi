import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/server'
import { parseStudentCSV } from '@/lib/csv/parseStudents'
import { generatePassword } from '@/lib/utils'
import { resend, FROM_EMAIL, APP_NAME } from '@/lib/email/resend'
import { WelcomeStudentEmail } from '@/lib/email/templates'

export async function POST(request: NextRequest) {
  try {
    const callerSupabase = await createClient()
    const { data: { user } } = await callerSupabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: profile } = await callerSupabase
      .from('users').select('role, school_id, schools(name)').eq('id', user.id).single()

    if (!['super_admin', 'school_admin'].includes(profile?.role ?? '')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const school_id = (formData.get('school_id') as string) ?? profile?.school_id

    if (!file || !school_id) {
      return NextResponse.json({ error: 'Missing file or school_id' }, { status: 400 })
    }

    const { valid, errors } = await parseStudentCSV(file)

    if (valid.length === 0) {
      return NextResponse.json({ error: 'No valid rows found', errors }, { status: 400 })
    }

    const adminSupabase = await createServiceClient()
    const { data: school } = await adminSupabase.from('schools').select('name').eq('id', school_id).single()

    const results = { created: 0, skipped: 0, errors: [...errors] }

    for (const row of valid) {
      const password = generatePassword()

      // Create auth user
      const { data: authData, error: authError } = await adminSupabase.auth.admin.createUser({
        email: row.email,
        password,
        email_confirm: true,
        user_metadata: { name: row.name, role: 'student', school_id },
      })

      if (authError) {
        results.skipped++
        results.errors.push({ row: 0, message: `${row.email}: ${authError.message}` })
        continue
      }

      // Create student record
      await adminSupabase.from('students').insert({
        user_id: authData.user.id,
        school_id,
        class_grade: row.class_grade,
        section: row.section,
        parent_name: row.parent_name ?? null,
        parent_email: row.parent_email ?? null,
        parent_phone: row.parent_phone ?? null,
        roll_number: row.roll_number ?? null,
      })

      // Send welcome email
      try {
        await resend.emails.send({
          from: FROM_EMAIL,
          to: row.email,
          subject: `Welcome to ${APP_NAME} — Your Login Credentials`,
          html: WelcomeStudentEmail({
            studentName: row.name,
            email: row.email,
            password,
            schoolName: school?.name ?? 'your school',
          }),
        })
      } catch (emailError) {
        // Don't fail the whole operation if email fails
        console.error('Email send failed:', emailError)
      }

      results.created++
    }

    return NextResponse.json(results)
  } catch (err) {
    console.error('Upload error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
