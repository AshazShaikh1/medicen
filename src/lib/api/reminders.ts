import { createClient } from '@/lib/supabase/client'
import type { Reminder, Notification, Medicine } from '@/types/database.types'
import { calculateExpiryStatus } from '@/lib/utils/expiry'

export interface ReminderWithMedicine extends Reminder {
  medicine?: Medicine
}

export async function fetchReminders(): Promise<{
  data: ReminderWithMedicine[] | null
  error: string | null
}> {
  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('reminders')
      .select('*, medicine:medicines(*)')
      .order('reminder_date', { ascending: true })

    if (error) {
      return { data: null, error: error.message }
    }

    return { data: (data as unknown) as ReminderWithMedicine[], error: null }
  } catch (err: unknown) {
    return {
      data: null,
      error: err instanceof Error ? err.message : 'Failed to fetch reminders',
    }
  }
}

export async function fetchNotifications(): Promise<{
  data: Notification[] | null
  error: string | null
}> {
  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .order('sent_at', { ascending: false })

    if (error) {
      return { data: null, error: error.message }
    }

    return { data: data as Notification[], error: null }
  } catch (err: unknown) {
    return {
      data: null,
      error: err instanceof Error ? err.message : 'Failed to fetch notifications',
    }
  }
}

export async function markNotificationAsRead(
  notificationId: string
): Promise<{ success: boolean; error: string | null }> {
  try {
    const supabase = createClient()
    const { error } = await supabase
      .from('notifications')
      .update({ status: 'read' })
      .eq('id', notificationId)

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, error: null }
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to update notification',
    }
  }
}

export async function dismissReminder(
  reminderId: string
): Promise<{ success: boolean; error: string | null }> {
  try {
    const supabase = createClient()
    const { error } = await supabase
      .from('reminders')
      .update({ status: 'dismissed' })
      .eq('id', reminderId)

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, error: null }
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to dismiss reminder',
    }
  }
}

/**
 * Automatically syncs medicine records to create reminders and in-app notifications
 * for medicines expiring within 30 days or already expired.
 */
export async function syncExpiryRemindersAndNotifications(): Promise<{
  newReminders: number
  newNotifications: number
}> {
  try {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return { newReminders: 0, newNotifications: 0 }

    // Fetch user's medicines
    const { data: medicines } = await supabase
      .from('medicines')
      .select('*')

    if (!medicines || medicines.length === 0) {
      return { newReminders: 0, newNotifications: 0 }
    }

    // Fetch existing reminders
    const { data: existingReminders } = await supabase
      .from('reminders')
      .select('id, medicine_id')
      .eq('user_id', user.id)

    const existingMedicineIds = new Set(
      (existingReminders || []).map((r) => r.medicine_id)
    )

    let createdRemindersCount = 0
    let createdNotificationsCount = 0

    for (const med of medicines as Medicine[]) {
      const { status, daysRemaining } = calculateExpiryStatus(med.expiry_date)

      // If expiring soon (<= 30 days) or expired, ensure a reminder and notification exist
      if ((status === 'expiring_soon' || status === 'expired') && !existingMedicineIds.has(med.id)) {
        // Create reminder
        const { data: newReminder, error: remError } = await supabase
          .from('reminders')
          .insert({
            user_id: user.id,
            medicine_id: med.id,
            reminder_date: med.expiry_date,
            status: 'sent',
            channel: 'in_app',
          })
          .select()
          .single()

        if (!remError && newReminder) {
          createdRemindersCount++

          const message =
            daysRemaining < 0
              ? `Warning: ${med.medicine_name} expired on ${med.expiry_date}. Please dispose of safely.`
              : daysRemaining === 0
              ? `Alert: ${med.medicine_name} expires today!`
              : `Reminder: ${med.medicine_name} will expire in ${daysRemaining} days (on ${med.expiry_date}).`

          // Create in-app notification
          const { error: notifError } = await supabase
            .from('notifications')
            .insert({
              user_id: user.id,
              reminder_id: newReminder.id,
              message,
              status: 'unread',
            })

          if (!notifError) {
            createdNotificationsCount++
          }
        }
      }
    }

    return {
      newReminders: createdRemindersCount,
      newNotifications: createdNotificationsCount,
    }
  } catch (err) {
    console.error('Error syncing reminders:', err)
    return { newReminders: 0, newNotifications: 0 }
  }
}
