import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { resend, FROM_EMAIL } from '@/lib/email/resend'
import { SchoolApprovedEmail } from '@/lib/email/templates'

/** Generates a random alphanumeric password of given length */
function generateTempPassword(length = 10): string {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

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
    const { schoolId } = body

    if (!schoolId) {
      return NextResponse.json({ error: 'schoolId is required' }, { status: 400 })
    }

    const serviceSupabase = await createServiceClient()

    // 1. Get the school record
    const { data: school, error: schoolFetchError } = await serviceSupabase
      .from('schools')
      .select('id, name, contact_email, status')
      .eq('id', schoolId)
      .single()

    if (schoolFetchError || !school) {
      return NextResponse.json({ error: 'School not found' }, { status: 404 })
    }

    if (school.status === 'approved') {
      return NextResponse.json({ error: 'School is already approved' }, { status: 400 })
    }

    // 2. Update school status to 'approved'
    const { error: updateError } = await serviceSupabase
      .from('schools')
      .update({ status: 'approved' })
      .eq('id', schoolId)

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 400 })
    }

    // 3. Update school_inquiries status to 'converted' if exists
    await serviceSupabase
      .from('school_inquiries')
      .update({ status: 'converted' })
      .eq('email', school.contact_email)
      .eq('status', 'new')

    // 4. Look up the inquiry to get contact name for the email
    const { data: inquiry } = await serviceSupabase
      .from('school_inquiries')
      .select('contact_name')
      .eq('email', school.contact_email)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    const contactName = inquiry?.contact_name ?? school.name

    // 5. Check if a school_admin user already exists for this email
    const { data: existingUser } = await serviceSupabase
      .from('users')
      .select('id')
      .eq('email', school.contact_email)
      .eq('role', 'school_admin')
      .single()

    if (existingUser) {
      return NextResponse.json({ error: 'A school admin account already exists for this email' }, { status: 400 })
    }

    // 6. Generate a temporary password
    const tempPassword = generateTempPassword(10)

    // 7. Create the school_admin auth user
    const { data: authData, error: createUserError } = await serviceSupabase.auth.admin.createUser({
      email: school.contact_email,
      password: tempPassword,
      email_confirm: true,
      user_metadata: {
        name: contactName,
        role: 'school_admin',
        school_id: school.id,
        must_change_password: true,
      },
    })

    if (createUserError) {
      // Rollback school status on auth user creation failure
      await serviceSupabase.from('schools').update({ status: 'pending' }).eq('id', schoolId)
      return NextResponse.json({ error: createUserError.message }, { status: 400 })
    }

    // 7.5 Generate password setup link (recovery link)
    const { data: linkData, error: linkError } = await serviceSupabase.auth.admin.generateLink({
      type: 'recovery',
      email: school.contact_email,
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback?next=/change-password`
      }
    })

    if (linkError) {
      // Rollback school status and delete the created auth user
      await serviceSupabase.auth.admin.deleteUser(authData.user.id)
      await serviceSupabase.from('schools').update({ status: 'pending' }).eq('id', schoolId)
      return NextResponse.json({ error: linkError.message }, { status: 400 })
    }

    const setupLink = linkData.properties.action_link

    // 8. Send approval email with secure setup link
    try {
      await resend.emails.send({
        from: FROM_EMAIL,
        to: school.contact_email,
        subject: `🎉 Your school "${school.name}" has been approved on empowerAiResearch!`,
        html: SchoolApprovedEmail({
          contactName,
          schoolName: school.name,
          email: school.contact_email,
          setupLink,
        }),
      })
    } catch (emailError) {
      // Email failure is non-fatal — account is already created
      console.error('Email send error:', emailError)
    }

    return NextResponse.json({
      success: true,
      message: 'School approved and credentials sent to the registered email.',
      userId: authData.user.id,
    })
  } catch (err) {
    console.error('Approve school error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
