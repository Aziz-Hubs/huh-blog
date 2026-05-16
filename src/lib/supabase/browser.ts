"use client"

import { createBrowserClient } from "@supabase/ssr"
import type { SupabaseClient } from "@supabase/supabase-js"
import { getPublicSupabaseConfig } from "@/lib/env"

let browserClient: SupabaseClient | null = null

export function getSupabaseBrowserClient() {
  const config = getPublicSupabaseConfig()

  if (!config) {
    return null
  }

  if (!browserClient) {
    browserClient = createBrowserClient(config.url, config.publishableKey)
  }

  return browserClient
}
