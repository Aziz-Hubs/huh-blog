"use client"

import { useTransition } from "react"
import { Heart, Pencil, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { getSupabaseBrowserClient } from "@/lib/supabase/browser"

export function CommentActions({ commentId, deleted }: { commentId: string; deleted: boolean }) {
  const [isPending, startTransition] = useTransition()
  const supabase = getSupabaseBrowserClient()

  function like() {
    startTransition(async () => {
      if (!supabase) {
        toast.info("Connect Supabase to like comments.")
        return
      }
      const { data: userData } = await supabase.auth.getUser()
      if (!userData.user) {
        toast.error("Please sign in first.")
        return
      }
      const { error } = await supabase.from("comment_reactions").upsert({ comment_id: commentId, reaction_type: "like" })
      if (error) toast.error(error.message)
      else toast.success("Comment liked")
    })
  }

  function edit() {
    startTransition(async () => {
      if (!supabase) {
        toast.info("Connect Supabase to edit comments.")
        return
      }
      const nextBody = prompt("Edit your comment")
      if (!nextBody?.trim()) return
      const { error } = await supabase.from("comments").update({ body: nextBody.trim(), edited_at: new Date().toISOString() }).eq("id", commentId)
      if (error) toast.error(error.message)
      else toast.success("Comment updated")
    })
  }

  function remove() {
    startTransition(async () => {
      if (!supabase) {
        toast.info("Connect Supabase to delete comments.")
        return
      }
      if (!confirm("Delete this comment?")) return
      const { error } = await supabase.rpc("delete_my_comment", { comment_id: commentId })
      if (error) toast.error(error.message)
      else toast.success("Comment deleted")
    })
  }

  return (
    <div className="flex flex-wrap gap-1">
      <Button type="button" variant="ghost" size="sm" onClick={like} disabled={isPending}><Heart className="size-4" /> Like</Button>
      <Button type="button" variant="ghost" size="sm" onClick={edit} disabled={isPending || deleted}><Pencil className="size-4" /> Edit</Button>
      <Button type="button" variant="ghost" size="sm" onClick={remove} disabled={isPending || deleted}><Trash2 className="size-4" /> Delete</Button>
    </div>
  )
}
