import type { Metadata } from 'next'
import { GraduationCap } from 'lucide-react'

export const metadata: Metadata = { title: 'Sign In' }

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex flex-col">
      {/* Decorative blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="blob absolute -top-40 -left-40 h-80 w-80 bg-indigo-500/20" />
        <div className="blob absolute -bottom-40 -right-40 h-96 w-96 bg-violet-500/20" />
        <div className="blob absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-64 bg-sky-500/10" />
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center gap-3 px-8 py-6">
        <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg">
          <GraduationCap className="text-white" size={18} />
        </div>
        <span className="text-xl font-bold text-white tracking-tight">EduConnect</span>
      </header>

      {/* Content */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 py-12">
        {children}
      </div>

      <footer className="relative z-10 text-center py-6 text-slate-500 text-sm">
        © 2024 EduConnect. All rights reserved.
      </footer>
    </div>
  )
}
