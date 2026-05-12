import { supabase } from './supabase'

export async function createSkinCheck({ userId, imageUrl, result }) {
  try {
    const { data, error } = await supabase
      .from('skin_checks')
      .insert({
        user_id: userId,
        image_url: imageUrl,
        result,
      })
      .select()
      .single()

    if (error) {
      throw error
    }

    return { data, error: null }
  } catch (error) {
    return { data: null, error }
  }
}

export async function getUserSkinChecks(userId) {
  try {
    const { data, error } = await supabase
      .from('skin_checks')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      throw error
    }

    return { data, error: null }
  } catch (error) {
    return { data: null, error }
  }
}

export async function deleteSkinCheck(id) {
  try {
    const { data, error } = await supabase
      .from('skin_checks')
      .delete()
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw error
    }

    return { data, error: null }
  } catch (error) {
    return { data: null, error }
  }
}

export async function getProfile(userId) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle()

    if (error) {
      throw error
    }

    return { data, error: null }
  } catch (error) {
    return { data: null, error }
  }
}

export async function upsertProfile({ userId, fullName, email }) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .upsert(
        {
          id: userId,
          full_name: fullName,
          email,
        },
        { onConflict: 'id' },
      )
      .select()
      .single()

    if (error) {
      throw error
    }

    return { data, error: null }
  } catch (error) {
    return { data: null, error }
  }
}