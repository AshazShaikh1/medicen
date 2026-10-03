'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/components/auth/AuthProvider'

export default function Navbar() {
  const pathname = usePathname()
  const { user, loading, signOut } = useAuth()

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/medicines', label: 'Medicines' },
    { href: '/reminders', label: 'Reminders' },
    { href: '/guide', label: 'Guide' },
  ]

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/'
    return pathname.startsWith(path)
  }

  // Get user display identifier (name from metadata or fallback to email)
  const displayName =
    user?.user_metadata?.name || user?.email?.split('@')[0] || 'User'

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Logo and Brand */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-sm transition-transform group-hover:scale-105">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <path d="M12 6v12m-6-6h12" />
              </svg>
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-900">
              Medicen<span className="text-emerald-600">.</span>
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Action Links / User State */}
        <div className="flex items-center gap-3">
          {loading ? (
            <div className="h-8 w-20 animate-pulse rounded-lg bg-slate-100" />
          ) : user ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-xs font-semibold text-slate-800">
                  {displayName}
                </span>
                <span className="text-[11px] text-slate-400 truncate max-w-[140px]">
                  {user.email}
                </span>
              </div>
              <button
                onClick={() => signOut()}
                className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50 transition-colors"
              >
                Sign out
              </button>
            </div>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="rounded-lg px-3.5 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors"
              >
                Sign in
              </Link>
              <Link
                href="/auth/register"
                className="rounded-lg bg-emerald-600 px-3.5 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 transition-colors"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
