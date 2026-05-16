import { createClient } from "@supabase/supabase-js"
import { getAdminSupabaseConfig } from "@/lib/env"

export function createAdminSupabaseClient() {
  const config = getAdminSupabaseConfig()

  if (!config) {
    return null
  }

  return createClient(config.url, config.serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}
