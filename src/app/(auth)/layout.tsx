import type { Metadata } from 'next'
import { GraduationCap, Brain, Shield, Globe, Sparkles } from 'lucide-react'

export const metadata: Metadata = { title: 'Sign In' }

const highlights = [
  { icon: Brain, text: 'AI-Powered Learning Paths' },
  { icon: Shield, text: 'Enterprise-grade Security' },
  { icon: Globe, text: 'Learn Anytime, Anywhere' },
]

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex" style={{ background: '#07090f' }}>

      {/* ── Left Panel — Branding (hidden on mobile) ─── */}
      <div className="hidden lg:flex lg:w-[54%] relative overflow-hidden flex-col">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=1400&q=80&auto=format&fit=crop')`,
          }}
        />
        {/* Overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, rgba(7,11,20,0.92) 0%, rgba(49,46,129,0.88) 50%, rgba(88,28,135,0.82) 100%)',
          }}
        />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)`,
            backgroundSize: '48px 48px',
          }}
        />

        {/* Decorative blobs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="blob absolute -top-32 -left-32 w-[500px] h-[500px] bg-indigo-600/30 mix-blend-screen filter blur-3xl" />
          <div className="blob blob-delay-2 absolute bottom-0 right-0 w-[400px] h-[400px] bg-violet-700/30 mix-blend-screen filter blur-3xl" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col h-full p-10">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-xl">
              <GraduationCap className="text-white" size={20} />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">
              empower<span className="text-gradient">Ai</span>Research
            </span>
          </div>

          {/* Central content */}
          <div className="flex-1 flex flex-col justify-center max-w-md">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/80 text-xs font-semibold mb-6 w-fit">
              <Sparkles size={12} />
              AI-Powered Education Platform
            </div>
            <h1 className="text-4xl xl:text-5xl font-black text-white leading-tight mb-5">
              Unlock Your Full
              <br />
              <span className="text-gradient">Learning Potential</span>
            </h1>
            <p className="text-slate-300/80 text-base leading-relaxed mb-8">
              Join thousands of students and educators on empowerAiResearch — the platform designed to make learning smarter, faster, and more effective.
            </p>

            {/* Highlights */}
            <div className="space-y-3">
              {highlights.map((h, i) => {
                const Icon = h.icon
                return (
                  <div key={i} className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-white/10 border border-white/15 flex items-center justify-center flex-shrink-0">
                      <Icon size={16} className="text-indigo-300" />
                    </div>
                    <span className="text-slate-200 text-sm font-medium">{h.text}</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Bottom tagline */}
          <p className="text-slate-500 text-xs">
            © 2025 empowerAiResearch. All rights reserved.
          </p>
        </div>
      </div>

      {/* ── Right Panel — Form ─────────────────────────── */}
      <div className="flex-1 flex flex-col" style={{ background: '#0c1120' }}>
        {/* Mobile header */}
        <header className="lg:hidden flex items-center gap-2.5 px-6 py-5 border-b border-white/8">
          <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
            <GraduationCap className="text-white" size={16} />
          </div>
          <span className="text-base font-bold text-white">
            empower<span className="text-gradient">Ai</span>Research
          </span>
        </header>

        {/* Subtle mesh background */}
        <div className="absolute inset-0 lg:left-[54%] pointer-events-none overflow-hidden">
          <div className="blob absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-indigo-900/30 filter blur-3xl" />
          <div className="blob blob-delay-2 absolute bottom-0 left-0 w-[300px] h-[300px] bg-violet-900/20 filter blur-3xl" />
        </div>

        {/* Centered form */}
        <div className="relative z-10 flex-1 flex items-center justify-center px-6 py-12">
          {children}
        </div>

        <footer className="relative z-10 lg:hidden text-center py-4 text-slate-600 text-xs px-4">
          © 2025 empowerAiResearch. All rights reserved.
        </footer>
      </div>
    </div>
  )
}
