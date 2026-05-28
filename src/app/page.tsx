import Link from "next/link"
import { ArrowRight, Rss, Search } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { EmptyState } from "@/components/shared/empty-state"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ProgressiveBlur } from "@/components/ui/progressive-blur"
import { getPublishedPosts } from "@/lib/db/posts"
import { siteConfig } from "@/lib/env"
import { formatDate } from "@/lib/format"
import { cn } from "@/lib/utils"

export default async function HomePage() {
  const posts = await getPublishedPosts({ limit: 10 })
  const [latestPost, ...otherPosts] = posts

  return (
    <div className="relative isolate overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-16 -z-10 h-[34rem] w-[34rem] -translate-x-1/2 rounded-full border border-border/70 opacity-60"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-[8%] top-44 -z-10 h-px w-[84%] bg-gradient-to-r from-transparent via-border to-transparent"
      />

      <section className="mx-auto grid min-h-[calc(100dvh-8rem)] w-full max-w-6xl grid-rows-[1fr_auto] px-4 py-12 sm:px-6 sm:py-16">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.42em] text-muted-foreground">
              Programming / cybersecurity / AI / eventually
            </p>
            <h1 className="mt-8 max-w-4xl font-heading text-[clamp(4rem,13vw,10.5rem)] font-semibold leading-[0.82] tracking-[-0.075em] text-balance">
              Zee,
              <br />
              probably debugging.
            </h1>
            <p className="mt-8 max-w-xl text-lg leading-8 text-muted-foreground sm:text-xl">
              Notes from a productive procrastinator: code, security, AI, and the suspiciously long path between opening the editor and doing the thing.
            </p>
          </div>

          <aside className="border-l pl-6 lg:self-end">
            <p className="font-mono text-xs uppercase tracking-[0.28em] text-muted-foreground">
              Current posture
            </p>
            <p className="mt-4 font-heading text-2xl leading-snug">
              Writing code.
              <br />
              Reading logs.
              <br />
              Avoiding the obvious task.
            </p>
            <div className="mt-8 flex flex-col gap-2">
              <Link href="/blog" className={cn(buttonVariants(), "w-fit")}>
                Enter the archive <ArrowRight className="size-4" />
              </Link>
              <div className="flex flex-wrap gap-1.5">
                <Link href="/search" className={buttonVariants({ variant: "ghost", size: "sm" })}>
                  <Search className="size-4" /> Search
                </Link>
                <Link href="/rss.xml" className={buttonVariants({ variant: "ghost", size: "sm" })}>
                  <Rss className="size-4" /> RSS
                </Link>
              </div>
            </div>
          </aside>
        </div>

        <div className="mt-16 grid gap-4 border-t pt-6 md:grid-cols-[160px_minmax(0,1fr)_auto] md:items-start">
          <p className="font-mono text-xs uppercase tracking-[0.28em] text-muted-foreground">
            Latest delay
          </p>
          {latestPost ? (
            <>
              <div>
                <time className="text-sm text-muted-foreground" dateTime={latestPost.publishedAt ?? undefined}>
                  {formatDate(latestPost.publishedAt)}
                </time>
                <h2 className="mt-2 max-w-2xl font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
                  <Link href={`/blog/${latestPost.slug}`} className="outline-none hover:text-primary focus-visible:rounded focus-visible:ring-2 focus-visible:ring-ring">
                    {latestPost.title}
                  </Link>
                </h2>
                {latestPost.excerpt ? (
                  <p className="mt-3 max-w-2xl leading-7 text-muted-foreground">
                    {latestPost.excerpt}
                  </p>
                ) : null}
              </div>
              <Link href={`/blog/${latestPost.slug}`} className="text-sm font-medium text-primary underline-offset-4 hover:underline">
                Read it
              </Link>
            </>
          ) : (
            <div className="md:col-span-2">
              <EmptyState
                title="No notes published yet"
                description={`When ${siteConfig.name} finally stops reorganizing the task list, the first note will sit here quietly.`}
              />
            </div>
          )}
        </div>

        {/* Bounded, scrollable container of other posts with progressive bottom blur */}
        {otherPosts.length > 0 ? (
          <div className="mt-16 border-t pt-8">
            <p className="font-mono text-xs uppercase tracking-[0.28em] text-muted-foreground mb-6">
              Other delays
            </p>
            <div className="relative w-full rounded-2xl border bg-card/50 overflow-hidden">
              <ScrollArea className="relative h-[220px] overflow-hidden">
                <div className="flex flex-col divide-y divide-border pb-12">
                  {otherPosts.map((post) => (
                    <div
                      key={post.id}
                      className="p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 hover:bg-muted/30 transition-colors"
                    >
                      <div>
                        <time className="text-xs text-muted-foreground" dateTime={post.publishedAt ?? undefined}>
                          {formatDate(post.publishedAt)}
                        </time>
                        <h4 className="font-heading text-lg font-semibold tracking-tight mt-1">
                          <Link href={`/blog/${post.slug}`} className="hover:text-primary outline-none">
                            {post.title}
                          </Link>
                        </h4>
                      </div>
                      <Link
                        href={`/blog/${post.slug}`}
                        className="text-xs font-medium text-primary hover:underline underline-offset-4"
                      >
                        Read
                      </Link>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <ProgressiveBlur position="bottom" height="40%" />
            </div>
          </div>
        ) : null}
      </section>
    </div>
  )
}
