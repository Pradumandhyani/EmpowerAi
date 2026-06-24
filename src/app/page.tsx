import Link from 'next/link'
import {
  GraduationCap, ArrowRight, ShieldCheck, Zap, Users, BookOpen,
  Code, Sparkles, Globe, Brain, Shield, Cpu, Database, Smartphone,
  CheckCircle, Star, TrendingUp, Award, Clock, ChevronRight
} from 'lucide-react'

export default function LandingPage() {
  const skills = [
    {
      title: 'Web Development',
      level: 'Beginner → Advanced',
      desc: 'HTML, CSS, JavaScript, React & full-stack frameworks to build modern web applications.',
      gradient: 'from-blue-500 via-indigo-500 to-indigo-600',
      glow: 'hover:shadow-blue-500/25',
      badge: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
      icon: Globe,
    },
    {
      title: 'Artificial Intelligence',
      level: 'Intermediate',
      desc: 'Fundamentals of AI, prompt engineering, LLMs, and building intelligent applications.',
      gradient: 'from-violet-500 via-purple-500 to-fuchsia-600',
      glow: 'hover:shadow-violet-500/25',
      badge: 'bg-violet-500/15 text-violet-300 border-violet-500/30',
      icon: Brain,
    },
    {
      title: 'Machine Learning',
      level: 'Intermediate → Advanced',
      desc: 'Supervised & unsupervised learning, neural networks, model training and evaluation.',
      gradient: 'from-emerald-500 via-teal-500 to-cyan-600',
      glow: 'hover:shadow-emerald-500/25',
      badge: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
      icon: Cpu,
    },
    {
      title: 'Ethical Hacking',
      level: 'Intermediate',
      desc: 'Penetration testing, vulnerability assessment, network security, and CTF challenges.',
      gradient: 'from-rose-500 via-red-500 to-orange-600',
      glow: 'hover:shadow-rose-500/25',
      badge: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
      icon: Shield,
    },
    {
      title: 'Data Science',
      level: 'Beginner → Advanced',
      desc: 'Python, Pandas, data visualisation, statistical analysis, and real-world datasets.',
      gradient: 'from-amber-500 via-orange-500 to-red-500',
      glow: 'hover:shadow-amber-500/25',
      badge: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
      icon: Database,
    },
    {
      title: 'App Development',
      level: 'Beginner → Advanced',
      desc: 'Build Android & iOS apps using React Native, Flutter, and modern mobile frameworks.',
      gradient: 'from-cyan-500 via-sky-500 to-blue-600',
      glow: 'hover:shadow-cyan-500/25',
      badge: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
      icon: Smartphone,
    },
    {
      title: 'Python Programming',
      level: 'Beginner',
      desc: 'Core Python syntax, OOP, scripting, automation, and project-based coding exercises.',
      gradient: 'from-yellow-400 via-amber-500 to-orange-500',
      glow: 'hover:shadow-yellow-500/25',
      badge: 'bg-yellow-500/15 text-yellow-300 border-yellow-500/30',
      icon: Code,
    },
    {
      title: 'Cloud Computing',
      level: 'Intermediate',
      desc: 'AWS, GCP & Azure fundamentals, serverless architecture, and cloud-native deployment.',
      gradient: 'from-indigo-500 via-blue-500 to-cyan-500',
      glow: 'hover:shadow-indigo-500/25',
      badge: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
      icon: Zap,
    },
  ]

  const stats = [
    { value: '500+', label: 'Schools Enrolled', icon: GraduationCap },
    { value: '12K+', label: 'Active Students', icon: Users },
    { value: '98%', label: 'Satisfaction Rate', icon: Star },
    { value: '50+', label: 'Expert Tutors', icon: Award },
  ]

  const features = [
    {
      icon: Users,
      title: 'Student Management',
      desc: 'Bulk import students, manage classes, and auto-generate login credentials instantly.',
      gradient: 'from-indigo-500 to-blue-600',
      points: ['CSV bulk upload', 'Auto-login credentials', 'Class & section management'],
    },
    {
      icon: BookOpen,
      title: 'Project Tracking',
      desc: 'Tutors can assign projects, grade submissions, and provide direct feedback to students.',
      gradient: 'from-emerald-500 to-teal-600',
      points: ['Deadline management', 'Rich grading system', 'Submission tracking'],
    },
    {
      icon: ShieldCheck,
      title: 'Secure & Segregated',
      desc: 'Enterprise-grade Row Level Security ensures schools only see their own data.',
      gradient: 'from-rose-500 to-pink-600',
      points: ['Role-based access', 'Data isolation', 'Audit trail'],
    },
  ]

  const mentors = [
    {
      name: 'Mr. Mohit Kumar Sharma',
      role: 'Computer Science Academician & Researcher',
      image: '/mohit.jpg',
      bio: 'Mohit Kumar Sharma is an experienced Computer Science academician and researcher with expertise in AI, Machine Learning, Cloud Computing, IoT, and Cybersecurity. With over a decade of teaching and research experience, he has published extensively, holds multiple patents, and is dedicated to mentoring students and advancing technology-driven education.',
      tags: ['AI', 'Machine Learning', 'Cloud Computing', 'IoT', 'Cybersecurity'],
      gradient: 'from-blue-500 via-indigo-500 to-indigo-600',
      badge: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
      glow: 'hover:shadow-blue-500/25',
    },
    {
      name: 'Mrs. Prachi Kapoor',
      role: 'Computer Science Graduate (Honours) & M.Tech Researcher',
      image: '/prachi.jpg',
      bio: 'Prachi Kapoor, Computer Science graduate (Honours) and M.Tech researcher with 8+ years of experience in AI, Network Security, and Intelligent Systems. Actively engaged in research on AI-based network security solutions and passionate about technological innovation and lifelong learning.',
      tags: ['AI', 'Network Security', 'Intelligent Systems', 'Research'],
      gradient: 'from-violet-500 via-purple-500 to-fuchsia-600',
      badge: 'bg-violet-500/15 text-violet-300 border-violet-500/30',
      glow: 'hover:shadow-violet-500/25',
    },
    {
      name: 'Mr. Pradumb Dhyani',
      role: 'Software Developer & Assistant Professor',
      image: '/pradumb.jpg',
      bio: 'Pradumb Dhyani is a Software Developer, Assistant Professor, and competitive programmer specializing in Java, DSA, Web Development, and Data Science. With experience in both industry and academia, he has mentored hundreds of students, developed enterprise software solutions, and solved over 2,500 coding problems, making him passionate about delivering practical, industry-focused technology education.',
      tags: ['Java', 'DSA', 'Web Dev', 'Data Science', 'Competitive Programming'],
      gradient: 'from-emerald-500 via-teal-500 to-cyan-600',
      badge: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
      glow: 'hover:shadow-emerald-500/25',
    }
  ]

  return (
    <div className="min-h-screen font-sans overflow-x-hidden" style={{ background: '#070b14' }}>

      {/* ── Premium Navigation ─────────────────────────── */}
      <nav className="fixed top-0 w-full z-50 transition-all duration-300">
        <div className="glass-dark border-b border-white/8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg glow-indigo">
                <GraduationCap className="text-white" size={16} />
              </div>
              <span className="text-base sm:text-lg font-bold text-white tracking-tight">
                empower<span className="text-gradient">Ai</span>
                <span className="hidden xs:inline">Research</span>
              </span>
            </div>

            {/* Desktop nav buttons */}
            <div className="hidden sm:flex gap-2 items-center">
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors rounded-lg hover:bg-white/8"
              >
                Log in
              </Link>
              <Link
                href="/student-signup"
                className="px-4 py-2 text-sm font-semibold border border-indigo-500/60 text-indigo-300 rounded-xl hover:bg-indigo-500/15 hover:border-indigo-400 transition-all hover:text-white"
              >
                Student Sign Up
              </Link>
              <Link
                href="/register-school"
                className="px-4 py-2 text-sm font-semibold bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl hover:from-indigo-500 hover:to-violet-500 transition-all shadow-lg hover:shadow-indigo-500/30 hover:-translate-y-px"
              >
                Register School
              </Link>
            </div>

            {/* Mobile: only login button */}
            <div className="flex sm:hidden items-center gap-2">
              <Link
                href="/login"
                className="px-3 py-1.5 text-sm font-medium text-slate-300 hover:text-white transition-colors rounded-lg hover:bg-white/8"
              >
                Log in
              </Link>
              <Link
                href="/register-school"
                className="px-3 py-1.5 text-xs font-semibold bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl"
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* ── Hero Section with background image ─────────── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background image with overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1920&q=80&auto=format&fit=crop')`,
          }}
        />
        <div className="hero-overlay absolute inset-0" />

        {/* Animated blobs on top of hero */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="blob blob-delay-1 absolute top-1/4 -left-32 w-[600px] h-[600px] bg-indigo-600/20 mix-blend-screen filter blur-3xl" />
          <div className="blob blob-delay-2 absolute -top-20 right-10 w-[500px] h-[500px] bg-violet-600/20 mix-blend-screen filter blur-3xl" />
          <div className="blob blob-delay-3 absolute bottom-0 left-1/3 w-[400px] h-[400px] bg-cyan-500/15 mix-blend-screen filter blur-3xl" />
        </div>

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center pt-20 sm:pt-16">
          {/* Pill badge */}
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full glass border border-white/20 text-xs sm:text-sm font-medium text-white/90 mb-6 sm:mb-8 animate-in">
            <span className="relative flex h-2 w-2 flex-shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-400" />
            </span>
            The AI-powered platform for modern education
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white leading-[1.08] tracking-tight mb-5 sm:mb-6 slide-up">
            Empower Your
            <br />
            <span className="text-gradient">AI Learning</span>
            <br />
            Journey
          </h1>

          <p className="text-sm sm:text-lg md:text-xl text-slate-300/90 mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed fade-in px-2" style={{ animationDelay: '0.1s' }}>
            Connect schools with expert tutors. Manage students, projects, attendance and grades
            — all in one beautifully designed platform built for the AI era.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-10 sm:mb-16 fade-in" style={{ animationDelay: '0.2s' }}>
            <Link
              href="/register-school"
              className="group w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-2xl font-bold hover:from-indigo-500 hover:to-violet-500 transition-all shadow-2xl shadow-indigo-900/50 hover:shadow-indigo-500/40 hover:-translate-y-1 flex items-center justify-center gap-2.5 text-sm sm:text-base"
            >
              Partner with Us
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/student-signup"
              className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 glass text-white rounded-2xl font-semibold hover:bg-white/15 transition-all hover:-translate-y-1 flex items-center justify-center gap-2 sm:gap-2.5 text-sm sm:text-base border border-white/20 hover:border-white/40"
            >
              <GraduationCap size={16} />
              Student Sign Up
            </Link>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto fade-in" style={{ animationDelay: '0.3s' }}>
            {stats.map((stat, i) => {
              const Icon = stat.icon
              return (
                <div key={i} className="glass rounded-2xl p-4 border border-white/15 hover:bg-white/12 transition-all">
                  <Icon className="text-indigo-400 mx-auto mb-2" size={20} />
                  <p className="text-2xl font-black text-white">{stat.value}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{stat.label}</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-slate-400 animate-bounce">
          <div className="w-5 h-8 rounded-full border-2 border-slate-500 flex items-start justify-center pt-1.5">
            <div className="w-1 h-1.5 rounded-full bg-slate-400 animate-pulse" />
          </div>
        </div>
      </section>

      {/* ── Skills Section ──────────────────────────────── */}
      <section className="py-28 px-4 sm:px-6 relative" style={{ background: '#0c1020' }}>
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-900/20 rounded-full filter blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/15 border border-violet-500/30 text-violet-300 text-sm font-semibold mb-5">
              <Sparkles size={14} />
              Cutting-Edge Skill Tracks
            </div>
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-4 leading-tight">
              Skills That Shape the
              <span className="text-gradient"> Future</span>
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed">
              From foundational coding to advanced AI and cybersecurity — our curriculum is crafted for the skills that matter most in today's world.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {skills.map((skill, idx) => {
              const Icon = skill.icon
              return (
                <div
                  key={idx}
                  className={`group relative rounded-2xl overflow-hidden border border-white/8 hover:border-white/20 transition-all duration-500 ${skill.glow} hover:shadow-2xl cursor-default`}
                  style={{ background: 'rgba(255,255,255,0.04)' }}
                >
                  {/* Gradient Top Strip */}
                  <div className={`relative h-40 bg-gradient-to-br ${skill.gradient} flex items-center justify-center overflow-hidden`}>
                    {/* Noise overlay */}
                    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.3)_0%,_transparent_70%)]" />
                    {/* Floating icon */}
                    <div className="relative float">
                      <Icon size={56} className="text-white/90 drop-shadow-2xl" />
                    </div>
                    {/* Glow circle behind icon */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-24 h-24 rounded-full bg-white/10 blur-2xl" />
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5">
                    <span className={`inline-block px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full border mb-3 ${skill.badge}`}>
                      {skill.level}
                    </span>
                    <h3 className="text-base font-bold text-white mb-2 leading-tight">{skill.title}</h3>
                    <p className="text-sm text-slate-400 leading-relaxed">{skill.desc}</p>
                  </div>

                  {/* Hover shimmer effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none shimmer rounded-2xl" />
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Features Section with image ─────────────────── */}
      <section className="py-28 px-4 sm:px-6 relative overflow-hidden">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=80&auto=format&fit=crop')`,
          }}
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(7,11,20,0.96) 0%, rgba(30,27,75,0.93) 50%, rgba(7,11,20,0.96) 100%)' }} />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-sm font-semibold mb-5">
              <TrendingUp size={14} />
              Platform Features
            </div>
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
              Everything You Need to
              <span className="text-gradient"> Succeed</span>
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">
              Built from the ground up for schools and tutoring agencies to streamline education delivery.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, i) => {
              const Icon = feature.icon
              return (
                <div
                  key={i}
                  className="group relative rounded-2xl p-7 border border-white/10 hover:border-white/20 transition-all duration-500 overflow-hidden"
                  style={{ background: 'rgba(255,255,255,0.05)' }}
                >
                  {/* Top gradient accent */}
                  <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${feature.gradient} rounded-t-2xl`} />

                  <div className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-5 shadow-xl group-hover:scale-110 transition-transform duration-300`}>
                    <Icon size={26} className="text-white" />
                  </div>

                  <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-slate-400 leading-relaxed mb-5">{feature.desc}</p>

                  <ul className="space-y-2">
                    {feature.points.map((point, j) => (
                      <li key={j} className="flex items-center gap-2.5 text-sm text-slate-300">
                        <CheckCircle size={15} className="text-emerald-400 shrink-0" />
                        {point}
                      </li>
                    ))}
                  </ul>

                  {/* Hover glow */}
                  <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-[0.04]`} />
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Mentors Section ────────────────────────────── */}
      <section className="py-28 px-4 sm:px-6 relative" style={{ background: '#070b14' }}>
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-violet-900/10 rounded-full filter blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-sm font-semibold mb-5">
              <Users size={14} />
              Expert Mentors
            </div>
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-4 leading-tight">
              Meet Our
              <span className="text-gradient"> Educational Advisors</span>
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed">
              Get guided by experienced software developers, researchers, and technical specialists dedicated to your growth.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mentors.map((mentor, idx) => (
              <div
                key={idx}
                className={`group flex flex-col h-full rounded-2xl overflow-hidden border border-white/8 hover:border-white/20 transition-all duration-500 ${mentor.glow} hover:shadow-2xl`}
                style={{ background: 'rgba(255,255,255,0.04)' }}
              >
                {/* Card Header Cover */}
                <div className={`h-24 bg-gradient-to-r ${mentor.gradient} relative opacity-90 group-hover:opacity-100 transition-opacity duration-300`}>
                  <div
                    className="absolute inset-0 opacity-[0.08] mix-blend-overlay"
                    style={{
                      backgroundImage: `radial-gradient(circle, #fff 10%, transparent 11%)`,
                      backgroundSize: '12px 12px',
                    }}
                  />
                </div>

                {/* Mentor Avatar */}
                <div className="px-6 -mt-10 relative z-10 flex justify-between items-end">
                  <div className="relative w-20 h-20 rounded-2xl overflow-hidden border-4 border-[#070b14] shadow-xl bg-slate-800 flex-shrink-0">
                    <img
                      src={mentor.image}
                      alt={mentor.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  
                </div>

                {/* Content */}
                <div className="p-6 pt-4 flex-1 flex flex-col">
                  <h3 className="font-extrabold text-white text-lg group-hover:text-indigo-400 transition-colors duration-200">
                    {mentor.name}
                  </h3>
                  <p className="text-xs font-semibold text-indigo-300 mt-1 leading-snug">
                    {mentor.role}
                  </p>
                  
                  <p className="text-sm text-slate-400 mt-4 leading-relaxed flex-1">
                    {mentor.bio}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mt-5">
                    {mentor.tags.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className={`text-[10px] font-bold border rounded-md px-2 py-0.5 ${mentor.badge}`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Section ────────────────────────────────── */}
      <section className="py-24 px-4 sm:px-6 relative overflow-hidden" style={{ background: '#0c1020' }}>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="blob absolute -top-20 -left-20 w-[500px] h-[500px] bg-indigo-600/25 filter blur-3xl" />
          <div className="blob blob-delay-2 absolute -bottom-20 -right-20 w-[500px] h-[500px] bg-violet-600/25 filter blur-3xl" />
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-sm font-semibold mb-6">
            <Clock size={14} />
            Get started in minutes
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-white mb-6 leading-tight">
            Ready to Transform
            <br />
            <span className="text-gradient">Your School?</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
            Join hundreds of schools already using empowerAiResearch to deliver world-class tutoring experiences.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register-school"
              className="group px-8 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-2xl font-bold text-lg hover:from-indigo-500 hover:to-violet-500 transition-all shadow-2xl shadow-indigo-900/60 hover:shadow-indigo-500/40 hover:-translate-y-1 flex items-center justify-center gap-2"
            >
              Register Your School
              <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/login"
              className="px-8 py-4 glass text-white rounded-2xl font-semibold text-lg border border-white/20 hover:bg-white/12 transition-all hover:-translate-y-1 flex items-center justify-center gap-2"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────── */}
      <footer style={{ background: '#07090f', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                <GraduationCap className="text-white" size={18} />
              </div>
              <span className="text-lg font-bold text-white">
                empower<span className="text-gradient">Ai</span>Research
              </span>
            </div>
            <p className="text-slate-500 text-sm">© empowerAiResearch Platform. All rights reserved.</p>
            <div className="flex gap-6 text-sm text-slate-500">
              <Link href="/login" className="hover:text-slate-300 transition-colors">Sign In</Link>
              <Link href="/register-school" className="hover:text-slate-300 transition-colors">Register School</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
