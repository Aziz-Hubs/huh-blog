import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { getPublicSupabaseConfig } from "@/lib/env"

export async function createServerSupabaseClient() {
  const config = getPublicSupabaseConfig()

  if (!config) {
    return null
  }

  const cookieStore = await cookies()

  return createServerClient(config.url, config.publishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options)
          })
        } catch {
          // Server Components cannot always write cookies. Route handlers can.
        }
      },
    },
  })
}

export async function getCurrentUser() {
  const supabase = await createServerSupabaseClient()

  if (!supabase) {
    return null
  }

  const { data } = await supabase.auth.getUser()
  return data.user
}
