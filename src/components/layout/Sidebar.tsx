'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  GraduationCap, LayoutDashboard, Users, BookOpen,
  Settings, Building2, UserCircle, ClipboardList, ChevronRight
} from 'lucide-react'
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
    { name: 'My Students', href: '/tutor/students', icon: Users },
    { name: 'Attendance', href: '/tutor/attendance', icon: ClipboardList },
  ],
  student: [
    { name: 'Dashboard', href: '/student', icon: LayoutDashboard },
    { name: 'My Projects', href: '/student/projects', icon: BookOpen },
  ],
}

const roleLabels: Record<string, string> = {
  super_admin: 'Super Admin',
  school_admin: 'School Admin',
  tutor: 'Tutor',
  student: 'Student',
}

const roleColors: Record<string, string> = {
  super_admin: 'from-rose-500 to-pink-600',
  school_admin: 'from-amber-500 to-orange-600',
  tutor: 'from-emerald-500 to-teal-600',
  student: 'from-indigo-500 to-violet-600',
}

export function Sidebar({ role, onNavigate }: { role: keyof typeof navLinks; onNavigate?: () => void }) {
  const pathname = usePathname()
  const links = navLinks[role] || []

  return (
    <div
      className="w-64 flex flex-col h-full text-slate-300"
      style={{
        background: 'linear-gradient(180deg, #0d1117 0%, #111827 40%, #0d1117 100%)',
        borderRight: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {/* Logo */}
      <div className="h-16 flex items-center gap-3 px-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg flex-shrink-0"
          style={{ boxShadow: '0 0 20px rgba(99,102,241,0.4)' }}>
          <GraduationCap className="text-white" size={16} />
        </div>
        <span className="font-black text-white text-sm tracking-tight leading-none">
          empower<span className="text-gradient">Ai</span>
          <br />
          <span className="text-slate-400 font-medium text-xs tracking-wider">Research</span>
        </span>
      </div>

      {/* Role badge */}
      <div className="px-4 pt-5 pb-2">
        <div className={`flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r ${roleColors[role] || 'from-indigo-500 to-violet-600'} bg-opacity-15`}
          style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.2)' }}>
          <div className={`h-2 w-2 rounded-full bg-gradient-to-r ${roleColors[role] || 'from-indigo-400 to-violet-400'} animate-pulse`} />
          <span className="text-xs font-semibold text-white/80 tracking-wide">{roleLabels[role] || role}</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-3 px-3 space-y-0.5 overflow-y-auto">
        <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest px-3 py-2">Navigation</p>
        {links.map((link) => {
          const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`)
          const Icon = link.icon
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={onNavigate}
              className={cn(
                'group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                isActive
                  ? 'text-white nav-active'
                  : 'text-slate-400 hover:text-white hover:bg-white/6'
              )}
              style={isActive ? {
                background: 'linear-gradient(135deg, rgba(99,102,241,0.2) 0%, rgba(139,92,246,0.15) 100%)',
                border: '1px solid rgba(99,102,241,0.25)',
              } : {}}
            >
              <div className={cn(
                'h-7 w-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-200',
                isActive
                  ? 'bg-gradient-to-br from-indigo-500 to-violet-600 shadow-md'
                  : 'bg-white/6 group-hover:bg-white/10'
              )}>
                <Icon size={15} className={isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'} />
              </div>
              <span className="flex-1">{link.name}</span>
              {isActive && <ChevronRight size={14} className="text-indigo-400 flex-shrink-0" />}
            </Link>
          )
        })}
      </nav>

      {/* Bottom settings */}
      <div className="p-3" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <Link
          href="#"
          onClick={onNavigate}
          className="group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:text-white hover:bg-white/6 transition-all duration-200"
        >
          <div className="h-7 w-7 rounded-lg bg-white/6 group-hover:bg-white/10 flex items-center justify-center flex-shrink-0 transition-all">
            <Settings size={15} className="text-slate-500 group-hover:text-slate-300" />
          </div>
          Settings
        </Link>
      </div>
    </div>
  )
}
