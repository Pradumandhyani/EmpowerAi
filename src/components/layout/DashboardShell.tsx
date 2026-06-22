import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'
import { cookies } from 'next/headers'
import { StopImpersonatingButton } from './StopImpersonatingButton'
import { ShieldAlert } from 'lucide-react'

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

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {isImpersonating && (
        <div className="bg-amber-600 text-white text-xs font-semibold px-6 py-2.5 flex items-center justify-between shadow-sm shrink-0 border-b border-amber-700 select-none">
          <div className="flex items-center gap-2">
            <ShieldAlert size={14} className="text-amber-100 shrink-0" />
            <span>Impersonation Mode Active: Logged in as <strong>{schoolName || 'School Administrator'}</strong>. All operations will run under this school's context.</span>
          </div>
          <StopImpersonatingButton />
        </div>
      )}
      <div className="flex-1 flex">
        <Sidebar role={role} />
        <div className="flex-1 flex flex-col min-w-0">
          <Topbar userName={userName} schoolName={schoolName} pageTitle={pageTitle} />
          <main className="flex-1 p-6 overflow-y-auto">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
