'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Building2, Mail, Phone, User, Users, MessageSquare, CheckCircle } from 'lucide-react'
import Link from 'next/link'

// Moved OUTSIDE the component to prevent re-creation on every render (which caused input focus loss)
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

export default function RegisterSchoolPage() {
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    school_name: '',
    contact_name: '',
    email: '',
    phone: '',
    student_count: '',
    message: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error: dbError } = await supabase.from('school_inquiries').insert({
      school_name: form.school_name,
      contact_name: form.contact_name,
      email: form.email,
      phone: form.phone || null,
      student_count: form.student_count ? parseInt(form.student_count) : null,
      message: form.message || null,
    })

    if (dbError) {
      setError(dbError.message)
    } else {
      setSubmitted(true)
    }
    setLoading(false)
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
          <h2 className="text-2xl font-bold text-white mb-3">Application Submitted!</h2>
          <p className="text-slate-300 text-sm leading-relaxed mb-6">
            Thank you for your interest in EduConnect. Our team will review your application and reach out within 2 business days.
          </p>
          <Link
            href="/login"
            className="inline-block bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Back to Login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-lg">
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-8 shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">Register Your School</h1>
          <p className="text-slate-300 text-sm">Apply to join the EduConnect platform</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Field
            icon={<Building2 size={16} />}
            label="School Name *"
            id="school_name"
            placeholder="Sunrise Academy"
            value={form.school_name}
            onChange={(e) => setForm({ ...form, school_name: e.target.value })}
            required
          />
          <Field
            icon={<User size={16} />}
            label="Contact Person Name *"
            id="contact_name"
            placeholder="Dr. Priya Sharma"
            value={form.contact_name}
            onChange={(e) => setForm({ ...form, contact_name: e.target.value })}
            required
          />
          <Field
            icon={<Mail size={16} />}
            label="Email Address *"
            id="reg_email"
            type="email"
            placeholder="principal@sunriseacademy.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <Field
            icon={<Phone size={16} />}
            label="Phone Number"
            id="phone"
            type="tel"
            placeholder="+91 98765 43210"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
          <Field
            icon={<Users size={16} />}
            label="Approximate Number of Students"
            id="student_count"
            type="number"
            placeholder="500"
            value={form.student_count}
            onChange={(e) => setForm({ ...form, student_count: e.target.value })}
          />

          <div className="space-y-1.5">
            <label htmlFor="message" className="text-sm font-medium text-slate-200">Message (optional)</label>
            <div className="relative">
              <MessageSquare className="absolute left-3 top-3 text-slate-400" size={16} />
              <textarea
                id="message"
                rows={3}
                placeholder="Tell us about your school and requirements..."
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all resize-none"
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500/30 rounded-lg px-4 py-3">
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          <button
            id="register-school-submit"
            type="submit"
            disabled={loading}
            className="w-full h-11 bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-semibold rounded-lg hover:from-indigo-600 hover:to-violet-700 transition-all active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading && (
              <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            )}
            {loading ? 'Submitting...' : 'Submit Application'}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-white/10 text-center">
          <p className="text-slate-400 text-sm">
            Already have an account?{' '}
            <Link href="/login" className="text-indigo-400 hover:text-indigo-300 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
