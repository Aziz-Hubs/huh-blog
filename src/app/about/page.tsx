import type { Metadata } from "next"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { buttonVariants } from "@/components/ui/button"
import { demoAuthor } from "@/lib/demo-data"

export const metadata: Metadata = {
  title: "About",
  description: "About the person and purpose behind this blog.",
}

export default function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="rounded-3xl border bg-card p-8 sm:p-10">
        <Avatar size="lg" className="size-16">
          {demoAuthor.avatarUrl ? <AvatarImage src={demoAuthor.avatarUrl} alt={`${demoAuthor.displayName} avatar`} /> : null}
          <AvatarFallback>{demoAuthor.displayName.slice(0, 1)}</AvatarFallback>
        </Avatar>
        <h1 className="mt-6 font-heading text-4xl font-semibold tracking-tight">A personal writing home</h1>
        <p className="mt-5 text-lg leading-8 text-muted-foreground">
          This blog exists for technical notes, careful essays, and general thoughts that deserve a quieter place than a social feed. It is designed as a personal tool first: fast to write in, pleasant to read, and simple to maintain.
        </p>
        <p className="mt-5 leading-8 text-muted-foreground">
          The application is wired to Supabase for auth, database rules, storage, comments, notifications, RSS, sitemap, and owner-only publishing workflows.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/blog" className={buttonVariants()}>Read the blog</Link>
          <Link href={`/profile/${demoAuthor.username}`} className={buttonVariants({ variant: "outline" })}>Owner profile</Link>
        </div>
      </div>
    </div>
  )
}
