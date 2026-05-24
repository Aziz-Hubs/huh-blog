import Link from "next/link"
import { ArrowRight, Rss, Search } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { PostCard } from "@/components/public/post-card"
import { EmptyState } from "@/components/shared/empty-state"
import { getPublishedPosts, getTags } from "@/lib/db/posts"
import { siteConfig } from "@/lib/env"
import { cn } from "@/lib/utils"

export default async function HomePage() {
  const [posts, tags] = await Promise.all([getPublishedPosts({ limit: 4 }), getTags()])
  const [featured, ...recent] = posts

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
      <section className="grid gap-10 lg:grid-cols-[1fr_280px] lg:items-end">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">Personal notes, carefully kept</p>
          <h1 className="mt-4 max-w-3xl font-heading text-5xl font-semibold tracking-tight text-balance sm:text-6xl">
            {siteConfig.name} is a calm place for technical notes and human writing.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
            Read polished essays, implementation notes, and thoughts without the weight of a social feed or a busy CMS.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/blog" className={buttonVariants({ size: "lg" })}>
              Browse posts <ArrowRight className="size-4" />
            </Link>
            <Link href="/search" className={buttonVariants({ variant: "outline", size: "lg" })}>
              <Search className="size-4" /> Search
            </Link>
            <Link href="/rss.xml" className={buttonVariants({ variant: "ghost", size: "lg" })}>
              <Rss className="size-4" /> RSS
            </Link>
          </div>
        </div>
        <Card className="bg-muted/40">
          <CardContent>
            <p className="text-sm leading-6 text-muted-foreground">
              Built from the existing Supabase schema: published post views, comments, profiles, notifications, media, RSS, and sitemap data stay source-of-truth in the database.
            </p>
          </CardContent>
        </Card>
      </section>

      <section className="mt-16">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Latest writing</p>
            <h2 className="font-heading text-3xl font-semibold tracking-tight">Recent posts</h2>
          </div>
          <Link href="/blog" className="text-sm font-medium text-primary hover:underline">All posts</Link>
        </div>
        {featured ? (
          <div className="grid gap-4">
            <PostCard post={featured} featured />
            <div className="grid gap-4 md:grid-cols-2">
              {recent.map((post) => <PostCard key={post.id} post={post} />)}
            </div>
          </div>
        ) : (
          <EmptyState title="No posts yet" description="The first published post will appear here automatically once it is available in Supabase." />
        )}
      </section>

      <section className="mt-16 rounded-3xl border bg-card p-6 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Browse by tag</p>
            <h2 className="font-heading text-2xl font-semibold tracking-tight">A small taxonomy, not categories</h2>
          </div>
          <Link href="/tags" className={cn(buttonVariants({ variant: "outline" }), "w-fit")}>View tags</Link>
        </div>
        <div className="mt-6 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Link key={tag.slug} href={`/blog?tag=${tag.slug}`}>
              <Badge variant="secondary" className="px-3 py-1 text-sm">#{tag.slug}</Badge>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
