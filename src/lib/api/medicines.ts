import { createClient } from '@/lib/supabase/client'
import type { Medicine } from '@/types/database.types'

export interface CreateMedicineInput {
  medicine_name: string
  batch_number?: string | null
  expiry_date: string
  quantity: number
  category?: string | null
}

export interface UpdateMedicineInput {
  medicine_name?: string
  batch_number?: string | null
  expiry_date?: string
  quantity?: number
  category?: string | null
}

export async function fetchMedicines(): Promise<{
  data: Medicine[] | null
  error: string | null
}> {
  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('medicines')
      .select('*')
      .order('expiry_date', { ascending: true })

    if (error) {
      return { data: null, error: error.message }
    }

    return { data: (data as unknown) as Medicine[], error: null }
  } catch (err: unknown) {
    return {
      data: null,
      error: err instanceof Error ? err.message : 'Failed to fetch medicines',
    }
  }
}

export async function addMedicine(
  input: CreateMedicineInput
): Promise<{ data: Medicine | null; error: string | null }> {
  try {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { data: null, error: 'User is not authenticated' }
    }

    const { data, error } = await supabase
      .from('medicines')
      .insert({
        user_id: user.id,
        medicine_name: input.medicine_name.trim(),
        batch_number: input.batch_number?.trim() || null,
        expiry_date: input.expiry_date,
        quantity: Math.max(1, input.quantity),
        category: input.category?.trim() || null,
      })
      .select()
      .single()

    if (error) {
      return { data: null, error: error.message }
    }

    return { data: (data as unknown) as Medicine, error: null }
  } catch (err: unknown) {
    return {
      data: null,
      error: err instanceof Error ? err.message : 'Failed to add medicine',
    }
  }
}

export async function updateMedicine(
  id: string,
  input: UpdateMedicineInput
): Promise<{ data: Medicine | null; error: string | null }> {
  try {
    const supabase = createClient()
    const updatePayload: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    }

    if (input.medicine_name !== undefined) {
      updatePayload.medicine_name = input.medicine_name.trim()
    }
    if (input.batch_number !== undefined) {
      updatePayload.batch_number = input.batch_number?.trim() || null
    }
    if (input.expiry_date !== undefined) {
      updatePayload.expiry_date = input.expiry_date
    }
    if (input.quantity !== undefined) {
      updatePayload.quantity = Math.max(0, input.quantity)
    }
    if (input.category !== undefined) {
      updatePayload.category = input.category?.trim() || null
    }

    const { data, error } = await supabase
      .from('medicines')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return { data: null, error: error.message }
    }

    return { data: (data as unknown) as Medicine, error: null }
  } catch (err: unknown) {
    return {
      data: null,
      error: err instanceof Error ? err.message : 'Failed to update medicine',
    }
  }
}

export async function deleteMedicine(
  id: string
): Promise<{ success: boolean; error: string | null }> {
  try {
    const supabase = createClient()
    const { error } = await supabase.from('medicines').delete().eq('id', id)

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, error: null }
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to delete medicine',
    }
  }
}
