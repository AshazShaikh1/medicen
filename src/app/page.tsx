import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="flex-1">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-slate-200 bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-1 text-xs font-semibold text-emerald-800">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Medicine Expiry Management
          </div>

          <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
            Never let essential medicines expire unnoticed.
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base text-slate-600 sm:text-lg">
            A clean, reliable system to track medicine inventories,
            automatically compute expiry windows, and alert you before medicines expire.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="rounded-lg bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 transition-colors"
            >
              Open Dashboard
            </Link>
            <Link
              href="/medicines"
              className="rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              View Medicine Inventory
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="h-10 w-10 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold mb-4">
              01
            </div>
            <h3 className="text-base font-semibold text-slate-900">Medicine Tracking</h3>
            <p className="mt-2 text-sm text-slate-500 leading-relaxed">
              Store name, batch number, category, quantity, and precise expiry date. Eliminate messy handwritten notes.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center text-amber-700 font-bold mb-4">
              02
            </div>
            <h3 className="text-base font-semibold text-slate-900">Expiry Calculation</h3>
            <p className="mt-2 text-sm text-slate-500 leading-relaxed">
              Automated categorization into Active, Expiring-Soon, and Expired states with remaining day counts.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700 font-bold mb-4">
              03
            </div>
            <h3 className="text-base font-semibold text-slate-900">Timely Reminders</h3>
            <p className="mt-2 text-sm text-slate-500 leading-relaxed">
              In-app alerts and notifications scheduled before expiry occurs, preventing wastage and ensuring safety.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
