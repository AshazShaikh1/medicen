import { createClient } from '@/lib/supabase/client'
import type { Profile } from '@/types/database.types'

export async function getCurrentUserProfile(): Promise<Profile | null> {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (error) {
    console.error('Error fetching user profile:', error.message)
    // Fallback profile object if trigger hasn't fired yet
    return {
      id: user.id,
      name: user.user_metadata?.name || null,
      email: user.email || null,
      created_at: user.created_at,
    }
  }

  return data
}
