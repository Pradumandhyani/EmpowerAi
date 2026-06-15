import Link from 'next/link'
import { GraduationCap, ArrowRight, ShieldCheck, Zap, Users, BookOpen } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-slate-200 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
              <GraduationCap className="text-white" size={18} />
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">EduConnect</span>
          </div>
          <div className="flex gap-4">
            <Link href="/login" className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
              Log in
            </Link>
            <Link href="/register-school" className="px-4 py-2 text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm">
              Register School
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 overflow-hidden relative">
        {/* Decorative blobs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none">
          <div className="blob absolute top-20 -left-20 w-[500px] h-[500px] bg-indigo-200/50 mix-blend-multiply filter blur-3xl opacity-70 animate-blob" />
          <div className="blob absolute top-40 -right-20 w-[400px] h-[400px] bg-violet-200/50 mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000" />
          <div className="blob absolute -bottom-8 left-1/2 w-[600px] h-[600px] bg-sky-200/50 mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000" />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 font-medium text-sm border border-indigo-100 mb-8">
            <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
            The modern platform for schools & tutors
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight mb-8 leading-tight">
            Smarter tutoring, <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
              seamless management.
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Connect your school with professional tutors. Manage students, assignments, grading, and attendance — all in one powerful platform.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register-school" className="w-full sm:w-auto px-8 py-4 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2 text-lg">
              Partner with us <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-white px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Everything you need to succeed</h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-lg">Built from the ground up for schools and tutoring agencies to streamline education delivery.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Users className="text-indigo-600" size={24} />,
                title: 'Student Management',
                desc: 'Bulk import students, manage classes, and auto-generate login credentials instantly.'
              },
              {
                icon: <BookOpen className="text-emerald-600" size={24} />,
                title: 'Project Tracking',
                desc: 'Tutors can assign projects, grade submissions, and provide direct feedback to students.'
              },
              {
                icon: <ShieldCheck className="text-rose-600" size={24} />,
                title: 'Secure & Segregated',
                desc: 'Enterprise-grade Row Level Security ensures schools only see their own student data.'
              }
            ].map((feature, i) => (
              <div key={i} className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:border-indigo-100 hover:bg-indigo-50/50 transition-colors">
                <div className="h-12 w-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center mb-6 shadow-sm">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <GraduationCap className="text-indigo-400" size={24} />
            <span className="text-xl font-bold text-white">EduConnect</span>
          </div>
          <p>© 2024 EduConnect Platform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
