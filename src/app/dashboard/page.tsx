'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import type { Medicine } from '@/types/database.types'
import { fetchMedicines } from '@/lib/api/medicines'
import { calculateExpiryStatus } from '@/lib/utils/expiry'
import StatusBadge from '@/components/ui/StatusBadge'
import MedicineModal from '@/components/medicines/MedicineModal'

export default function DashboardPage() {
  const [medicines, setMedicines] = useState<Medicine[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const reloadData = useCallback(async () => {
    setLoading(true)
    const { data, error } = await fetchMedicines()
    if (error) {
      setErrorMsg(error)
    } else {
      setMedicines(data || [])
      setErrorMsg(null)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    let ignore = false
    async function loadInitial() {
      const { data, error } = await fetchMedicines()
      if (!ignore) {
        if (error) {
          setErrorMsg(error)
        } else {
          setMedicines(data || [])
        }
        setLoading(false)
      }
    }
    loadInitial()
    return () => {
      ignore = true
    }
  }, [])

  // Compute metrics
  const total = medicines.length
  let activeCount = 0
  let expiringSoonCount = 0
  let expiredCount = 0

  const attentionList: { medicine: Medicine; daysRemaining: number; label: string }[] = []

  medicines.forEach((med) => {
    const { status, daysRemaining, label } = calculateExpiryStatus(med.expiry_date)
    if (status === 'active') activeCount++
    if (status === 'expiring_soon') {
      expiringSoonCount++
      attentionList.push({ medicine: med, daysRemaining, label })
    }
    if (status === 'expired') {
      expiredCount++
      attentionList.push({ medicine: med, daysRemaining, label })
    }
  })

  // Sort attention items: expired first, then closest to expiry
  attentionList.sort((a, b) => a.daysRemaining - b.daysRemaining)

  return (
    <main className="flex-1 bg-slate-50 py-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 border-b border-slate-200">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Dashboard
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Overview of your medicine inventory and expiry status.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsModalOpen(true)}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 transition-colors"
            >
              + Add Medicine
            </button>
            <Link
              href="/medicines"
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 transition-colors"
            >
              View Inventory
            </Link>
          </div>
        </div>

        {errorMsg && (
          <div className="mt-6 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800 flex items-center justify-between">
            <span>{errorMsg}</span>
            <button
              onClick={reloadData}
              className="font-medium underline hover:text-rose-900 ml-4"
            >
              Retry
            </button>
          </div>
        )}

        {/* Metrics Grid */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Total Stock
              </span>
              <span className="h-2 w-2 rounded-full bg-slate-400"></span>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-slate-900">
                {loading ? '...' : total}
              </span>
              <span className="text-xs text-slate-400">medicines</span>
            </div>
            <p className="mt-2 text-xs text-slate-400">Across all categories</p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
                Active
              </span>
              <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-emerald-600">
                {loading ? '...' : activeCount}
              </span>
              <span className="text-xs text-slate-400">safe to use</span>
            </div>
            <p className="mt-2 text-xs text-slate-400">&gt; 30 days remaining</p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-600">
                Expiring Soon
              </span>
              <span className="h-2 w-2 rounded-full bg-amber-500"></span>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-amber-600">
                {loading ? '...' : expiringSoonCount}
              </span>
              <span className="text-xs text-slate-400">attention needed</span>
            </div>
            <p className="mt-2 text-xs text-slate-400">Within 30 days</p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-rose-600">
                Expired
              </span>
              <span className="h-2 w-2 rounded-full bg-rose-500"></span>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-rose-600">
                {loading ? '...' : expiredCount}
              </span>
              <span className="text-xs text-slate-400">do not consume</span>
            </div>
            <p className="mt-2 text-xs text-slate-400">Past expiry date</p>
          </div>
        </div>

        {/* Action / Attention Section */}
        <div className="mt-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900">
              Action Required & Upcoming Expiries
            </h2>
            <Link
              href="/medicines"
              className="text-xs font-medium text-emerald-600 hover:text-emerald-700"
            >
              View all medicines →
            </Link>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            {loading ? (
              <div className="p-8 text-center text-slate-400">
                <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent mb-2" />
                <p className="text-sm">Calculating expiry status...</p>
              </div>
            ) : attentionList.length === 0 ? (
              <div className="p-10 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h3 className="mt-3 text-base font-semibold text-slate-900">
                  {total === 0 ? 'No medicines added yet' : 'All Clear!'}
                </h3>
                <p className="mt-1 text-sm text-slate-500 max-w-sm mx-auto">
                  {total === 0
                    ? 'Start tracking your medicines by clicking Add Medicine above.'
                    : 'None of your medicines are expired or expiring within the next 30 days.'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600">
                  <thead className="border-b border-slate-100 bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    <tr>
                      <th scope="col" className="px-6 py-3.5">
                        Medicine
                      </th>
                      <th scope="col" className="px-6 py-3.5">
                        Batch
                      </th>
                      <th scope="col" className="px-6 py-3.5">
                        Qty
                      </th>
                      <th scope="col" className="px-6 py-3.5">
                        Expiry Date
                      </th>
                      <th scope="col" className="px-6 py-3.5">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {attentionList.map(({ medicine, label }) => (
                      <tr
                        key={medicine.id}
                        className="hover:bg-slate-50/80 transition-colors"
                      >
                        <td className="px-6 py-4 font-semibold text-slate-900">
                          {medicine.medicine_name}
                          <span className="block text-xs font-normal text-slate-400">
                            {medicine.category || 'General'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-xs font-mono text-slate-500">
                          {medicine.batch_number || '—'}
                        </td>
                        <td className="px-6 py-4 font-medium text-slate-800">
                          {medicine.quantity}
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-medium text-slate-900">
                            {medicine.expiry_date}
                          </div>
                          <div className="text-xs text-slate-400">{label}</div>
                        </td>
                        <td className="px-6 py-4">
                          <StatusBadge expiryDate={medicine.expiry_date} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Modal */}
      <MedicineModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={reloadData}
      />
    </main>
  )
}
