import { Resend } from 'resend'

export const resend = new Resend(process.env.RESEND_API_KEY!)

export const FROM_EMAIL = 'empowerAiResearch <onboarding@resend.dev>'
export const APP_NAME = 'empowerAiResearch'