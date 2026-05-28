import Link from "next/link"
import { ArrowRight, Rss, Search } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { EmptyState } from "@/components/shared/empty-state"
import { getPublishedPosts } from "@/lib/db/posts"
import { siteConfig } from "@/lib/env"
import { formatDate } from "@/lib/format"
import { cn } from "@/lib/utils"

export default async function HomePage() {
  const posts = await getPublishedPosts({ limit: 1 })
  const latestPost = posts[0]

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
              Personal notes / technical traces / quiet signal
            </p>
            <h1 className="mt-8 max-w-4xl font-heading text-[clamp(4rem,13vw,10.5rem)] font-semibold leading-[0.82] tracking-[-0.075em] text-balance">
              Huh,
              <br />
              kept simple.
            </h1>
            <p className="mt-8 max-w-xl text-lg leading-8 text-muted-foreground sm:text-xl">
              A small writing room for technical notes, personal essays, and half-lit ideas that are not trying to become a platform.
            </p>
          </div>

          <aside className="border-l pl-6 lg:self-end">
            <p className="font-mono text-xs uppercase tracking-[0.28em] text-muted-foreground">
              Current posture
            </p>
            <p className="mt-4 font-heading text-2xl leading-snug">
              Calm interface.
              <br />
              Sharp writing.
              <br />
              No feed-shaped panic.
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
            Latest note
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
                description={`When ${siteConfig.name} has a first published note, it will sit here quietly.`}
              />
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
