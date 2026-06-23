'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { LogOut, Bell, Menu } from 'lucide-react'
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
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-10">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
          aria-label="Open sidebar"
        >
          <Menu size={22} />
        </button>
        <h2 className="text-base sm:text-lg font-bold text-slate-900 truncate max-w-[180px] sm:max-w-none">{pageTitle}</h2>
      </div>

      <div className="flex items-center gap-3 sm:gap-6">
        <button className="text-slate-400 hover:text-slate-600 relative p-1.5 rounded-lg hover:bg-slate-50">
          <Bell size={20} />
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500 border-2 border-white" />
        </button>

        <div className="flex items-center gap-2 sm:gap-3 pl-3 sm:pl-6 border-l border-slate-200">
          <div className="text-right hidden md:block">
            <p className="text-sm font-semibold text-slate-900">{userName}</p>
            {schoolName && <p className="text-xs text-slate-500">{schoolName}</p>}
          </div>
          <Avatar name={userName} size="sm" />
          <button onClick={handleLogout} className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors" title="Log out">
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </header>
  )
}
