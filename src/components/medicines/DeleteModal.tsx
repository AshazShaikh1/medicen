'use client'

import { useState } from 'react'
import type { Medicine } from '@/types/database.types'
import { deleteMedicine } from '@/lib/api/medicines'

interface DeleteModalProps {
  isOpen: boolean
  medicine: Medicine | null
  onClose: () => void
  onSuccess: () => void
}

export default function DeleteModal({
  isOpen,
  medicine,
  onClose,
  onSuccess,
}: DeleteModalProps) {
  const [deleting, setDeleting] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  if (!isOpen || !medicine) return null

  const handleDelete = async () => {
    try {
      setDeleting(true)
      setErrorMsg(null)
      const { success, error } = await deleteMedicine(medicine.id)

      if (!success && error) {
        setErrorMsg(error)
        return
      }

      onSuccess()
      onClose()
    } catch (err: unknown) {
      setErrorMsg(
        err instanceof Error
          ? err.message
          : 'An unexpected error occurred while deleting.'
      )
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-rose-100 text-rose-600 mb-4">
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
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </div>

        <h3 className="text-lg font-bold text-slate-900">
          Delete Medicine Record?
        </h3>
        <p className="mt-2 text-sm text-slate-500">
          Are you sure you want to delete{' '}
          <strong className="text-slate-800 font-semibold">
            {medicine.medicine_name}
          </strong>
          ? This action will remove this medicine and any associated reminder
          schedules permanently.
        </p>

        {errorMsg && (
          <div className="mt-3 rounded-lg border border-rose-200 bg-rose-50 p-2.5 text-xs text-rose-800">
            {errorMsg}
          </div>
        )}

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={deleting}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-rose-700 disabled:opacity-60 transition-colors"
          >
            {deleting ? 'Deleting...' : 'Delete Medicine'}
          </button>
        </div>
      </div>
    </div>
  )
}
