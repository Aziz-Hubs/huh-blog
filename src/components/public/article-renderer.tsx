/* eslint-disable @next/next/no-img-element */
import Link from "next/link"
import ReactMarkdown, { type Components } from "react-markdown"
import rehypeSanitize from "rehype-sanitize"
import remarkGfm from "remark-gfm"
import { ComicText } from "@/components/ui/comic-text"
import { TextAnimate } from "@/components/ui/text-animate"
import type { BlogPost } from "@/lib/types"

// Helper: convert React children to a plain string for TextAnimate
function childrenToString(children: React.ReactNode): string {
  if (typeof children === "string") return children
  if (typeof children === "number") return String(children)
  if (Array.isArray(children)) return children.map(childrenToString).join("")
  if (
    typeof children === "object" &&
    children !== null &&
    "props" in children &&
    typeof (children as { props?: { children?: React.ReactNode } }).props?.children !==
      "undefined"
  ) {
    return childrenToString(
      (children as { props: { children: React.ReactNode } }).props.children
    )
  }
  return ""
}

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
  p: ({ children }) => {
    const text = childrenToString(children)
    if (!text.trim()) return <p>{children}</p>
    return (
      <TextAnimate as="p" animation="fadeIn" by="word" once duration={0.5}>
        {text}
      </TextAnimate>
    )
  },
  h1: ({ children }) => {
    const text = childrenToString(children)
    return (
      <TextAnimate as="h1" animation="blurInUp" by="word" once duration={0.45}>
        {text}
      </TextAnimate>
    )
  },
  h2: ({ children }) => {
    const text = childrenToString(children)
    return (
      <TextAnimate as="h2" animation="blurInUp" by="word" once duration={0.45}>
        {text}
      </TextAnimate>
    )
  },
  h3: ({ children }) => {
    const text = childrenToString(children)
    return (
      <TextAnimate as="h3" animation="blurInUp" by="word" once duration={0.45}>
        {text}
      </TextAnimate>
    )
  },
  li: ({ children }) => {
    const text = childrenToString(children)
    if (!text.trim()) return <li>{children}</li>
    return (
      <TextAnimate as="li" animation="fadeIn" by="word" once duration={0.45}>
        {text}
      </TextAnimate>
    )
  },
  blockquote: ({ children }) => {
    const text = childrenToString(children)
    if (!text.trim()) return <blockquote>{children}</blockquote>
    return (
      <blockquote>
        <TextAnimate as="p" animation="blurIn" by="word" once duration={0.55}>
          {text}
        </TextAnimate>
      </blockquote>
    )
  },
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
      <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
        {post.tags.map((tag) => (
          <Link key={tag.slug} href={`/blog?tag=${tag.slug}`} className="hover:opacity-85 transition-opacity">
            <ComicText fontSize={0.8} className="rounded-md px-2 py-0.5 border shadow-sm">
              {`#${tag.name}`}
            </ComicText>
          </Link>
        ))}
      </div>
      <h1 className="mt-6 font-heading text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
        {post.title}
      </h1>
      {post.excerpt ? (
        <p className="mt-5 text-xl leading-8 text-muted-foreground">{post.excerpt}</p>
      ) : null}
    </header>
  )
}
