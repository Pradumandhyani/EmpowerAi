import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'

interface DashboardShellProps {
  children: React.ReactNode
  role: 'super_admin' | 'school_admin' | 'tutor' | 'student'
  userName: string
  schoolName?: string
  pageTitle: string
}

export function DashboardShell({ children, role, userName, schoolName, pageTitle }: DashboardShellProps) {
  return (
    <div className="min-h-screen bg-slate-50 flex">
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
  )
}
