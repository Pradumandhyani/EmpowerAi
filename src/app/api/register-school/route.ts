import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { school_name, contact_name, email, phone, student_count, message } = body

    if (!school_name || !contact_name || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const serviceSupabase = await createServiceClient()

    // Insert into school_inquiries for tracking
    const { error: inquiryError } = await serviceSupabase.from('school_inquiries').insert({
      school_name,
      contact_name,
      email,
      phone: phone || null,
      student_count: student_count ? parseInt(student_count) : null,
      message: message || null,
      status: 'new',
    })

    if (inquiryError) {
      return NextResponse.json({ error: inquiryError.message }, { status: 400 })
    }

    // Create pending schools record so it shows up in super admin's pending approvals
    const { error: schoolError } = await serviceSupabase.from('schools').insert({
      name: school_name,
      contact_email: email,
      address: null,
      subscription_plan: 'basic',
      subscription_status: 'trial',
      status: 'pending',
    })

    if (schoolError) {
      return NextResponse.json({ error: schoolError.message }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Register school error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
