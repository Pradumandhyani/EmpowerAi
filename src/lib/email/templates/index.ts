export function WelcomeStudentEmail({ studentName, email, password, schoolName }: any) {
  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2>Welcome to empowerAiResearch, ${studentName}!</h2>
      <p>Your school, ${schoolName}, has added you to their platform.</p>
      <p>Here are your login details:</p>
      <ul>
        <li><strong>Email:</strong> ${email}</li>
        <li><strong>Temporary Password:</strong> ${password}</li>
      </ul>
      <p>Please log in and change your password immediately.</p>
      <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/login" style="display: inline-block; padding: 10px 20px; background-color: #4f46e5; color: white; text-decoration: none; border-radius: 5px;">Log in now</a>
    </div>
  `
}

export function ProjectAssignedEmail({ studentName, projectTitle, subject, dueDate, tutorName }: any) {
  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2>New Assignment: ${projectTitle}</h2>
      <p>Hi ${studentName},</p>
      <p>${tutorName} has assigned a new project for ${subject}.</p>
      <p><strong>Due Date:</strong> ${new Date(dueDate).toLocaleDateString()}</p>
      <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/student/projects" style="display: inline-block; padding: 10px 20px; background-color: #4f46e5; color: white; text-decoration: none; border-radius: 5px;">View Project</a>
    </div>
  `
}

export function GradePostedEmail({ studentName, projectTitle, marksObtained, maxMarks, feedback }: any) {
  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2>Grade Updated: ${projectTitle}</h2>
      <p>Hi ${studentName},</p>
      <p>Your tutor has graded your submission for "${projectTitle}".</p>
      <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <p style="font-size: 24px; margin: 0; color: #059669;"><strong>${marksObtained}</strong> / ${maxMarks}</p>
      </div>
      ${feedback ? `<p><strong>Feedback:</strong> ${feedback}</p>` : ''}
      <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/student/projects" style="display: inline-block; padding: 10px 20px; background-color: #4f46e5; color: white; text-decoration: none; border-radius: 5px;">View Details</a>
    </div>
  `
}

export function SchoolApprovedEmail({ contactName, schoolName, email, setupLink }: any) {
  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff;">
      <div style="background: linear-gradient(135deg, #4f46e5, #7c3aed); padding: 30px 20px; border-radius: 12px 12px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 24px;">🎉 Your School Has Been Approved!</h1>
      </div>
      <div style="padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
        <p style="color: #374151; font-size: 16px;">Hello <strong>${contactName}</strong>,</p>
        <p style="color: #374151;">Congratulations! <strong>${schoolName}</strong> has been approved on the empowerAiResearch platform. Your admin account is now ready.</p>

        <div style="background-color: #f3f4f6; border-left: 4px solid #4f46e5; padding: 20px; border-radius: 0 8px 8px 0; margin: 24px 0;">
          <p style="margin: 0 0 10px; color: #374151; font-weight: 600;">🔐 Your Account Details</p>
          <p style="margin: 4px 0; color: #374151;"><strong>Email:</strong> ${email}</p>
        </div>

        <div style="background-color: #fef3c7; border: 1px solid #fcd34d; padding: 14px 18px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0; color: #92400e; font-size: 14px;">⚠️ <strong>Important:</strong> You must set a password for your account using the secure link below before you can log in.</p>
        </div>

        <div style="text-align: center; margin-top: 28px;">
          <a href="${setupLink}" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #4f46e5, #7c3aed); color: white; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
            Set Your Password & Login →
          </a>
        </div>

        <p style="color: #9ca3af; font-size: 13px; margin-top: 28px; text-align: center;">
          If you did not request this, please ignore this email or contact our support team.
        </p>
      </div>
    </div>
  `
}

