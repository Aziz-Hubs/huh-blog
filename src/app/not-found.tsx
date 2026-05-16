import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60dvh] max-w-xl flex-col items-center justify-center px-4 text-center">
      <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">404</p>
      <h1 className="mt-4 font-heading text-4xl font-semibold tracking-tight">This page is not here</h1>
      <p className="mt-4 text-muted-foreground">The post or page may have moved, stayed private, or never existed.</p>
      <Link href="/blog" className={`${buttonVariants()} mt-8`}>Back to posts</Link>
    </div>
  )
}
