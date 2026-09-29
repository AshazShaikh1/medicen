'use client'

import { useState, useEffect, useCallback } from 'react'
import type { Medicine } from '@/types/database.types'
import { fetchMedicines } from '@/lib/api/medicines'
import StatusBadge from '@/components/ui/StatusBadge'
import MedicineModal from '@/components/medicines/MedicineModal'
import DeleteModal from '@/components/medicines/DeleteModal'
import { calculateExpiryStatus } from '@/lib/utils/expiry'

export default function MedicinesPage() {
  const [medicines, setMedicines] = useState<Medicine[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  // Filter / Search state
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [medicineToEdit, setMedicineToEdit] = useState<Medicine | null>(null)
  const [medicineToDelete, setMedicineToDelete] = useState<Medicine | null>(null)

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

  const handleOpenAdd = () => {
    setMedicineToEdit(null)
    setIsModalOpen(true)
  }

  const handleOpenEdit = (med: Medicine) => {
    setMedicineToEdit(med)
    setIsModalOpen(true)
  }

  const handleOpenDelete = (med: Medicine) => {
    setMedicineToDelete(med)
  }

  // Filter logic
  const filteredMedicines = medicines.filter((m) => {
    const matchesSearch =
      m.medicine_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.batch_number &&
        m.batch_number.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesCategory =
      categoryFilter === 'All' || m.category === categoryFilter

    const { status } = calculateExpiryStatus(m.expiry_date)
    const matchesStatus =
      statusFilter === 'All' || status === statusFilter

    return matchesSearch && matchesCategory && matchesStatus
  })

  // Extract unique categories for filter dropdown
  const uniqueCategories = Array.from(
    new Set(medicines.map((m) => m.category).filter(Boolean))
  ) as string[]

  return (
    <main className="flex-1 bg-slate-50 py-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 border-b border-slate-200">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Medicines Inventory
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Track batch numbers, quantity, and monitor real-time expiry status.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleOpenAdd}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 transition-colors"
            >
              + Add Medicine
            </button>
          </div>
        </div>

        {errorMsg && (
          <div className="mt-6 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800 flex items-center justify-between">
            <span>{errorMsg}</span>
            <button
              onClick={reloadData}
              className="font-medium underline hover:text-rose-900 ml-4"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Filter Bar */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input
            type="text"
            placeholder="Search medicine name or batch..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-700 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value="All">All Categories</option>
            {uniqueCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-700 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value="All">All Expiry Statuses</option>
            <option value="active">Active (Safe)</option>
            <option value="expiring_soon">Expiring Soon (≤30d)</option>
            <option value="expired">Expired</option>
          </select>
        </div>

        {/* Inventory Table Container */}
        <div className="mt-6 rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-slate-400">
              <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent mb-3" />
              <p className="text-sm">Loading medicine records from Supabase...</p>
            </div>
          ) : filteredMedicines.length === 0 ? (
            <div className="p-12 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
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
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
              <h2 className="mt-4 text-base font-semibold text-slate-900">
                {medicines.length === 0
                  ? 'No medicines registered yet'
                  : 'No medicines match your filter'}
              </h2>
              <p className="mt-1 text-sm text-slate-500 max-w-sm mx-auto">
                {medicines.length === 0
                  ? 'Get started by adding your first medicine record with its batch number and expiry date.'
                  : 'Try clearing your search query or changing category and status filters.'}
              </p>
              {medicines.length === 0 && (
                <div className="mt-6">
                  <button
                    onClick={handleOpenAdd}
                    className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 transition-colors"
                  >
                    + Add First Medicine
                  </button>
                </div>
              )}
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
                      Category
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
                    <th scope="col" className="px-6 py-3.5 text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredMedicines.map((med) => {
                    const { label } = calculateExpiryStatus(med.expiry_date)
                    return (
                      <tr
                        key={med.id}
                        className="hover:bg-slate-50/80 transition-colors"
                      >
                        <td className="px-6 py-4 font-semibold text-slate-900">
                          {med.medicine_name}
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-700">
                            {med.category || 'General'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-xs font-mono text-slate-500">
                          {med.batch_number || '—'}
                        </td>
                        <td className="px-6 py-4 font-medium text-slate-800">
                          {med.quantity}
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-medium text-slate-900">
                            {med.expiry_date}
                          </div>
                          <div className="text-xs text-slate-400">{label}</div>
                        </td>
                        <td className="px-6 py-4">
                          <StatusBadge expiryDate={med.expiry_date} />
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="inline-flex items-center gap-2">
                            <button
                              onClick={() => handleOpenEdit(med)}
                              className="rounded px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleOpenDelete(med)}
                              className="rounded px-2 py-1 text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add / Edit Modal */}
      <MedicineModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={reloadData}
        medicineToEdit={medicineToEdit}
      />

      {/* Delete Modal */}
      <DeleteModal
        isOpen={Boolean(medicineToDelete)}
        medicine={medicineToDelete}
        onClose={() => setMedicineToDelete(null)}
        onSuccess={reloadData}
      />
    </main>
  )
}
