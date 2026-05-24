import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Boop } from "@/components/shared/boop"
import { formatDate } from "@/lib/format"
import type { BlogPost } from "@/lib/types"

function getTagEmoji(slug?: string) {
  if (!slug) return "📌"
  if (slug.includes("supabase")) return "🧱"
  if (slug.includes("next")) return "⚡"
  if (slug.includes("writing")) return "✍️"
  return "🌿"
}

export function PostCard({ post, featured = false }: { post: BlogPost; featured?: boolean }) {
  const primaryTag = post.tags.find((tag) => tag.isPrimary) ?? post.tags[0]

  return (
    <article className="hover-lift warm-card group relative overflow-hidden rounded-2xl border bg-card p-5 transition-colors hover:border-primary/40 sm:p-6">
      <div aria-hidden="true" className="absolute right-5 top-5 text-2xl opacity-70 transition-transform duration-200 group-hover:-rotate-6 group-hover:scale-110">
        {getTagEmoji(primaryTag?.slug)}
      </div>
      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
        <time dateTime={post.publishedAt ?? undefined}>{formatDate(post.publishedAt)}</time>
        {primaryTag ? <Badge variant="secondary" className="warm-chip">{primaryTag.name}</Badge> : null}
        <span>{post.viewCount.toLocaleString()} views</span>
      </div>
      <h2 className={featured ? "mt-4 font-heading text-3xl font-semibold tracking-tight" : "mt-4 font-heading text-xl font-semibold tracking-tight"}>
        <Link href={`/blog/${post.slug}`} className="outline-none group-hover:text-primary focus-visible:rounded focus-visible:ring-2 focus-visible:ring-ring">
          {post.title}
        </Link>
      </h2>
      {post.excerpt ? <p className="mt-3 max-w-2xl leading-7 text-muted-foreground">{post.excerpt}</p> : null}
      <div className="mt-5 flex flex-wrap gap-2">
        {post.tags.map((tag) => (
          <Link key={tag.slug} href={`/blog?tag=${tag.slug}`} className="warm-chip rounded-full px-2.5 py-1 text-xs text-muted-foreground underline-offset-4 hover:text-foreground">
            #{tag.slug}
          </Link>
        ))}
      </div>
      <Link href={`/blog/${post.slug}`} className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-primary underline-offset-4 hover:underline">
        Read note
        <Boop x={2} y={-2} rotation={8} scale={1.1}>
          <ArrowUpRight className="size-4" />
        </Boop>
      </Link>
    </article>
  )
}
