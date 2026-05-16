import { z } from "zod"

const publicEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string().min(1).optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1).optional(),
  NEXT_PUBLIC_SITE_URL: z.string().url().optional(),
  NEXT_PUBLIC_SITE_NAME: z.string().min(1).optional(),
})

const serverEnvSchema = publicEnvSchema.extend({
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),
  RESEND_API_KEY: z.string().min(1).optional(),
  RESEND_FROM_EMAIL: z.string().min(1).optional(),
  RESEND_REPLY_TO_EMAIL: z.string().email().optional().or(z.literal("")),
  CRON_SECRET: z.string().min(1).optional(),
})

export const env = serverEnvSchema.parse({
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_SITE_NAME: process.env.NEXT_PUBLIC_SITE_NAME,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  RESEND_FROM_EMAIL: process.env.RESEND_FROM_EMAIL,
  RESEND_REPLY_TO_EMAIL: process.env.RESEND_REPLY_TO_EMAIL,
  CRON_SECRET: process.env.CRON_SECRET,
})

export function getPublicSupabaseConfig() {
  const key = env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!env.NEXT_PUBLIC_SUPABASE_URL || !key) {
    return null
  }

  return {
    url: env.NEXT_PUBLIC_SUPABASE_URL,
    publishableKey: key,
  }
}

export function getAdminSupabaseConfig() {
  const publicConfig = getPublicSupabaseConfig()

  if (!publicConfig || !env.SUPABASE_SERVICE_ROLE_KEY) {
    return null
  }

  return {
    url: publicConfig.url,
    serviceRoleKey: env.SUPABASE_SERVICE_ROLE_KEY,
  }
}

export const siteConfig = {
  name: env.NEXT_PUBLIC_SITE_NAME ?? "Huh",
  url: env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  description:
    "A calm personal blog for technical notes, essays, and thoughtful writing.",
}
