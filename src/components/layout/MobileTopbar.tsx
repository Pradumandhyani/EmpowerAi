'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { LogOut, Bell, Menu, Search } from 'lucide-react'
import { Avatar } from '@/components/ui'

interface MobileTopbarProps {
  userName: string
  schoolName?: string
  pageTitle: string
  onMenuClick: () => void
}

export function MobileTopbar({ userName, schoolName, pageTitle, onMenuClick }: MobileTopbarProps) {
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <header
      className="h-16 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-10"
      style={{
        background: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(15,23,42,0.08)',
        boxShadow: '0 1px 12px rgba(15,23,42,0.06)',
      }}
    >
      {/* Left: hamburger + title */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onMenuClick}
          className="lg:hidden h-9 w-9 rounded-xl flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-all flex-shrink-0"
          aria-label="Open sidebar"
        >
          <Menu size={20} />
        </button>
        <div className="min-w-0">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 truncate leading-tight">{pageTitle}</h2>
          {schoolName && (
            <p className="text-xs text-slate-400 truncate hidden sm:block leading-none mt-0.5">{schoolName}</p>
          )}
        </div>
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
        {/* Notification bell */}
        <button className="relative h-9 w-9 rounded-xl flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-all">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 border-2 border-white" />
        </button>

        {/* Divider */}
        <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block" />

        {/* User info + avatar */}
        <div className="flex items-center gap-2.5">
          <div className="text-right hidden md:block">
            <p className="text-sm font-semibold text-slate-900 leading-tight">{userName}</p>
            {schoolName && <p className="text-xs text-slate-400 leading-none mt-0.5 truncate max-w-[120px]">{schoolName}</p>}
          </div>
          <Avatar name={userName} size="sm" />
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="h-9 w-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all ml-1"
          title="Log out"
        >
          <LogOut size={17} />
        </button>
      </div>
    </header>
  )
}
