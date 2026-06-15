'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { GraduationCap, LayoutDashboard, Users, BookOpen, Settings, Building2, UserCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

const navLinks = {
  super_admin: [
    { name: 'Overview', href: '/super-admin', icon: LayoutDashboard },
    { name: 'Schools', href: '/super-admin/schools', icon: Building2 },
    { name: 'Tutors', href: '/super-admin/tutors', icon: UserCircle },
  ],
  school_admin: [
    { name: 'Dashboard', href: '/school-admin', icon: LayoutDashboard },
    { name: 'Students', href: '/school-admin/students', icon: Users },
  ],
  tutor: [
    { name: 'Schedule', href: '/tutor', icon: LayoutDashboard },
    { name: 'Projects', href: '/tutor/projects', icon: BookOpen },
  ],
  student: [
    { name: 'Dashboard', href: '/student', icon: LayoutDashboard },
    { name: 'My Projects', href: '/student/projects', icon: BookOpen },
  ],
}

export function Sidebar({ role }: { role: keyof typeof navLinks }) {
  const pathname = usePathname()
  const links = navLinks[role] || []

  return (
    <div className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col text-slate-300">
      <div className="h-16 flex items-center gap-3 px-6 border-b border-slate-800">
        <div className="h-8 w-8 rounded-lg bg-indigo-500 flex items-center justify-center">
          <GraduationCap className="text-white" size={18} />
        </div>
        <span className="font-bold text-white tracking-tight">EduConnect</span>
      </div>

      <nav className="flex-1 py-6 px-4 space-y-1">
        <div className="mb-4 px-2">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            {role.replace('_', ' ')}
          </p>
        </div>
        {links.map((link) => {
          const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`)
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-indigo-600/10 text-indigo-400'
                  : 'hover:bg-slate-800 hover:text-white'
              )}
            >
              <link.icon size={18} className={isActive ? 'text-indigo-400' : 'text-slate-500'} />
              {link.name}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <Link href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-800 hover:text-white transition-colors text-slate-400">
          <Settings size={18} className="text-slate-500" />
          Settings
        </Link>
      </div>
    </div>
  )
}
