import { cookies } from 'next/headers'
import { StopImpersonatingButton } from './StopImpersonatingButton'
import { ShieldAlert } from 'lucide-react'
import { MobileDashboardShell } from './MobileDashboardShell'

interface DashboardShellProps {
  children: React.ReactNode
  role: 'super_admin' | 'school_admin' | 'tutor' | 'student'
  userName: string
  schoolName?: string
  pageTitle: string
}

export async function DashboardShell({ children, role, userName, schoolName, pageTitle }: DashboardShellProps) {
  const cookieStore = await cookies()
  const isImpersonating = cookieStore.get('impersonate_school_id')?.value ? true : false

  const impersonatingBanner = isImpersonating ? (
    <div className="bg-amber-600 text-white text-xs font-semibold px-6 py-2.5 flex items-center justify-between shadow-sm shrink-0 border-b border-amber-700 select-none">
      <div className="flex items-center gap-2">
        <ShieldAlert size={14} className="text-amber-100 shrink-0" />
        <span>Impersonation Mode Active: Logged in as <strong>{schoolName || 'School Administrator'}</strong>. All operations will run under this school's context.</span>
      </div>
      <StopImpersonatingButton />
    </div>
  ) : null

  return (
    <MobileDashboardShell
      role={role}
      userName={userName}
      schoolName={schoolName}
      pageTitle={pageTitle}
      impersonatingBanner={impersonatingBanner}
    >
      {children}
    </MobileDashboardShell>
  )
}
