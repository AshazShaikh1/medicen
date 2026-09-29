'use client'

import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectPath = searchParams.get('redirect') ?? '/dashboard'
  const errorParam = searchParams.get('error')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMsg, setErrorMsg] = useState<string | null>(
    errorParam ? 'Authentication error. Please try logging in again.' : null
  )
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)

    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.')
      return
    }

    if (!password) {
      setErrorMsg('Please enter your password.')
      return
    }

    if (!isSupabaseConfigured()) {
      setErrorMsg(
        'Supabase credentials are not configured. Please check your .env file.'
      )
      return
    }

    try {
      setLoading(true)
      const supabase = createClient()

      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })

      if (error) {
        setErrorMsg(error.message)
        return
      }

      router.push(redirectPath)
      router.refresh()
    } catch (err: unknown) {
      setErrorMsg(
        err instanceof Error
          ? err.message
          : 'An unexpected error occurred during login.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="text-center">
        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-600 text-white font-bold text-lg">
          +
        </div>
        <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-900">
          Sign in to your account
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Access your medicine stock and reminder schedule
        </p>
      </div>

      {errorMsg && (
        <div className="mt-6 rounded-lg border border-rose-200 bg-rose-50 p-3.5 text-sm text-rose-800 flex items-start gap-2">
          <span className="font-bold text-rose-600">✕</span>
          <span>{errorMsg}</span>
        </div>
      )}

      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 disabled:opacity-60 transition-colors"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </div>
      </form>

      <p className="mt-6 text-center text-xs text-slate-500">
        Don&apos;t have an account?{' '}
        <Link
          href="/auth/register"
          className="font-semibold text-emerald-600 hover:text-emerald-700"
        >
          Register here
        </Link>
      </p>
    </div>
  )
}

export default function LoginPage() {
  return (
    <main className="flex-1 flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6">
      <Suspense
        fallback={
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-400">
            Loading...
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </main>
  )
}
