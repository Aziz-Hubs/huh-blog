import type { Metadata } from "next"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { PostList } from "@/components/public/post-list"
import { getPublishedPosts } from "@/lib/db/posts"

export const metadata: Metadata = {
  title: "Search",
  description: "Search published posts.",
}

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams
  const posts = q.trim() ? await getPublishedPosts({ query: q }) : []

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
      <header>
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">Find a note</p>
        <h1 className="mt-4 font-heading text-4xl font-semibold tracking-tight sm:text-5xl">Search</h1>
        <p className="mt-4 text-lg leading-8 text-muted-foreground">Search titles, excerpts, tags, and Markdown body content without exposing drafts.</p>
      </header>
      <form className="mt-8 flex gap-2" action="/search">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input name="q" defaultValue={q} placeholder="Search published posts..." className="pl-9" aria-label="Search query" />
        </div>
      </form>
      <div className="mt-8">
        {q.trim() ? <PostList posts={posts} /> : <p className="rounded-2xl border border-dashed p-6 text-sm text-muted-foreground">Enter a query to search published writing.</p>}
      </div>
    </div>
  )
}
