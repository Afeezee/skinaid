import { createClient } from '@supabase/supabase-js'

const STORAGE_BUCKET = 'skin-images'

function getSupabaseAdminClient() {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error('Supabase admin service is not configured')
  }

  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

async function removeUserStorage(adminClient, userId) {
  const filePaths = []
  let offset = 0
  const limit = 100

  while (true) {
    const { data, error } = await adminClient.storage.from(STORAGE_BUCKET).list(userId, {
      limit,
      offset,
      sortBy: { column: 'name', order: 'asc' },
    })

    if (error) {
      const notFound = error.message?.toLowerCase().includes('not found')
      if (notFound) {
        break
      }

      throw error
    }

    if (!data?.length) {
      break
    }

    data.forEach((entry) => {
      if (entry.name) {
        filePaths.push(`${userId}/${entry.name}`)
      }
    })

    if (data.length < limit) {
      break
    }

    offset += data.length
  }

  if (!filePaths.length) {
    return
  }

  const { error } = await adminClient.storage.from(STORAGE_BUCKET).remove(filePaths)
  if (error) {
    throw error
  }
}

export default async function handler(req, res) {
  if (!['DELETE', 'POST'].includes(req.method)) {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const authHeader = req.headers.authorization || req.headers.Authorization
  const accessToken = authHeader?.replace(/^Bearer\s+/i, '')

  if (!accessToken) {
    return res.status(401).json({ error: 'Authorization token is required' })
  }

  try {
    const adminClient = getSupabaseAdminClient()
    const {
      data: { user },
      error: userError,
    } = await adminClient.auth.getUser(accessToken)

    if (userError || !user) {
      return res.status(401).json({ error: 'Invalid or expired session' })
    }

    const userId = user.id

    await removeUserStorage(adminClient, userId)

    const { error: checksError } = await adminClient
      .from('skin_checks')
      .delete()
      .eq('user_id', userId)

    if (checksError) {
      throw checksError
    }

    const { error: profileError } = await adminClient.from('profiles').delete().eq('id', userId)
    if (profileError) {
      throw profileError
    }

    const { error: deleteUserError } = await adminClient.auth.admin.deleteUser(userId)
    if (deleteUserError) {
      throw deleteUserError
    }

    return res.status(200).json({ success: true })
  } catch (error) {
    console.error('Delete account error:', error)
    return res.status(500).json({
      error: 'Failed to delete account',
      message: error.message,
    })
  }
}