import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/format"
import type { BlogPost } from "@/lib/types"

export function PostCard({ post, featured = false }: { post: BlogPost; featured?: boolean }) {
  const primaryTag = post.tags.find((tag) => tag.isPrimary) ?? post.tags[0]

  return (
    <article className="group rounded-2xl border bg-card p-5 transition-colors hover:border-foreground/20 sm:p-6">
      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
        <time dateTime={post.publishedAt ?? undefined}>{formatDate(post.publishedAt)}</time>
        {primaryTag ? <Badge variant="secondary">{primaryTag.name}</Badge> : null}
        <span>{post.viewCount.toLocaleString()} views</span>
      </div>
      <h2 className={featured ? "mt-4 font-heading text-3xl font-semibold tracking-tight" : "mt-4 font-heading text-xl font-semibold tracking-tight"}>
        <Link href={`/blog/${post.slug}`} className="outline-none group-hover:text-primary focus-visible:rounded focus-visible:ring-2 focus-visible:ring-ring">
          {post.title}
        </Link>
      </h2>
      {post.excerpt ? (
        <p className="mt-3 max-w-2xl leading-7 text-muted-foreground">{post.excerpt}</p>
      ) : null}
      <div className="mt-5 flex flex-wrap gap-2">
        {post.tags.map((tag) => (
          <Link key={tag.slug} href={`/blog?tag=${tag.slug}`} className="text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">
            #{tag.slug}
          </Link>
        ))}
      </div>
    </article>
  )
}
