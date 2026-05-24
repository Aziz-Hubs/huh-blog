import Link from "next/link"
import { siteConfig } from "@/lib/env"

export function SiteFooter() {
  return (
    <footer className="border-t">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-4 py-10 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>{siteConfig.name} is a quiet home for technical notes, personal writing, and very small nonsense.</p>
        <div className="flex gap-4">
          <Link href="/rss.xml" className="hover:text-foreground">RSS</Link>
          <Link href="/sitemap.xml" className="hover:text-foreground">Sitemap</Link>
        </div>
      </div>
    </footer>
  )
}
