import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const ROLE_REDIRECTS: Record<string, string> = {
  super_admin: '/super-admin',
  school_admin: '/school-admin',
  tutor: '/tutor/projects',
  student: '/student',
}

export function formatDate(dateStr: string, format?: string) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  if (format === 'MMM d') {
    return d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })
  }
  if (format === 'MMM d, h:mm a') {
    return d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })
  }
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

export function generatePassword() {
  return Math.random().toString(36).slice(-8) + '!' + Math.random().toString(36).slice(-4)
}
