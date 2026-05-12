import { supabase } from './supabase'

export async function uploadSkinImage(file, userId) {
  const fileExt = file.name.split('.').pop() || 'jpg'
  const path = `${userId}/${Date.now()}.${fileExt}`
  const { error } = await supabase.storage
    .from('skin-images')
    .upload(path, file, { upsert: false })

  if (error) {
    throw error
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from('skin-images').getPublicUrl(path)

  return { publicUrl, path }
}

export async function deleteSkinImage(path) {
  if (!path) {
    return
  }

  const { error } = await supabase.storage.from('skin-images').remove([path])

  if (error) {
    throw error
  }
}