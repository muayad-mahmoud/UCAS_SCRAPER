import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { createClient as createHeyClient} from '@hey-api/client-fetch'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

export const supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey)

export const apiClient = createHeyClient({
  baseUrl: import.meta.env.VITE_BACKEND_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use(async (request) => {
  const { data, error } = await supabase.auth.getSession()
  if (error) {
    throw error
  }
  if (!data?.session) {
    throw new Error('Session not found')
  }
  request.headers.set('Authorization', `Bearer ${data?.session?.access_token}`)
  return request
})
