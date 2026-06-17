'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { User, Mail, Lock, Building2, GraduationCap, Eye, EyeOff, CheckCircle } from 'lucide-react'

// Simple helper Field component matching the login page theme
function Field({ icon, label, id, ...props }: { icon: React.ReactNode; label: string; id: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-sm font-medium text-slate-200">{label}</label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">{icon}</span>
        <input
          id={id}
          className="w-full h-11 pl-10 pr-4 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all"
          {...props}
        />
      </div>
    </div>
  )
}

export default function StudentSignupPage() {
  const router = useRouter()
  const supabase = createClient()

  const [schools, setSchools] = useState<{ id: string; name: string }[]>([])
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    schoolId: '',
    classGrade: '9',
    section: '',
  })

  // Fetch approved schools for the dropdown
  useEffect(() => {
    async function getSchools() {
      const { data, error: fetchError } = await supabase
        .from('schools')
        .select('id, name')
        .eq('status', 'approved')
        .order('name')

      if (!fetchError && data) {
        setSchools(data)
        if (data.length > 0) {
          setForm((prev) => ({ ...prev, schoolId: data[0].id }))
        }
      }
    }
    getSchools()
  }, [supabase])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (!form.schoolId) {
      setError('Please select your school.')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/students/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          schoolId: form.schoolId,
          classGrade: form.classGrade,
          section: form.section || null,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed.')
      }

      setSubmitted(true)
    } catch (err: any) {
      setError(err.message || 'An error occurred during registration.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="w-full max-w-md text-center">
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-10 shadow-2xl">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <CheckCircle className="text-emerald-400" size={36} />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">Registration Successful!</h2>
          <p className="text-slate-300 text-sm leading-relaxed mb-6">
            Your student account has been created. You can now log in using your email and password.
          </p>
          <Link
            href="/login"
            className="inline-block w-full bg-indigo-500 hover:bg-indigo-600 text-white py-3 rounded-lg font-medium transition-colors"
          >
            Go to Login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-lg">
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-8 shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">Student Registration</h1>
          <p className="text-slate-300 text-sm">Register to track your coding progress</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Field
            icon={<User size={16} />}
            label="Full Name *"
            id="name"
            placeholder="John Doe"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />

          <Field
            icon={<Mail size={16} />}
            label="Email Address *"
            id="email"
            type="email"
            placeholder="john.doe@student.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-200">Password *</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Choose a strong password"
                required
                minLength={6}
                className="w-full h-11 pl-10 pr-11 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="school" className="text-sm font-medium text-slate-200">School *</label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <select
                  id="school"
                  value={form.schoolId}
                  onChange={(e) => setForm({ ...form, schoolId: e.target.value })}
                  required
                  className="w-full h-11 pl-10 pr-4 rounded-lg bg-[#1e293b] border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all appearance-none cursor-pointer"
                >
                  {schools.length === 0 ? (
                    <option value="">No approved schools found</option>
                  ) : (
                    schools.map((school) => (
                      <option key={school.id} value={school.id} className="bg-slate-800 text-white">
                        {school.name}
                      </option>
                    ))
                  )}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label htmlFor="classGrade" className="text-sm font-medium text-slate-200">Grade *</label>
                <div className="relative">
                  <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <select
                    id="classGrade"
                    value={form.classGrade}
                    onChange={(e) => setForm({ ...form, classGrade: e.target.value })}
                    required
                    className="w-full h-11 pl-10 pr-4 rounded-lg bg-[#1e293b] border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all appearance-none cursor-pointer"
                  >
                    <option value="9" className="bg-slate-800 text-white">9th</option>
                    <option value="10" className="bg-slate-800 text-white">10th</option>
                    <option value="11" className="bg-slate-800 text-white">11th</option>
                    <option value="12" className="bg-slate-800 text-white">12th</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="section" className="text-sm font-medium text-slate-200">Section</label>
                <input
                  id="section"
                  type="text"
                  placeholder="A, B, C"
                  value={form.section}
                  onChange={(e) => setForm({ ...form, section: e.target.value })}
                  maxLength={10}
                  className="w-full h-11 px-4 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all"
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500/30 rounded-lg px-4 py-3">
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-semibold rounded-lg hover:from-indigo-600 hover:to-violet-700 transition-all active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : null}
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-white/10 text-center">
          <p className="text-slate-400 text-sm">
            Already have an account?{' '}
            <Link href="/login" className="text-indigo-400 hover:text-indigo-300 font-medium">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
