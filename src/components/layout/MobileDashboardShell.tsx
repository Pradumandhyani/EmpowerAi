'use client'

import { useState, useEffect } from 'react'
import { Sidebar } from './Sidebar'
import { MobileTopbar } from './MobileTopbar'
import { X } from 'lucide-react'

interface MobileDashboardShellProps {
  children: React.ReactNode
  role: 'super_admin' | 'school_admin' | 'tutor' | 'student'
  userName: string
  schoolName?: string
  pageTitle: string
  impersonatingBanner?: React.ReactNode
}

export function MobileDashboardShell({
  children,
  role,
  userName,
  schoolName,
  pageTitle,
  impersonatingBanner,
}: MobileDashboardShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Close sidebar on route change
  useEffect(() => {
    setSidebarOpen(false)
  }, [pageTitle])

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [sidebarOpen])

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {impersonatingBanner}

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar Drawer */}
      <div
        className={`fixed inset-y-0 left-0 z-50 lg:hidden transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Close button inside the drawer */}
        <button
          onClick={() => setSidebarOpen(false)}
          className="absolute top-4 right-[-44px] z-50 h-9 w-9 rounded-full bg-white shadow-md flex items-center justify-center text-slate-600 hover:text-slate-900"
          aria-label="Close menu"
        >
          <X size={18} />
        </button>
        <Sidebar role={role} onNavigate={() => setSidebarOpen(false)} />
      </div>

      {/* Main layout */}
      <div className="flex-1 flex">
        {/* Desktop Sidebar (always visible on lg+) */}
        <div className="hidden lg:block">
          <Sidebar role={role} />
        </div>

        {/* Content area */}
        <div className="flex-1 flex flex-col min-w-0">
          <MobileTopbar
            userName={userName}
            schoolName={schoolName}
            pageTitle={pageTitle}
            onMenuClick={() => setSidebarOpen(true)}
          />
          <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
