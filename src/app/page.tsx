import Link from "next/link"
import { ArrowRight, Rss, Search } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { PostCard } from "@/components/public/post-card"
import { EmptyState } from "@/components/shared/empty-state"
import { AnimatedEmoji, Boop } from "@/components/shared/boop"
import { getPublishedPosts, getTags } from "@/lib/db/posts"
import { siteConfig } from "@/lib/env"
import { cn } from "@/lib/utils"

export default async function HomePage() {
  const [posts, tags] = await Promise.all([getPublishedPosts({ limit: 4 }), getTags()])
  const [featured, ...recent] = posts

  return (
    <div className="relative isolate mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
      <div aria-hidden="true" className="pointer-events-none absolute right-4 top-10 -z-10 size-40 rounded-full bg-primary/10 blur-3xl" />
      <section className="grid gap-10 lg:grid-cols-[1fr_300px] lg:items-end">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border bg-card/70 px-3 py-1 text-sm font-medium text-muted-foreground shadow-sm">
            <Boop rotation={-12} scale={1.14}>
              <span aria-hidden="true">✨</span>
            </Boop>
            Tiny interactions, carefully kept
          </p>
          <h1 className="mt-4 max-w-3xl font-heading text-5xl font-semibold tracking-tight text-balance sm:text-6xl">
            {siteConfig.name} is a warm, calm corner for technical notes and human writing.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
            Read polished essays, implementation notes, and thoughts with quiet little sparks: playful when useful, still when you need to focus.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/blog" className={cn(buttonVariants({ size: "lg" }), "animated-button")}>
              Browse posts
              <Boop x={3} y={0} rotation={0} scale={1.08}>
                <ArrowRight className="size-4" />
              </Boop>
            </Link>
            <Link href="/search" className={cn(buttonVariants({ variant: "outline", size: "lg" }), "animated-button")}>
              <Search className="size-4" /> Search
            </Link>
            <Link href="/rss.xml" className={buttonVariants({ variant: "ghost", size: "lg" })}>
              <Rss className="size-4" /> RSS
            </Link>
          </div>
        </div>
        <Card className="warm-card border-primary/20 bg-muted/40">
          <CardContent className="relative">
            <div className="mb-5 flex items-center gap-3 text-3xl">
              <AnimatedEmoji emoji="☕" label="coffee" className="ambient-emoji" rotation={-8} delay="0ms" />
              <AnimatedEmoji emoji="📝" label="memo" className="ambient-emoji" rotation={7} delay="500ms" />
              <AnimatedEmoji emoji="🌙" label="moon" className="ambient-emoji" rotation={10} delay="900ms" />
            </div>
            <p className="text-sm leading-6 text-muted-foreground">
              Built from the existing Supabase schema, with motion that behaves like a small wink: quick, reversible, and respectful of reduced-motion preferences.
            </p>
          </CardContent>
        </Card>
      </section>

      <section className="mt-16">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Latest writing ✍️</p>
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

      <section className="warm-card mt-16 rounded-3xl border bg-card p-6 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Browse by tag 🧭</p>
            <h2 className="font-heading text-2xl font-semibold tracking-tight">A small taxonomy, not categories</h2>
          </div>
          <Link href="/tags" className={cn(buttonVariants({ variant: "outline" }), "animated-button w-fit")}>View tags</Link>
        </div>
        <div className="mt-6 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Link key={tag.slug} href={`/blog?tag=${tag.slug}`}>
              <Badge variant="secondary" className="warm-chip px-3 py-1 text-sm">#{tag.slug}</Badge>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
