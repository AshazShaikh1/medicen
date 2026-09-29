'use client'

import { useState } from 'react'
import type { Medicine } from '@/types/database.types'
import {
  addMedicine,
  updateMedicine,
  type CreateMedicineInput,
} from '@/lib/api/medicines'

const CATEGORIES = [
  'Tablets',
  'Capsules',
  'Syrup / Liquid',
  'Injections',
  'Ointment / Cream',
  'Eye / Ear Drops',
  'Inhaler',
  'Supplements',
  'Other',
]

interface MedicineModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  medicineToEdit?: Medicine | null
}

function MedicineForm({
  onClose,
  onSuccess,
  medicineToEdit,
}: {
  onClose: () => void
  onSuccess: () => void
  medicineToEdit?: Medicine | null
}) {
  const isEditing = Boolean(medicineToEdit)

  const [medicineName, setMedicineName] = useState(
    medicineToEdit?.medicine_name || ''
  )
  const [category, setCategory] = useState(
    medicineToEdit?.category || CATEGORIES[0]
  )
  const [expiryDate, setExpiryDate] = useState(
    medicineToEdit?.expiry_date || ''
  )
  const [quantity, setQuantity] = useState(medicineToEdit?.quantity || 1)
  const [batchNumber, setBatchNumber] = useState(
    medicineToEdit?.batch_number || ''
  )
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)

    if (!medicineName.trim()) {
      setErrorMsg('Medicine name is required.')
      return
    }

    if (!expiryDate) {
      setErrorMsg('Expiry date is required.')
      return
    }

    if (quantity < 1) {
      setErrorMsg('Quantity must be at least 1.')
      return
    }

    try {
      setSubmitting(true)
      const payload: CreateMedicineInput = {
        medicine_name: medicineName.trim(),
        category,
        expiry_date: expiryDate,
        quantity,
        batch_number: batchNumber.trim() || null,
      }

      if (isEditing && medicineToEdit) {
        const { error } = await updateMedicine(medicineToEdit.id, payload)
        if (error) {
          setErrorMsg(error)
          return
        }
      } else {
        const { error } = await addMedicine(payload)
        if (error) {
          setErrorMsg(error)
          return
        }
      }

      onSuccess()
      onClose()
    } catch (err: unknown) {
      setErrorMsg(
        err instanceof Error
          ? err.message
          : 'An unexpected error occurred while saving.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl sm:p-8">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            {isEditing ? 'Edit Medicine' : 'Add New Medicine'}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {isEditing
              ? 'Update inventory details and expiry schedule'
              : 'Enter medicine details to start tracking its expiry'}
          </p>
        </div>
        <button
          onClick={onClose}
          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
        >
          ✕
        </button>
      </div>

      {errorMsg && (
        <div className="mt-4 rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-5 space-y-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
            Medicine Name <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            value={medicineName}
            onChange={(e) => setMedicineName(e.target.value)}
            placeholder="e.g. Paracetamol 500mg"
            className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
              Quantity <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              min={1}
              required
              value={quantity}
              onChange={(e) =>
                setQuantity(Math.max(1, parseInt(e.target.value) || 1))
              }
              className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
              Expiry Date <span className="text-rose-500">*</span>
            </label>
            <input
              type="date"
              required
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
              Batch Number (Optional)
            </label>
            <input
              type="text"
              value={batchNumber}
              onChange={(e) => setBatchNumber(e.target.value)}
              placeholder="e.g. B-94821"
              className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="rounded-lg bg-emerald-600 px-5 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 disabled:opacity-60 transition-colors"
          >
            {submitting
              ? 'Saving...'
              : isEditing
              ? 'Update Medicine'
              : 'Save Medicine'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default function MedicineModal({
  isOpen,
  onClose,
  onSuccess,
  medicineToEdit,
}: MedicineModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 overflow-y-auto">
      <MedicineForm
        key={medicineToEdit?.id ?? 'new-medicine'}
        onClose={onClose}
        onSuccess={onSuccess}
        medicineToEdit={medicineToEdit}
      />
    </div>
  )
}
