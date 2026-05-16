import type { Metadata } from "next"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getTags } from "@/lib/db/posts"

export const metadata: Metadata = {
  title: "Tags",
  description: "Browse the blog taxonomy.",
}

export default async function TagsPage() {
  const tags = await getTags()

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
      <header className="max-w-2xl">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">Taxonomy</p>
        <h1 className="mt-4 font-heading text-4xl font-semibold tracking-tight sm:text-5xl">Tags</h1>
        <p className="mt-4 text-lg leading-8 text-muted-foreground">Tags organize writing without turning the blog into a category-heavy CMS.</p>
      </header>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tags.map((tag) => (
          <Link key={tag.slug} href={`/blog?tag=${tag.slug}`}>
            <Card className="h-full transition-colors hover:border-foreground/20">
              <CardHeader>
                <CardTitle>#{tag.slug}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-6 text-muted-foreground">{tag.description ?? `Posts tagged ${tag.name}.`}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
