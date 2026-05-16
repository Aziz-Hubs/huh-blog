import { demoAuthor } from "@/lib/demo-data"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import type { PublicProfile } from "@/lib/types"

export async function getProfileByUsername(username: string) {
  const supabase = await createServerSupabaseClient()

  if (!supabase) {
    return username === demoAuthor.username ? demoAuthor : null
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("id, username, display_name, avatar_url, bio, website_url, is_blog_owner")
    .eq("username", username)
    .maybeSingle()

  if (error || !data) return username === demoAuthor.username ? demoAuthor : null

  const row = data as Record<string, unknown>

  return {
    id: String(row.id),
    username: String(row.username),
    displayName: String(row.display_name ?? row.username),
    avatarUrl: row.avatar_url ? String(row.avatar_url) : null,
    bio: row.bio ? String(row.bio) : null,
    websiteUrl: row.website_url ? String(row.website_url) : null,
    isOwner: Boolean(row.is_blog_owner),
  } satisfies PublicProfile
}
