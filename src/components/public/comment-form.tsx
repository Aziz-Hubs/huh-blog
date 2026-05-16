"use client"

import { useState, useTransition } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { getSupabaseBrowserClient } from "@/lib/supabase/browser"

export function CommentForm({ postId }: { postId: string }) {
  const [body, setBody] = useState("")
  const [isPending, startTransition] = useTransition()
  const supabase = getSupabaseBrowserClient()

  function submit() {
    startTransition(async () => {
      if (!body.trim()) {
        toast.error("Comment cannot be empty")
        return
      }

      if (!supabase) {
        toast.info("Connect Supabase environment variables to enable commenting.")
        return
      }

      const { data: userData } = await supabase.auth.getUser()
      if (!userData.user) {
        toast.error("Please sign in before commenting.")
        return
      }

      const { error } = await supabase.from("comments").insert({ post_id: postId, body: body.trim() })

      if (error) {
        toast.error(error.message)
        return
      }

      setBody("")
      toast.success("Comment posted")
    })
  }

  return (
    <div className="rounded-2xl border bg-card p-5">
      <Label htmlFor="comment">Join the conversation</Label>
      <Textarea
        id="comment"
        className="mt-3 min-h-32"
        placeholder="Write a thoughtful Markdown comment..."
        value={body}
        onChange={(event) => setBody(event.target.value)}
      />
      <div className="mt-3 flex items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground">Markdown is supported. Replies stay one level deep.</p>
        <Button onClick={submit} disabled={isPending}>{isPending ? "Posting..." : "Post comment"}</Button>
      </div>
    </div>
  )
}
