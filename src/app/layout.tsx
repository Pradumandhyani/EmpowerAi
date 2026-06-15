import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'EduConnect — Smarter School Tutoring',
    template: '%s | EduConnect',
  },
  description:
    'EduConnect connects schools with professional tutors. Manage students, classes, projects, and grades — all in one place.',
  keywords: ['tutoring', 'school management', 'online education', 'student portal', 'EduConnect'],
  openGraph: {
    title: 'EduConnect — Smarter School Tutoring',
    description: 'Connect your school with professional tutors on the EduConnect platform.',
    type: 'website',
    locale: 'en_IN',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased bg-slate-50 text-slate-900">{children}</body>
    </html>
  )
}
