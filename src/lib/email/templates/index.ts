export function WelcomeStudentEmail({ studentName, email, password, schoolName }: any) {
  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2>Welcome to EduConnect, ${studentName}!</h2>
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
