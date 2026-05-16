import { NextResponse, type NextRequest } from "next/server"
import { Resend } from "resend"
import { env, siteConfig } from "@/lib/env"
import { createAdminSupabaseClient } from "@/lib/supabase/admin"

export async function POST(request: NextRequest) {
  if (env.CRON_SECRET) {
    const token = request.headers.get("authorization")?.replace("Bearer ", "")
    if (token !== env.CRON_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
  }

  if (!env.RESEND_API_KEY) {
    return NextResponse.json({ error: "RESEND_API_KEY is not configured" }, { status: 400 })
  }

  const supabase = createAdminSupabaseClient()
  if (!supabase) {
    return NextResponse.json({ error: "Supabase service role is not configured" }, { status: 400 })
  }

  const { data, error } = await supabase.from("email_outbox").select("*").eq("status", "pending").limit(20)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const resend = new Resend(env.RESEND_API_KEY)
  const results = []

  for (const row of data ?? []) {
    const record = row as Record<string, unknown>
    const id = String(record.id)
    const to = String(record.to_email ?? record.to)
    const subject = String(record.subject ?? `Notification from ${siteConfig.name}`)
    const html = String(record.html_body ?? record.body ?? "You have a new notification.")

    const sendResult = await resend.emails.send({
      from: env.RESEND_FROM_EMAIL ?? `${siteConfig.name} <notifications@example.com>`,
      to,
      subject,
      html,
      replyTo: env.RESEND_REPLY_TO_EMAIL || undefined,
    })

    if (sendResult.error) {
      await supabase
        .from("email_outbox")
        .update({ status: "failed", last_error: sendResult.error.message, attempts: Number(record.attempts ?? 0) + 1 })
        .eq("id", id)
      results.push({ id, status: "failed" })
      continue
    }

    await supabase.from("email_outbox").update({ status: "sent", sent_at: new Date().toISOString(), attempts: Number(record.attempts ?? 0) + 1 }).eq("id", id)
    results.push({ id, status: "sent" })
  }

  return NextResponse.json({ processed: results.length, results })
}
