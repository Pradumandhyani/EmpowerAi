'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { LogOut, Bell } from 'lucide-react'
import { Avatar } from '@/components/ui'

interface TopbarProps {
  userName: string
  schoolName?: string
  pageTitle: string
}

export function Topbar({ userName, schoolName, pageTitle }: TopbarProps) {
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-10">
      <div>
        <h2 className="text-lg font-bold text-slate-900">{pageTitle}</h2>
      </div>

      <div className="flex items-center gap-6">
        <button className="text-slate-400 hover:text-slate-600 relative">
          <Bell size={20} />
          <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500 border-2 border-white" />
        </button>

        <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-slate-900">{userName}</p>
            {schoolName && <p className="text-xs text-slate-500">{schoolName}</p>}
          </div>
          <Avatar name={userName} size="sm" />
          <button onClick={handleLogout} className="ml-2 text-slate-400 hover:text-red-600 transition-colors" title="Log out">
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </header>
  )
}
