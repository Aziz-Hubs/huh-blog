import { demoEmailOutbox, demoMetrics, demoNotifications, demoPosts } from "@/lib/demo-data"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import type { DashboardMetrics, EmailOutboxItem, NotificationItem } from "@/lib/types"

export async function getDashboardAccess() {
  const supabase = await createServerSupabaseClient()

  if (!supabase) {
    return { state: "setup" as const, user: null, isOwner: false }
  }

  const { data: userData } = await supabase.auth.getUser()
  const user = userData.user

  if (!user) {
    return { state: "anonymous" as const, user: null, isOwner: false }
  }

  const { data, error } = await supabase.rpc("is_blog_owner")

  if (error || data !== true) {
    return { state: "forbidden" as const, user, isOwner: false }
  }

  return { state: "owner" as const, user, isOwner: true }
}

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  const supabase = await createServerSupabaseClient()

  if (!supabase) return demoMetrics

  const [{ count: totalPosts }, { count: drafts }, { count: scheduled }, { count: published }, { count: recentComments }, { count: failedEmails }] = await Promise.all([
    supabase.from("posts").select("id", { count: "exact", head: true }),
    supabase.from("posts").select("id", { count: "exact", head: true }).eq("status", "draft"),
    supabase.from("posts").select("id", { count: "exact", head: true }).eq("status", "scheduled"),
    supabase.from("posts").select("id", { count: "exact", head: true }).eq("status", "published"),
    supabase.from("comments").select("id", { count: "exact", head: true }).gte("created_at", new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString()),
    supabase.from("email_outbox").select("id", { count: "exact", head: true }).eq("status", "failed"),
  ])

  const { data: postRows } = await supabase.from("posts").select("view_count")
  const totalViews = (postRows as Record<string, unknown>[] | null)?.reduce((sum, row) => sum + Number(row.view_count ?? 0), 0) ?? 0

  return {
    totalPosts: totalPosts ?? 0,
    drafts: drafts ?? 0,
    scheduled: scheduled ?? 0,
    published: published ?? 0,
    totalViews,
    recentComments: recentComments ?? 0,
    failedEmails: failedEmails ?? 0,
  }
}

export async function getOwnerPosts() {
  const supabase = await createServerSupabaseClient()

  if (!supabase) return demoPosts

  const { data, error } = await supabase.from("posts").select("*").order("updated_at", { ascending: false })

  if (error || !data) return []

  const { normalizePost } = await import("@/lib/db/posts")
  return (data as Record<string, unknown>[]).map(normalizePost)
}

export async function getNotifications(): Promise<NotificationItem[]> {
  const supabase = await createServerSupabaseClient()

  if (!supabase) return demoNotifications

  const { data, error } = await supabase.from("notifications").select("*").order("created_at", { ascending: false }).limit(50)

  if (error || !data) return []

  return (data as Record<string, unknown>[]).map((row) => ({
    id: String(row.id),
    type: String(row.type ?? row.notification_type ?? "notification"),
    title: String(row.title ?? "Notification"),
    body: row.body ? String(row.body) : null,
    readAt: row.read_at ? String(row.read_at) : null,
    createdAt: String(row.created_at ?? new Date().toISOString()),
    href: row.href ? String(row.href) : null,
  }))
}

export async function getEmailOutbox(): Promise<EmailOutboxItem[]> {
  const supabase = await createServerSupabaseClient()

  if (!supabase) return demoEmailOutbox

  const { data, error } = await supabase.from("email_outbox").select("*").order("created_at", { ascending: false }).limit(100)

  if (error || !data) return []

  return (data as Record<string, unknown>[]).map((row) => ({
    id: String(row.id),
    to: String(row.to_email ?? row.to ?? ""),
    subject: String(row.subject ?? "Notification"),
    status: String(row.status ?? "pending"),
    attempts: Number(row.attempts ?? 0),
    lastError: row.last_error ? String(row.last_error) : null,
    createdAt: String(row.created_at ?? new Date().toISOString()),
    sentAt: row.sent_at ? String(row.sent_at) : null,
  }))
}
