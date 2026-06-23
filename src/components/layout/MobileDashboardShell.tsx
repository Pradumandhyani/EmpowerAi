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
    <div className="min-h-screen flex flex-col" style={{ background: '#f0f2f8' }}>
      {/* Optional impersonating banner */}
      {impersonatingBanner}

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)' }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar Drawer */}
      <div
        className={`fixed inset-y-0 left-0 z-50 lg:hidden transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Close Button */}
        <button
          onClick={() => setSidebarOpen(false)}
          className="absolute top-3 right-[-46px] z-50 h-10 w-10 rounded-full flex items-center justify-center text-white transition-all hover:bg-white/20"
          style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)' }}
          aria-label="Close menu"
        >
          <X size={18} />
        </button>
        <Sidebar role={role} onNavigate={() => setSidebarOpen(false)} />
      </div>

      {/* Main Layout */}
      <div className="flex-1 flex">
        {/* Desktop Sidebar */}
        <div className="hidden lg:flex lg:flex-col lg:shrink-0">
          <Sidebar role={role} />
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col min-w-0">
          <MobileTopbar
            userName={userName}
            schoolName={schoolName}
            pageTitle={pageTitle}
            onMenuClick={() => setSidebarOpen(true)}
          />
          <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
