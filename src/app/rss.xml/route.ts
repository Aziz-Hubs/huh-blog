import { getRssPosts } from "@/lib/db/posts"
import { siteConfig } from "@/lib/env"
import { absoluteUrl } from "@/lib/format"

export const dynamic = "force-dynamic"

export async function GET() {
  const posts = await getRssPosts()
  const items = posts
    .map((post) => `
      <item>
        <title>${escapeXml(post.title)}</title>
        <link>${escapeXml(absoluteUrl(`/blog/${post.slug}`, siteConfig.url))}</link>
        <guid>${escapeXml(absoluteUrl(`/blog/${post.slug}`, siteConfig.url))}</guid>
        <description>${escapeXml(post.excerpt ?? "")}</description>
        <pubDate>${post.publishedAt ? new Date(post.publishedAt).toUTCString() : new Date().toUTCString()}</pubDate>
        <content:encoded><![CDATA[${post.content}]]></content:encoded>
      </item>`)
    .join("")

  const rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${escapeXml(siteConfig.name)}</title>
    <link>${escapeXml(siteConfig.url)}</link>
    <description>${escapeXml(siteConfig.description)}</description>
    <language>en</language>
    ${items}
  </channel>
</rss>`

  return new Response(rss, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=600, stale-while-revalidate=3600",
    },
  })
}

function escapeXml(value: string) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&apos;")
}
