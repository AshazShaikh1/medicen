import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="w-full border-t border-slate-200 bg-slate-50 py-8 text-slate-500">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800">Medicine Expiry Reminder System</span>
            <span className="text-xs bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full font-medium">
              Mini Project
            </span>
          </div>

          <p className="text-xs text-center md:text-right max-w-md text-slate-500">
            <strong>Disclaimer:</strong> This application is an inventory & expiry tracking tool. It does not provide medical advice, diagnosis, or treatment recommendations.
          </p>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-200/60 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
          <span>Built with Next.js, TypeScript, Tailwind CSS & Supabase.</span>
          <div className="flex gap-4">
            <Link href="/dashboard" className="hover:text-slate-600 transition-colors">
              Dashboard
            </Link>
            <Link href="/medicines" className="hover:text-slate-600 transition-colors">
              Medicines
            </Link>
            <Link href="/reminders" className="hover:text-slate-600 transition-colors">
              Reminders
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
