import { NextResponse } from "next/server"
import { createAdminSupabaseClient } from "@/lib/supabase/admin"
import { createServerSupabaseClient } from "@/lib/supabase/server"

export async function POST() {
  const supabase = await createServerSupabaseClient()
  const admin = createAdminSupabaseClient()

  if (!supabase || !admin) {
    return NextResponse.json({ error: "Supabase admin configuration is required" }, { status: 400 })
  }

  const { data } = await supabase.auth.getUser()
  if (!data.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  const { error } = await admin.auth.admin.deleteUser(data.user.id)
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
