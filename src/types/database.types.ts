export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Profile {
  id: string
  name: string | null
  email: string | null
  created_at: string
}

export interface Medicine {
  id: string
  user_id: string
  medicine_name: string
  batch_number: string | null
  expiry_date: string // ISO date string (YYYY-MM-DD)
  quantity: number
  category: string | null
  created_at: string
  updated_at: string
}

export type ReminderStatus = 'pending' | 'sent' | 'dismissed'
export type ReminderChannel = 'in_app' | 'email'

export interface Reminder {
  id: string
  medicine_id: string
  user_id: string
  reminder_date: string // ISO date string (YYYY-MM-DD)
  status: ReminderStatus
  channel: ReminderChannel
  created_at: string
}

export type NotificationStatus = 'unread' | 'read'

export interface Notification {
  id: string
  reminder_id: string
  user_id: string
  message: string
  sent_at: string
  status: NotificationStatus
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile
        Insert: {
          id: string
          name?: string | null
          email?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string | null
          email?: string | null
          created_at?: string
        }
        Relationships: []
      }
      medicines: {
        Row: Medicine
        Insert: {
          id?: string
          user_id: string
          medicine_name: string
          batch_number?: string | null
          expiry_date: string
          quantity?: number
          category?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          medicine_name?: string
          batch_number?: string | null
          expiry_date?: string
          quantity?: number
          category?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "medicines_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      reminders: {
        Row: Reminder
        Insert: {
          id?: string
          medicine_id: string
          user_id: string
          reminder_date: string
          status?: ReminderStatus
          channel?: ReminderChannel
          created_at?: string
        }
        Update: {
          id?: string
          medicine_id?: string
          user_id?: string
          reminder_date?: string
          status?: ReminderStatus
          channel?: ReminderChannel
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reminders_medicine_id_fkey"
            columns: ["medicine_id"]
            referencedRelation: "medicines"
            referencedColumns: ["id"]
          }
        ]
      }
      notifications: {
        Row: Notification
        Insert: {
          id?: string
          reminder_id: string
          user_id: string
          message: string
          sent_at?: string
          status?: NotificationStatus
        }
        Update: {
          id?: string
          reminder_id?: string
          user_id?: string
          message?: string
          sent_at?: string
          status?: NotificationStatus
        }
        Relationships: [
          {
            foreignKeyName: "notifications_reminder_id_fkey"
            columns: ["reminder_id"]
            referencedRelation: "reminders"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
