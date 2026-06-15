import { Resend } from 'resend'

export const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy_key_for_build')
export const FROM_EMAIL = 'EduConnect <noreply@educonnect.app>'
export const APP_NAME = 'EduConnect'
