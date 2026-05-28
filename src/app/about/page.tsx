import type { Metadata } from "next"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { buttonVariants } from "@/components/ui/button"
import { demoAuthor } from "@/lib/demo-data"

export const metadata: Metadata = {
  title: "About",
  description: "About Zee and the notes behind the blog.",
}

export default function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="rounded-3xl border bg-card p-8 sm:p-10">
        <Avatar size="lg" className="size-16">
          {demoAuthor.avatarUrl ? <AvatarImage src={demoAuthor.avatarUrl} alt={`${demoAuthor.displayName} avatar`} /> : null}
          <AvatarFallback>{demoAuthor.displayName.slice(0, 1)}</AvatarFallback>
        </Avatar>
        <h1 className="mt-6 font-heading text-4xl font-semibold tracking-tight">About Zee</h1>
        <p className="mt-5 text-lg leading-8 text-muted-foreground">
          Zee writes about programming, cybersecurity, and AI from the point of view of someone who is very good at almost starting. The delay is part coping mechanism, part research method, and occasionally part architecture diagram.
        </p>
        <p className="mt-5 leading-8 text-muted-foreground">
          Expect practical notes, defensive thinking, experiments with AI tools, and a quiet respect for the humble TODO comment that has seen too much.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/blog" className={buttonVariants()}>Read the blog</Link>
          <Link href={`/profile/${demoAuthor.username}`} className={buttonVariants({ variant: "outline" })}>Owner profile</Link>
        </div>
      </div>
    </div>
  )
}
