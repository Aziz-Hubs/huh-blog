import type { Metadata } from "next"
import Link from "next/link"
import { PostList } from "@/components/public/post-list"
import { getPublishedPosts, getTags } from "@/lib/db/posts"

export const metadata: Metadata = {
  title: "Blog",
  description: "All published notes and essays.",
}

export default async function BlogIndexPage({ searchParams }: { searchParams: Promise<{ tag?: string }> }) {
  const { tag } = await searchParams
  const [posts, tags] = await Promise.all([getPublishedPosts({ tag }), getTags()])

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
      <header className="max-w-2xl">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">Reading list</p>
        <h1 className="mt-4 font-heading text-4xl font-semibold tracking-tight sm:text-5xl">Published posts</h1>
        <p className="mt-4 text-lg leading-8 text-muted-foreground">Every public note, sorted with the newest writing first. Drafts and scheduled posts stay hidden by the database view.</p>
      </header>
      <div className="mt-8 flex flex-wrap gap-2 text-sm">
        <Link href="/blog" className={!tag ? "rounded-full bg-primary px-3 py-1 text-primary-foreground" : "rounded-full border px-3 py-1 text-muted-foreground hover:text-foreground"}>All</Link>
        {tags.map((item) => (
          <Link key={item.slug} href={`/blog?tag=${item.slug}`} className={tag === item.slug ? "rounded-full bg-primary px-3 py-1 text-primary-foreground" : "rounded-full border px-3 py-1 text-muted-foreground hover:text-foreground"}>
            {item.name}
          </Link>
        ))}
      </div>
      <div className="mt-8">
        <PostList posts={posts} />
      </div>
    </div>
  )
}
