"use client"

import { useTransition } from "react"
import { Bookmark, Heart } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { getSupabaseBrowserClient } from "@/lib/supabase/browser"

export function ReactionButtons({ postId, likeCount }: { postId: string; likeCount: number }) {
  const [isPending, startTransition] = useTransition()
  const supabase = getSupabaseBrowserClient()

  function react(reactionType: "like" | "bookmark") {
    startTransition(async () => {
      if (!supabase) {
        toast.info("Connect Supabase to enable reactions.")
        return
      }

      const { data: userData } = await supabase.auth.getUser()
      if (!userData.user) {
        toast.error("Please sign in first.")
        return
      }

      const { error } = await supabase.from("post_reactions").upsert({ post_id: postId, reaction_type: reactionType })
      if (error) {
        toast.error(error.message)
        return
      }

      toast.success(reactionType === "like" ? "Post liked" : "Post saved")
    })
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Button variant="outline" onClick={() => react("like")} disabled={isPending}>
        <Heart className="size-4" /> {likeCount} likes
      </Button>
      <Button variant="outline" onClick={() => react("bookmark")} disabled={isPending}>
        <Bookmark className="size-4" /> Save
      </Button>
    </div>
  )
}
