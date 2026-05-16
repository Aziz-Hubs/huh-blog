import { demoComments } from "@/lib/demo-data"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import type { BlogComment, PublicProfile } from "@/lib/types"

function normalizeProfile(value: unknown): PublicProfile | null {
  if (!value || typeof value !== "object") return null
  const row = value as Record<string, unknown>

  return {
    id: row.id ? String(row.id) : undefined,
    username: String(row.username ?? "reader"),
    displayName: String(row.display_name ?? row.full_name ?? row.username ?? "Reader"),
    avatarUrl: row.avatar_url ? String(row.avatar_url) : null,
    bio: row.bio ? String(row.bio) : null,
    websiteUrl: row.website_url ? String(row.website_url) : null,
    isOwner: Boolean(row.is_blog_owner),
  }
}

function normalizeComment(row: Record<string, unknown>): BlogComment {
  return {
    id: String(row.id),
    postId: String(row.post_id),
    parentId: row.parent_id ? String(row.parent_id) : null,
    body: String(row.body ?? row.content ?? ""),
    createdAt: String(row.created_at ?? new Date().toISOString()),
    updatedAt: row.updated_at ? String(row.updated_at) : null,
    deletedAt: row.deleted_at ? String(row.deleted_at) : null,
    likeCount: Number(row.like_count ?? 0),
    author: normalizeProfile(row.profiles ?? row.author ?? row.profile),
    replies: [],
  }
}

export async function getCommentsForPost(postId: string) {
  const supabase = await createServerSupabaseClient()

  if (!supabase) return demoComments.filter((comment) => comment.postId === postId)

  const { data, error } = await supabase
    .from("comments")
    .select("*, profiles:author_id(id, username, display_name, avatar_url, bio, website_url, is_blog_owner)")
    .eq("post_id", postId)
    .order("created_at", { ascending: true })

  if (error || !data) return []

  const comments = (data as Record<string, unknown>[]).map(normalizeComment)
  const byId = new Map(comments.map((comment) => [comment.id, comment]))
  const roots: BlogComment[] = []

  comments.forEach((comment) => {
    if (comment.parentId && byId.has(comment.parentId)) {
      byId.get(comment.parentId)?.replies.push(comment)
      return
    }

    roots.push(comment)
  })

  return roots
}
