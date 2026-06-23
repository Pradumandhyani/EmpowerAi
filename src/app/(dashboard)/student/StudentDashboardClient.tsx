'use client'

import { Badge } from '@/components/ui'
import { CheckCircle2, Clock, TrendingUp, Target, Globe, Brain, Cpu, Shield, Database, Smartphone } from 'lucide-react'

export function StudentDashboardClient({ projects, submissions }: any) {
  const pendingProjects = projects.filter((p: any) => !submissions.find((s: any) => s.project_id === p.id))
  const gradedSubmissions = submissions.filter((s: any) => s.marks_obtained !== null)

  // Calculate average score
  const avgScore = gradedSubmissions.length > 0
    ? Math.round(gradedSubmissions.reduce((acc: number, s: any) => {
        const p = projects.find((proj: any) => proj.id === s.project_id)
        return p ? acc + Math.round((s.marks_obtained / p.max_marks) * 100) : acc
      }, 0) / gradedSubmissions.length)
    : null

  const stats = [
    {
      label: 'Pending Tasks',
      value: pendingProjects.length,
      icon: Clock,
      gradient: 'from-amber-500 to-orange-500',
      bg: 'rgba(251,191,36,0.1)',
      border: 'rgba(251,191,36,0.25)',
      accent: '--accent: linear-gradient(90deg, #f59e0b, #f97316)',
    },
    {
      label: 'Submitted',
      value: submissions.length,
      icon: CheckCircle2,
      gradient: 'from-emerald-500 to-teal-500',
      bg: 'rgba(16,185,129,0.1)',
      border: 'rgba(16,185,129,0.25)',
      accent: '--accent: linear-gradient(90deg, #10b981, #14b8a6)',
    },
    {
      label: 'Avg Score',
      value: avgScore !== null ? `${avgScore}%` : '—',
      icon: TrendingUp,
      gradient: 'from-indigo-500 to-violet-600',
      bg: 'rgba(99,102,241,0.1)',
      border: 'rgba(99,102,241,0.25)',
      accent: '--accent: linear-gradient(90deg, #6366f1, #8b5cf6)',
    },
  ]

  const skills = [
    {
      title: 'Web Development',
      level: 'Beginner → Advanced',
      desc: 'Build modern responsive websites and interactive web applications.',
      icon: Globe,
      color: 'from-blue-500 to-indigo-600',
      badge: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      progress: 75,
      tasks: '6 of 8 projects'
    },
    {
      title: 'Artificial Intelligence',
      level: 'Intermediate',
      desc: 'Learn prompt engineering, neural network foundations, and use LLMs.',
      icon: Brain,
      color: 'from-violet-500 to-purple-600',
      badge: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
      progress: 40,
      tasks: '2 of 5 projects'
    },
    {
      title: 'Machine Learning',
      level: 'Intermediate → Advanced',
      desc: 'Build, evaluate, and deploy classification and regression models.',
      icon: Cpu,
      color: 'from-emerald-500 to-teal-600',
      badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      progress: 25,
      tasks: '1 of 4 projects'
    },
    {
      title: 'Ethical Hacking',
      level: 'Intermediate',
      desc: 'Understand computer network security, vulnerabilities, and penetration testing.',
      icon: Shield,
      color: 'from-rose-500 to-red-600',
      badge: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
      progress: 85,
      tasks: '5 of 6 projects'
    },
    {
      title: 'Data Science',
      level: 'Beginner → Advanced',
      desc: 'Analyze, clean, and visualize data using Python, Pandas, and Matplotlib.',
      icon: Database,
      color: 'from-amber-500 to-orange-600',
      badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      progress: 60,
      tasks: '3 of 5 projects'
    },
    {
      title: 'App Development',
      level: 'Beginner → Advanced',
      desc: 'Build Android & iOS apps using React Native, Flutter, and mobile APIs.',
      icon: Smartphone,
      color: 'from-cyan-500 to-sky-600',
      badge: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
      progress: 10,
      tasks: '0 of 3 projects'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div
        className="relative rounded-2xl p-6 overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #312e81 0%, #1e1b4b 40%, #0f0c29 100%)',
          boxShadow: '0 8px 32px rgba(99,102,241,0.3)',
        }}
      >
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full filter blur-3xl -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-1/3 w-48 h-48 bg-violet-600/20 rounded-full filter blur-2xl translate-y-1/2" />
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)`,
            backgroundSize: '32px 32px',
          }}
        />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 text-white/80 text-xs font-medium border border-white/15 mb-3">
              <Target size={11} />
              Learning Dashboard
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white leading-tight">
              Keep up the great work! 🚀
            </h1>
            <p className="text-indigo-200/80 text-sm mt-1">
              {pendingProjects.length > 0
                ? `You have ${pendingProjects.length} task${pendingProjects.length > 1 ? 's' : ''} waiting for you.`
                : `You're all caught up! Great job.`}
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon
          return (
            <div
              key={i}
              className="stat-card relative rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1"
              style={{
                background: 'white',
                border: `1px solid ${stat.border}`,
                boxShadow: '0 4px 20px rgba(15,23,42,0.06)',
                ['--accent' as any]: `linear-gradient(90deg, #6366f1, #8b5cf6)`,
              }}
            >
              {/* Top accent bar */}
              <div
                className={`absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl bg-gradient-to-r ${stat.gradient}`}
              />
              <div className="flex items-center gap-4">
                <div
                  className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center flex-shrink-0 shadow-lg`}
                >
                  <Icon size={22} className="text-white" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{stat.label}</p>
                  <p className="text-2xl font-black text-slate-900 leading-none mt-1">{stat.value}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Skills Tracker Section */}
      <div className="space-y-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">Skill Development Tracks</h2>
          <p className="text-xs text-slate-500">Track your progress across core modern technical tracks</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {skills.map((skill, idx) => {
            const Icon = skill.icon
            return (
              <div
                key={idx}
                className="group relative bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col hover:-translate-y-0.5"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`h-11 w-11 rounded-xl bg-gradient-to-br ${skill.color} flex items-center justify-center text-white shadow-sm`}>
                    <Icon size={20} />
                  </div>
                  <span className={`inline-block px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full border ${skill.badge}`}>
                    {skill.level}
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 text-sm mb-1">{skill.title}</h3>
                <p className="text-xs text-slate-400 mb-4 leading-relaxed flex-1">{skill.desc}</p>
                <div className="space-y-1.5 mt-auto">
                  <div className="flex justify-between items-center text-[10px] font-semibold">
                    <span className="text-slate-400">Progress</span>
                    <span className="text-indigo-600 font-bold">{skill.progress}% ({skill.tasks})</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${skill.color} transition-all duration-500`}
                      style={{ width: `${skill.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
