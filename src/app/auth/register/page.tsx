'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client'

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)
    setSuccessMsg(null)

    if (!name.trim()) {
      setErrorMsg('Please enter your full name.')
      return
    }

    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.')
      return
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.')
      return
    }

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.')
      return
    }

    if (!isSupabaseConfigured()) {
      setErrorMsg(
        'Supabase credentials are not configured yet. Please check your .env file.'
      )
      return
    }

    try {
      setLoading(true)
      const supabase = createClient()

      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            name: name.trim(),
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        setErrorMsg(error.message)
        return
      }

      if (data.session) {
        // Logged in immediately (e.g. if email confirmation is disabled in Supabase)
        router.push('/dashboard')
        router.refresh()
      } else if (data.user) {
        // Email confirmation is required
        setSuccessMsg(
          'Registration successful! Please check your email inbox to confirm your account before logging in.'
        )
      }
    } catch (err: unknown) {
      setErrorMsg(
        err instanceof Error
          ? err.message
          : 'An unexpected error occurred during registration.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex-1 flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="text-center">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-600 text-white font-bold text-lg">
            +
          </div>
          <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-900">
            Create an account
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Track medicines and receive timely expiry reminders
          </p>
        </div>

        {errorMsg && (
          <div className="mt-6 rounded-lg border border-rose-200 bg-rose-50 p-3.5 text-sm text-rose-800 flex items-start gap-2">
            <span className="font-bold text-rose-600">✕</span>
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mt-6 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
            <div className="font-semibold mb-1">Check Your Email</div>
            <div>{successMsg}</div>
            <div className="mt-3">
              <Link
                href="/auth/login"
                className="font-medium text-emerald-700 underline hover:text-emerald-900"
              >
                Go to Sign in →
              </Link>
            </div>
          </div>
        )}

        {!successMsg && (
          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="name"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-600"
              >
                Full Name
              </label>
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Dr. Alex Rivera"
                className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-600"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@example.com"
                className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-600"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-600"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat password"
                className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 disabled:opacity-60 transition-colors"
              >
                {loading ? 'Creating account...' : 'Create Account'}
              </button>
            </div>
          </form>
        )}

        <p className="mt-6 text-center text-xs text-slate-500">
          Already have an account?{' '}
          <Link
            href="/auth/login"
            className="font-semibold text-emerald-600 hover:text-emerald-700"
          >
            Sign in
          </Link>
        </p>
      </div>
    </main>
  )
}
