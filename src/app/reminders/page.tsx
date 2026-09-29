'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import type { Notification } from '@/types/database.types'
import {
  fetchReminders,
  fetchNotifications,
  markNotificationAsRead,
  dismissReminder,
  syncExpiryRemindersAndNotifications,
  type ReminderWithMedicine,
} from '@/lib/api/reminders'

export default function RemindersPage() {
  const [activeTab, setActiveTab] = useState<'notifications' | 'reminders'>('notifications')
  const [reminders, setReminders] = useState<ReminderWithMedicine[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const loadData = useCallback(async () => {
    setLoading(true)
    setErrorMsg(null)
    const [remRes, notifRes] = await Promise.all([
      fetchReminders(),
      fetchNotifications(),
    ])

    if (remRes.error || notifRes.error) {
      setErrorMsg(remRes.error || notifRes.error)
    } else {
      setReminders(remRes.data || [])
      setNotifications(notifRes.data || [])
    }
    setLoading(false)
  }, [])

  const handleSync = async () => {
    setSyncing(true)
    await syncExpiryRemindersAndNotifications()
    await loadData()
    setSyncing(false)
  }

  useEffect(() => {
    // Initial sync and load
    syncExpiryRemindersAndNotifications().finally(() => {
      loadData()
    })
  }, [loadData])

  const handleMarkAsRead = async (id: string) => {
    const { success } = await markNotificationAsRead(id)
    if (success) {
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, status: 'read' } : n))
      )
    }
  }

  const handleDismissReminder = async (id: string) => {
    const { success } = await dismissReminder(id)
    if (success) {
      setReminders((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: 'dismissed' } : r))
      )
    }
  }

  const unreadCount = notifications.filter((n) => n.status === 'unread').length

  return (
    <main className="flex-1 bg-slate-50 py-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 border-b border-slate-200">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Reminders & Notifications
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Stay ahead of medicine expiration dates with timely in-app reminders.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleSync}
              disabled={syncing}
              className="rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-60 transition-colors"
            >
              {syncing ? 'Checking expiry dates...' : '↻ Check Expiry Now'}
            </button>
          </div>
        </div>

        {errorMsg && (
          <div className="mt-6 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
            {errorMsg}
          </div>
        )}

        {/* Tab Navigation */}
        <div className="mt-6 flex border-b border-slate-200">
          <button
            onClick={() => setActiveTab('notifications')}
            className={`pb-3 px-4 text-sm font-medium border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'notifications'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <span>Notification Inbox</span>
            {unreadCount > 0 && (
              <span className="rounded-full bg-emerald-600 text-white text-xs px-2 py-0.5 font-bold">
                {unreadCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('reminders')}
            className={`pb-3 px-4 text-sm font-medium border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'reminders'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <span>Scheduled Reminders</span>
            <span className="rounded-full bg-slate-200 text-slate-700 text-xs px-2 py-0.5">
              {reminders.length}
            </span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {loading ? (
            <div className="rounded-xl border border-slate-200 bg-white p-12 text-center text-slate-400 shadow-sm">
              <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent mb-3" />
              <p className="text-sm">Loading reminders and alerts...</p>
            </div>
          ) : activeTab === 'notifications' ? (
            /* Notifications List */
            <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              {notifications.length === 0 ? (
                <div className="p-12 text-center">
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
                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                      />
                    </svg>
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-slate-900">
                    No Notifications
                  </h3>
                  <p className="mt-1 text-sm text-slate-500 max-w-sm mx-auto">
                    When your medicines approach their expiry date, automatic in-app alerts will be displayed here.
                  </p>
                </div>
              ) : (
                <ul className="divide-y divide-slate-100">
                  {notifications.map((notif) => {
                    const isUnread = notif.status === 'unread'
                    return (
                      <li
                        key={notif.id}
                        className={`p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
                          isUnread ? 'bg-emerald-50/40' : 'bg-white'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <span
                            className={`mt-1 h-2 w-2 rounded-full shrink-0 ${
                              isUnread ? 'bg-emerald-600' : 'bg-slate-300'
                            }`}
                          />
                          <div>
                            <p
                              className={`text-sm ${
                                isUnread
                                  ? 'font-semibold text-slate-900'
                                  : 'text-slate-600'
                              }`}
                            >
                              {notif.message}
                            </p>
                            <span className="text-xs text-slate-400 mt-1 block">
                              {new Date(notif.sent_at).toLocaleString()}
                            </span>
                          </div>
                        </div>

                        {isUnread && (
                          <button
                            onClick={() => handleMarkAsRead(notif.id)}
                            className="shrink-0 text-xs font-medium text-emerald-700 hover:text-emerald-900 hover:underline"
                          >
                            Mark as read
                          </button>
                        )}
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>
          ) : (
            /* Reminders List */
            <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              {reminders.length === 0 ? (
                <div className="p-12 text-center">
                  <h3 className="text-base font-semibold text-slate-900">
                    No Reminders Scheduled
                  </h3>
                  <p className="mt-1 text-sm text-slate-500 max-w-sm mx-auto">
                    Reminders are automatically scheduled when medicines are registered with upcoming expiry dates.
                  </p>
                  <div className="mt-6">
                    <Link
                      href="/medicines"
                      className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-700"
                    >
                      View Medicine Inventory
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-slate-600">
                    <thead className="border-b border-slate-100 bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      <tr>
                        <th className="px-6 py-3.5">Medicine</th>
                        <th className="px-6 py-3.5">Reminder Target Date</th>
                        <th className="px-6 py-3.5">Channel</th>
                        <th className="px-6 py-3.5">Status</th>
                        <th className="px-6 py-3.5 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {reminders.map((rem) => (
                        <tr
                          key={rem.id}
                          className="hover:bg-slate-50/80 transition-colors"
                        >
                          <td className="px-6 py-4 font-semibold text-slate-900">
                            {rem.medicine?.medicine_name || 'Medicine'}
                          </td>
                          <td className="px-6 py-4">{rem.reminder_date}</td>
                          <td className="px-6 py-4 capitalize text-slate-500">
                            {rem.channel.replace('_', ' ')}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                                rem.status === 'dismissed'
                                  ? 'bg-slate-100 text-slate-600'
                                  : rem.status === 'sent'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {rem.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            {rem.status !== 'dismissed' && (
                              <button
                                onClick={() => handleDismissReminder(rem.id)}
                                className="text-xs font-medium text-slate-600 hover:text-slate-900"
                              >
                                Dismiss
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
