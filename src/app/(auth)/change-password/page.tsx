'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Lock, Eye, EyeOff, ShieldCheck, CheckCircle } from 'lucide-react'

export default function ChangePasswordPage() {
  const router = useRouter()
  const supabase = createClient()

  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(true)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const [form, setForm] = useState({
    newPassword: '',
    confirmPassword: '',
  })

  // Guard: only accessible to logged-in users with must_change_password flag
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.replace('/login')
        return
      }
      // If user doesn't need to change password, redirect to their dashboard
      if (!user.user_metadata?.must_change_password) {
        router.replace('/login')
        return
      }
      setChecking(false)
    })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (form.newPassword.length < 6) {
      setError('Password must be at least 6 characters long.')
      return
    }

    if (form.newPassword !== form.confirmPassword) {
      setError('Passwords do not match. Please try again.')
      return
    }

    setLoading(true)

    // Update the password and clear the must_change_password flag
    const { error: updateError } = await supabase.auth.updateUser({
      password: form.newPassword,
      data: { must_change_password: false },
    })

    if (updateError) {
      setError(updateError.message)
      setLoading(false)
      return
    }

    // Sign out so user can log in fresh with new password
    await supabase.auth.signOut()
    setDone(true)
    setLoading(false)
  }

  if (checking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-center">
        <div className="h-8 w-8 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (done) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-10 shadow-2xl text-center">
            <div className="flex justify-center mb-5">
              <div className="h-16 w-16 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <CheckCircle className="text-emerald-400" size={36} />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">Password Updated!</h2>
            <p className="text-slate-300 text-sm leading-relaxed mb-8">
              Your new password has been set successfully. Please log in again with your email and new password to access your dashboard.
            </p>
            <button
              onClick={() => router.push('/login')}
              className="w-full h-11 bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-semibold rounded-lg hover:from-indigo-600 hover:to-violet-700 transition-all active:scale-95"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex flex-col">
      {/* Decorative blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 h-80 w-80 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-violet-500/20 blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center gap-3 px-8 py-6">
        <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg">
          <ShieldCheck className="text-white" size={18} />
        </div>
        <span className="text-xl font-bold text-white tracking-tight">empowerAiResearch</span>
      </header>

      {/* Form */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-8 shadow-2xl">
            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="h-14 w-14 rounded-full bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center">
                <Lock className="text-indigo-300" size={26} />
              </div>
            </div>

            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-white mb-2">Set Your New Password</h1>
              <p className="text-slate-300 text-sm leading-relaxed">
                For your security, please create a strong new password for your account before continuing.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* New Password */}
              <div className="space-y-1.5">
                <label htmlFor="new-password" className="text-sm font-medium text-slate-200">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    id="new-password"
                    type={showNew ? 'text' : 'password'}
                    value={form.newPassword}
                    onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
                    placeholder="Minimum 6 characters"
                    required
                    minLength={6}
                    className="w-full h-11 pl-10 pr-11 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                  >
                    {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <label htmlFor="confirm-password" className="text-sm font-medium text-slate-200">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    id="confirm-password"
                    type={showConfirm ? 'text' : 'password'}
                    value={form.confirmPassword}
                    onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                    placeholder="Re-enter your new password"
                    required
                    minLength={6}
                    className="w-full h-11 pl-10 pr-11 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                  >
                    {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Password match indicator */}
              {form.confirmPassword.length > 0 && (
                <p className={`text-xs font-medium flex items-center gap-1.5 ${form.newPassword === form.confirmPassword ? 'text-emerald-400' : 'text-red-400'}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${form.newPassword === form.confirmPassword ? 'bg-emerald-400' : 'bg-red-400'}`} />
                  {form.newPassword === form.confirmPassword ? 'Passwords match' : 'Passwords do not match'}
                </p>
              )}

              {/* Error */}
              {error && (
                <div className="bg-red-500/20 border border-red-500/30 rounded-lg px-4 py-3">
                  <p className="text-red-300 text-sm">{error}</p>
                </div>
              )}

              {/* Submit */}
              <button
                id="change-password-submit"
                type="submit"
                disabled={loading || !form.newPassword || !form.confirmPassword}
                className="w-full h-11 bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-semibold rounded-lg hover:from-indigo-600 hover:to-violet-700 transition-all active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
              >
                {loading && (
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                )}
                {loading ? 'Saving Password...' : 'Set New Password & Login'}
              </button>
            </form>
          </div>
        </div>
      </div>

      <footer className="relative z-10 text-center py-6 text-slate-500 text-sm">
        © 2024 empowerAiResearch. All rights reserved.
      </footer>
    </div>
  )
}
