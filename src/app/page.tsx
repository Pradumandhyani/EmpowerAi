import Link from 'next/link'
import { GraduationCap, ArrowRight, ShieldCheck, Zap, Users, BookOpen, Code, Sparkles } from 'lucide-react'

export default function LandingPage() {
  const students = [
    {
      name: 'Aarav Mehta',
      grade: '9th Grade',
      subject: 'Python Basics',
      school: 'Global International School',
      image: '/images/students/student-9a.jpg',
      color: 'from-blue-500 to-indigo-500'
    },
    {
      name: 'Sarah Jenkins',
      grade: '9th Grade',
      subject: 'Web Development (HTML/CSS)',
      school: 'Oakridge Academy',
      image: '/images/students/student-9b.jpg',
      color: 'from-pink-500 to-rose-500'
    },
    {
      name: 'Chloe Dupont',
      grade: '10th Grade',
      subject: 'JavaScript Fundamentals',
      school: 'Riverdale High',
      image: '/images/students/student-10a.jpg',
      color: 'from-amber-500 to-orange-500'
    },
    {
      name: 'Kenji Sato',
      grade: '10th Grade',
      subject: 'Scratch & Game Dev',
      school: 'Global International School',
      image: '/images/students/student-10b.jpg',
      color: 'from-emerald-500 to-teal-500'
    },
    {
      name: 'Priya Patel',
      grade: '11th Grade',
      subject: 'Data Structures & Algorithmic Thinking',
      school: 'Oakridge Academy',
      image: '/images/students/student-11a.jpg',
      color: 'from-purple-500 to-indigo-500'
    },
    {
      name: 'Mateo Rodriguez',
      grade: '11th Grade',
      subject: 'React Frontend Applications',
      school: 'Riverdale High',
      image: '/images/students/student-11b.jpg',
      color: 'from-cyan-500 to-blue-500'
    },
    {
      name: 'Liam O\'Connor',
      grade: '12th Grade',
      subject: 'AI & Machine Learning Intro',
      school: 'Oakridge Academy',
      image: '/images/students/student-12a.jpg',
      color: 'from-violet-500 to-purple-500'
    },
    {
      name: 'Aisha Al-Mansoor',
      grade: '12th Grade',
      subject: 'Database Design & SQL',
      school: 'Global International School',
      image: '/images/students/student-12b.jpg',
      color: 'from-fuchsia-500 to-pink-500'
    }
  ]

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
          <div className="flex gap-3 items-center">
            <Link href="/login" className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
              Log in
            </Link>
            <Link href="/student-signup" className="px-4 py-2 text-sm font-medium border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors">
              Student Sign Up
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
            <Link href="/student-signup" className="w-full sm:w-auto px-8 py-4 bg-white text-indigo-600 border border-slate-200 rounded-xl font-medium hover:bg-slate-50 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 flex items-center justify-center gap-2 text-lg">
              Student Sign Up <GraduationCap size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Student Cards Section */}
      <section className="py-24 bg-slate-50 px-6 border-t border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-medium text-sm border border-emerald-100 mb-4">
              <Sparkles size={14} /> Meet Our Coding Pioneers
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Empowering Students Across Grades 9–12
            </h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-lg">
              Our students learn real-world coding skills, build projects, and collaborate with experienced tutors. Here is a glimpse of our top performers.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {students.map((student, idx) => (
              <div
                key={idx}
                className="group relative bg-white rounded-2xl overflow-hidden border border-slate-100 hover:border-slate-200 hover:shadow-xl transition-all duration-300 flex flex-col hover:-translate-y-1"
              >
                {/* Image / Header gradient fallback */}
                <div className="relative h-48 bg-slate-100 overflow-hidden flex items-center justify-center">
                  <div className={`absolute inset-0 bg-gradient-to-tr ${student.color} opacity-90 transition-opacity group-hover:opacity-100`} />
                  {/* Aspect-ratio helper for real images, else show initials icon */}
                  <img
                    src={student.image}
                    alt={student.name}
                    className="w-full h-full object-cover mix-blend-overlay opacity-80"
                  />
                  <div className="absolute inset-0 flex flex-col justify-end p-4 text-white bg-gradient-to-t from-slate-950/80 to-transparent">
                    <span className="px-2.5 py-1 text-xs font-semibold bg-white/20 backdrop-blur-md rounded-full w-fit">
                      {student.grade}
                    </span>
                    <h3 className="text-lg font-bold mt-1.5 leading-tight">{student.name}</h3>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <Code className="text-slate-400 mt-1 flex-shrink-0" size={16} />
                      <div>
                        <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Focus Subject</p>
                        <p className="text-sm font-medium text-slate-800">{student.subject}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <GraduationCap className="text-slate-400 mt-1 flex-shrink-0" size={16} />
                      <div>
                        <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">School</p>
                        <p className="text-sm text-slate-600">{student.school}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 pt-4 border-t border-slate-50 flex items-center justify-between text-xs font-medium text-indigo-600 group-hover:text-indigo-700">
                    <span>View Projects</span>
                    <ArrowRight size={14} className="transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-white px-6 border-t border-slate-100">
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
