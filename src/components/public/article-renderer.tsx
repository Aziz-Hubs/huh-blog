/* eslint-disable @next/next/no-img-element */
import Link from "next/link"
import ReactMarkdown, { type Components } from "react-markdown"
import rehypeSanitize from "rehype-sanitize"
import remarkGfm from "remark-gfm"
import type { BlogPost } from "@/lib/types"

const components: Components = {
  a: ({ href, children, ...props }) => {
    const isExternal = href?.startsWith("http")
    if (!href) return <a {...props}>{children}</a>
    if (isExternal) {
      return <a href={href} rel="noopener noreferrer" target="_blank" {...props}>{children}</a>
    }
    return <Link href={href}>{children}</Link>
  },
  img: ({ alt, ...props }) => <img alt={alt ?? "Post image"} loading="lazy" {...props} />,
}

export function ArticleRenderer({ content }: { content: string }) {
  return (
    <div className="article-prose">
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSanitize]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  )
}

export function ArticleHeader({ post }: { post: BlogPost }) {
  return (
    <header className="mx-auto max-w-3xl pt-12 sm:pt-16">
      <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
        {post.tags.map((tag) => (
          <Link key={tag.slug} href={`/blog?tag=${tag.slug}`} className="rounded-full border px-3 py-1 text-xs hover:bg-muted">
            {tag.name}
          </Link>
        ))}
      </div>
      <h1 className="mt-6 font-heading text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
        {post.title}
      </h1>
      {post.excerpt ? <p className="mt-5 text-xl leading-8 text-muted-foreground">{post.excerpt}</p> : null}
    </header>
  )
}
