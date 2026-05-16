import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Script from "next/script"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { ArticleHeader, ArticleRenderer } from "@/components/public/article-renderer"
import { CommentForm } from "@/components/public/comment-form"
import { CommentList } from "@/components/public/comment-list"
import { ReactionButtons } from "@/components/public/reaction-buttons"
import { getCommentsForPost } from "@/lib/db/comments"
import { getPublishedPostBySlug, recordPostView } from "@/lib/db/posts"
import { siteConfig } from "@/lib/env"
import { absoluteUrl, formatDate, formatDateTime } from "@/lib/format"

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = await getPublishedPostBySlug(slug)

  if (!post) return {}

  const title = post.seoTitle ?? post.title
  const description = post.seoDescription ?? post.excerpt ?? siteConfig.description
  const image = post.ogImageUrl ?? post.coverImageUrl ?? undefined

  return {
    title,
    description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title,
      description,
      type: "article",
      url: absoluteUrl(`/blog/${post.slug}`, siteConfig.url),
      publishedTime: post.publishedAt ?? undefined,
      modifiedTime: post.updatedAt ?? undefined,
      images: image ? [{ url: image, alt: post.coverImageAlt ?? post.title }] : undefined,
    },
    twitter: { card: "summary_large_image", title, description, images: image ? [image] : undefined },
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getPublishedPostBySlug(slug)

  if (!post) notFound()

  recordPostView(post.slug).catch(() => undefined)
  const comments = await getCommentsForPost(post.id)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt ?? post.publishedAt,
    author: { "@type": "Person", name: post.author?.displayName ?? siteConfig.name },
    mainEntityOfPage: absoluteUrl(`/blog/${post.slug}`, siteConfig.url),
  }

  return (
    <article className="px-4 sm:px-6">
      <ArticleHeader post={post} />
      <div className="mx-auto mt-8 flex max-w-3xl flex-wrap items-center gap-4 text-sm text-muted-foreground">
        <span>Published {formatDate(post.publishedAt)}</span>
        {post.updatedAt && post.updatedAt !== post.publishedAt ? <span>Updated {formatDateTime(post.updatedAt)}</span> : null}
        <span>{post.viewCount.toLocaleString()} views</span>
      </div>
      {post.coverImageUrl ? (
        <figure className="mx-auto mt-8 max-w-4xl overflow-hidden rounded-3xl border">
          <img src={post.coverImageUrl} alt={post.coverImageAlt ?? post.title} className="aspect-[16/9] w-full object-cover" />
          {post.coverImageCaption ? <figcaption className="px-4 py-3 text-sm text-muted-foreground">{post.coverImageCaption}</figcaption> : null}
        </figure>
      ) : null}
      <div className="mx-auto mt-10 max-w-3xl">
        <ArticleRenderer content={post.content} />
      </div>
      <footer className="mx-auto mt-12 max-w-3xl space-y-8 pb-16">
        <ReactionButtons postId={post.id} likeCount={post.likeCount} />
        {post.author ? (
          <div className="flex gap-4 rounded-2xl border bg-card p-5">
            <Avatar size="lg">
              {post.author.avatarUrl ? <AvatarImage src={post.author.avatarUrl} alt={`${post.author.displayName} avatar`} /> : null}
              <AvatarFallback>{post.author.displayName.slice(0, 1)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{post.author.displayName}</p>
              {post.author.bio ? <p className="mt-1 text-sm leading-6 text-muted-foreground">{post.author.bio}</p> : null}
            </div>
          </div>
        ) : null}
        <Separator />
        <section id="comments" className="space-y-6">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Conversation</p>
            <h2 className="font-heading text-2xl font-semibold">Comments</h2>
          </div>
          <CommentForm postId={post.id} />
          <CommentList comments={comments} />
        </section>
      </footer>
      <Script id="post-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </article>
  )
}
