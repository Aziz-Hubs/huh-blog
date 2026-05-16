"use client"

import { useRef, useState, useTransition } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { getSupabaseBrowserClient } from "@/lib/supabase/browser"

export function ProfileSettingsForm() {
  const supabase = getSupabaseBrowserClient()
  const [isPending, startTransition] = useTransition()
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const formRef = useRef<HTMLFormElement>(null)

  function submit(formData: FormData) {
    startTransition(async () => {
      if (!supabase) {
        toast.info("Connect Supabase to update profiles.")
        return
      }

      const { data: userData } = await supabase.auth.getUser()
      const user = userData.user
      if (!user) {
        toast.error("Please sign in first.")
        return
      }

      let avatarUrl = String(formData.get("avatarUrl") ?? "") || null
      if (avatarFile) {
        const path = `${user.id}/avatar.webp`
        const { error: uploadError } = await supabase.storage.from("avatars").upload(path, avatarFile, { upsert: true, contentType: avatarFile.type })
        if (uploadError) {
          toast.error(uploadError.message)
          return
        }
        const { data } = supabase.storage.from("avatars").getPublicUrl(path)
        avatarUrl = data.publicUrl
      }

      const { error } = await supabase
        .from("profiles")
        .update({
          username: String(formData.get("username") ?? "").trim(),
          display_name: String(formData.get("displayName") ?? "").trim(),
          bio: String(formData.get("bio") ?? "").trim() || null,
          website_url: String(formData.get("websiteUrl") ?? "").trim() || null,
          avatar_url: avatarUrl,
        })
        .eq("id", user.id)

      if (error) {
        toast.error(error.message)
        return
      }

      toast.success("Profile updated")
    })
  }

  function deleteAccount() {
    startTransition(async () => {
      if (!confirm("Delete your account? This cannot be undone.")) return
      const response = await fetch("/api/account/delete", { method: "POST" })
      if (!response.ok) {
        const body = await response.json().catch(() => ({ error: "Account deletion failed" }))
        toast.error(body.error ?? "Account deletion failed")
        return
      }
      toast.success("Account deleted")
      window.location.href = "/"
    })
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <Card>
        <CardHeader><CardTitle>Profile settings</CardTitle><CardDescription>Maintain the public identity shown beside comments.</CardDescription></CardHeader>
        <CardContent>
          <form ref={formRef} action={submit} className="space-y-4">
            <div className="space-y-2"><Label>Username</Label><Input name="username" pattern="[a-z0-9_]+" placeholder="aziz" required /></div>
            <div className="space-y-2"><Label>Display name</Label><Input name="displayName" placeholder="Aziz" required /></div>
            <div className="space-y-2"><Label>Bio</Label><Textarea name="bio" maxLength={500} /></div>
            <div className="space-y-2"><Label>Website URL</Label><Input name="websiteUrl" type="url" placeholder="https://example.com" /></div>
            <div className="space-y-2"><Label>Existing avatar URL</Label><Input name="avatarUrl" type="url" /></div>
            <div className="space-y-2"><Label>Upload avatar</Label><Input type="file" accept="image/*" onChange={(event) => setAvatarFile(event.target.files?.[0] ?? null)} /></div>
            <Button type="submit" disabled={isPending}>{isPending ? "Saving..." : "Save profile"}</Button>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Delete account</CardTitle><CardDescription>Deletion removes the auth user with service-role access. Comments remain according to database cascade/anonymization rules.</CardDescription></CardHeader>
        <CardContent><Button type="button" variant="destructive" onClick={deleteAccount} disabled={isPending}>Delete account</Button></CardContent>
      </Card>
    </div>
  )
}
