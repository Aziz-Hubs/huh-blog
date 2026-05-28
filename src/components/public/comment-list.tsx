import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { KineticText } from "@/components/ui/kinetic-text"
import { ArticleRenderer } from "@/components/public/article-renderer"
import { CommentActions } from "@/components/public/comment-actions"
import { timeAgo } from "@/lib/format"
import type { BlogComment } from "@/lib/types"

export function CommentList({ comments }: { comments: BlogComment[] }) {
  if (comments.length === 0) {
    return <p className="rounded-2xl border border-dashed p-6 text-sm text-muted-foreground">No comments yet. Be the first reader to start a thoughtful conversation.</p>
  }

  return (
    <div className="space-y-6">
      {comments.map((comment) => (
        <CommentItem key={comment.id} comment={comment} />
      ))}
    </div>
  )
}

function CommentItem({ comment }: { comment: BlogComment }) {
  return (
    <article className="rounded-2xl border bg-card p-5">
      <CommentAuthor comment={comment} />
      <div className="mt-4 text-sm">
        {comment.deletedAt ? <p className="italic text-muted-foreground">[deleted]</p> : <ArticleRenderer content={comment.body} />}
      </div>
      <div className="mt-4 flex items-center gap-3 text-xs text-muted-foreground">
        <span>{comment.likeCount} likes</span>
        {!comment.parentId ? <span>Reply</span> : null}
      </div>
      <div className="mt-2"><CommentActions commentId={comment.id} deleted={Boolean(comment.deletedAt)} /></div>
      {comment.replies.length > 0 ? (
        <div className="mt-5 border-l pl-5">
          <Separator className="mb-5" />
          <div className="space-y-4">
            {comment.replies.map((reply) => (
              <article key={reply.id} className="rounded-xl bg-muted/40 p-4">
                <CommentAuthor comment={reply} />
                <div className="mt-3 text-sm">
                  {reply.deletedAt ? <p className="italic text-muted-foreground">[deleted]</p> : <ArticleRenderer content={reply.body} />}
                </div>
              </article>
            ))}
          </div>
        </div>
      ) : null}
    </article>
  )
}

function CommentAuthor({ comment }: { comment: BlogComment }) {
  const author = comment.author

  return (
    <div className="flex items-center gap-3">
      <Avatar>
        {author?.avatarUrl ? <AvatarImage src={author.avatarUrl} alt={`${author.displayName} avatar`} /> : null}
        <AvatarFallback>{author?.displayName?.slice(0, 1) ?? "?"}</AvatarFallback>
      </Avatar>
      <div>
        <div className="flex flex-wrap items-center gap-2 text-sm font-medium">
          {author ? (
            <Link href={`/profile/${author.username}`}>
              <KineticText text={author.displayName} as="span" className="text-sm font-medium" />
            </Link>
          ) : (
            <span>Deleted user</span>
          )}
          {author?.isOwner ? <Badge variant="secondary">Owner</Badge> : null}
        </div>
        <p className="text-xs text-muted-foreground">{timeAgo(comment.createdAt)}</p>
      </div>
    </div>
  )
}
