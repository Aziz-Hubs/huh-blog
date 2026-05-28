/* eslint-disable @next/next/no-img-element */
import Link from "next/link"
import React from "react"
import ReactMarkdown, { type Components } from "react-markdown"
import rehypeSanitize from "rehype-sanitize"
import remarkGfm from "remark-gfm"
import { ComicText } from "@/components/ui/comic-text"
import { KineticText } from "@/components/ui/kinetic-text"
import { TextAnimate } from "@/components/ui/text-animate"
import Wobble from "@/components/ui/wobble"
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

// Simple deterministic hash helper to avoid SSR/hydration mismatches while keeping it looking organic
function getTagStickerStyles(name: string, index: number) {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }

  // Calculate coordinates bounded near the top right of the header container
  const seedX = Math.abs((hash + index * 31) % 25) // 0% to 25% horizontal offset
  const seedY = Math.abs((hash + index * 47) % 20) // 0px to 20px vertical offset
  const rotation = ((hash + index * 17) % 24) - 12 // -12 to 12 deg tilt

  return {
    right: `${seedX}%`,
    top: `${seedY}px`,
    transform: `rotate(${rotation}deg)`,
  }
}

export function ArticleHeader({ post }: { post: BlogPost }) {
  return (
    <header className="mx-auto max-w-3xl pt-16 sm:pt-20 relative min-h-[160px]">
      {/* Cartoon Sticker Board Layer */}
      <div className="absolute right-0 top-0 h-16 w-1/2 hidden md:block">
        {post.tags.map((tag, index) => {
          const stickerStyles = getTagStickerStyles(tag.name, index)
          return (
            <div
              key={tag.slug}
              className="absolute select-none pointer-events-auto transition-transform hover:scale-105 hover:z-20 active:scale-95"
              style={stickerStyles}
            >
              <Wobble scale={1.04}>
                <Link href={`/blog?tag=${tag.slug}`} className="block">
                  {/* Thick white border outline mimicking cut vinyl stickers */}
                  <div className="bg-background border-4 border-black rounded-2xl p-2 py-1 shadow-[4px_4px_0px_#000000] hover:shadow-[6px_6px_0px_#000000] active:shadow-[2px_2px_0px_#000000] transition-shadow">
                    <ComicText fontSize={1.1} className="leading-none">
                      {tag.name}
                    </ComicText>
                  </div>
                </Link>
              </Wobble>
            </div>
          )
        })}
      </div>

      {/* Mobile/Small Screen Fallback (inline comic-tags inline grid row) */}
      <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground md:hidden mb-6">
        {post.tags.map((tag) => (
          <Link key={tag.slug} href={`/blog?tag=${tag.slug}`} className="hover:opacity-85 transition-opacity">
            <div className="bg-background border-2 border-black rounded-xl px-2 py-0.5 shadow-[2px_2px_0px_#000000]">
              <ComicText fontSize={0.7} className="leading-none">
                {tag.name}
              </ComicText>
            </div>
          </Link>
        ))}
      </div>

      <h1 className="mt-4 font-heading text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
        <KineticText text={post.title} as="span" className="font-heading" />
      </h1>
      {post.excerpt ? (
        <p className="mt-5 text-xl leading-8 text-muted-foreground">{post.excerpt}</p>
      ) : null}
    </header>
  )
}
