import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { resend, FROM_EMAIL, APP_NAME } from '@/lib/email/resend'
import { ProjectAssignedEmail, GradePostedEmail } from '@/lib/email/templates'

export async function POST(request: NextRequest) {
  try {
    const callerSupabase = await createClient()
    const { data: { user } } = await callerSupabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const { type, data } = body

    if (type === 'project_assigned') {
      const { to, studentName, projectTitle, subject, dueDate, tutorName } = data
      const result = await resend.emails.send({
        from: FROM_EMAIL,
        to,
        subject: `New Project Assigned: ${projectTitle}`,
        html: ProjectAssignedEmail({ studentName, projectTitle, subject, dueDate, tutorName }),
      })
      return NextResponse.json({ success: true, id: result.data?.id })
    }

    if (type === 'grade_posted') {
      const { to, studentName, projectTitle, marksObtained, maxMarks, feedback } = data
      const result = await resend.emails.send({
        from: FROM_EMAIL,
        to,
        subject: `Your Grade is Posted: ${projectTitle}`,
        html: GradePostedEmail({ studentName, projectTitle, marksObtained, maxMarks, feedback }),
      })
      return NextResponse.json({ success: true, id: result.data?.id })
    }

    return NextResponse.json({ error: 'Unknown email type' }, { status: 400 })
  } catch (err) {
    console.error('Email error:', err)
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }
}
