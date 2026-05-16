import { demoPosts, demoTags } from "@/lib/demo-data"
import { siteConfig } from "@/lib/env"
import { absoluteUrl } from "@/lib/format"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import type { BlogPost, BlogTag } from "@/lib/types"

function normalizeTags(value: unknown): BlogTag[] {
  if (!value) return []

  if (Array.isArray(value)) {
    return value
      .map((tag) => {
        if (typeof tag === "string") {
          return { name: tag, slug: tag.toLowerCase().replaceAll(" ", "-") }
        }

        if (tag && typeof tag === "object") {
          const item = tag as Record<string, unknown>
          const name = String(item.name ?? item.tag_name ?? "Tag")
          return {
            id: item.id ? String(item.id) : undefined,
            name,
            slug: String(item.slug ?? name.toLowerCase().replaceAll(" ", "-")),
            description: item.description ? String(item.description) : null,
            seoTitle: item.seo_title ? String(item.seo_title) : null,
            seoDescription: item.seo_description ? String(item.seo_description) : null,
            isPrimary: Boolean(item.is_primary ?? item.primary),
          }
        }

        return null
      })
      .filter(Boolean) as BlogTag[]
  }

  return []
}

export function normalizePost(row: Record<string, unknown>): BlogPost {
  return {
    id: String(row.id),
    title: String(row.title ?? "Untitled post"),
    slug: String(row.slug ?? row.id),
    excerpt: row.excerpt ? String(row.excerpt) : null,
    content: String(row.content ?? row.markdown ?? ""),
    coverImageUrl: row.cover_image_url ? String(row.cover_image_url) : null,
    coverImageAlt: row.cover_image_alt ? String(row.cover_image_alt) : null,
    coverImageCaption: row.cover_image_caption ? String(row.cover_image_caption) : null,
    publishedAt: row.published_at ? String(row.published_at) : null,
    updatedAt: row.updated_at ? String(row.updated_at) : null,
    status: row.status ? String(row.status) : undefined,
    seoTitle: row.seo_title ? String(row.seo_title) : null,
    seoDescription: row.seo_description ? String(row.seo_description) : null,
    ogImageUrl: row.og_image_url ? String(row.og_image_url) : null,
    tags: normalizeTags(row.tags),
    likeCount: Number(row.like_count ?? 0),
    bookmarkCount: Number(row.bookmark_count ?? 0),
    viewCount: Number(row.view_count ?? row.views ?? 0),
    author: row.author && typeof row.author === "object" ? row.author as BlogPost["author"] : null,
  }
}

export async function getPublishedPosts(options?: { tag?: string; query?: string; limit?: number }) {
  const supabase = await createServerSupabaseClient()

  if (!supabase) {
    return filterDemoPosts(options)
  }

  let query = supabase
    .from("published_posts")
    .select("*")
    .order("published_at", { ascending: false })

  if (options?.limit) {
    query = query.limit(options.limit)
  }

  const { data, error } = await query

  if (error || !data) {
    return filterDemoPosts(options)
  }

  return (data as Record<string, unknown>[]).map(normalizePost).filter((post) => {
    if (options?.tag && !post.tags.some((tag) => tag.slug === options.tag)) return false
    if (options?.query) return matchesSearch(post, options.query)
    return true
  })
}

export async function getPublishedPostBySlug(slug: string) {
  const supabase = await createServerSupabaseClient()

  if (!supabase) {
    return demoPosts.find((post) => post.slug === slug) ?? null
  }

  const { data, error } = await supabase
    .from("published_posts")
    .select("*")
    .eq("slug", slug)
    .maybeSingle()

  if (error || !data) {
    return demoPosts.find((post) => post.slug === slug) ?? null
  }

  return normalizePost(data as Record<string, unknown>)
}

export async function recordPostView(slug: string) {
  const supabase = await createServerSupabaseClient()

  if (!supabase) return

  await supabase.rpc("record_post_view", { post_slug: slug })
}

export async function getTags() {
  const supabase = await createServerSupabaseClient()

  if (!supabase) return demoTags

  const { data, error } = await supabase.from("tags").select("*").order("name")

  if (error || !data) return demoTags

  return (data as Record<string, unknown>[]).map((tag) => ({
    id: String(tag.id),
    name: String(tag.name),
    slug: String(tag.slug),
    description: tag.description ? String(tag.description) : null,
    seoTitle: tag.seo_title ? String(tag.seo_title) : null,
    seoDescription: tag.seo_description ? String(tag.seo_description) : null,
  }))
}

export async function getRssPosts() {
  const supabase = await createServerSupabaseClient()

  if (!supabase) return demoPosts

  const { data, error } = await supabase
    .from("rss_posts")
    .select("*")
    .order("published_at", { ascending: false })

  if (error || !data) return demoPosts

  return (data as Record<string, unknown>[]).map(normalizePost)
}

export async function getSitemapEntries() {
  const supabase = await createServerSupabaseClient()

  if (!supabase) {
    return [
      { loc: absoluteUrl("/", siteConfig.url), lastmod: new Date().toISOString() },
      { loc: absoluteUrl("/blog", siteConfig.url), lastmod: new Date().toISOString() },
      ...demoPosts.map((post) => ({
        loc: absoluteUrl(`/blog/${post.slug}`, siteConfig.url),
        lastmod: post.updatedAt ?? post.publishedAt ?? new Date().toISOString(),
      })),
    ]
  }

  const { data, error } = await supabase.from("sitemap_entries").select("*")

  if (error || !data) return []

  return (data as Record<string, unknown>[]).map((entry) => ({
    loc: String(entry.loc ?? absoluteUrl(String(entry.path ?? "/"), siteConfig.url)),
    lastmod: entry.lastmod ? String(entry.lastmod) : entry.updated_at ? String(entry.updated_at) : undefined,
  }))
}

function filterDemoPosts(options?: { tag?: string; query?: string; limit?: number }) {
  let posts = [...demoPosts]

  if (options?.tag) {
    posts = posts.filter((post) => post.tags.some((tag) => tag.slug === options.tag))
  }

  const searchQuery = options?.query
  if (searchQuery) {
    posts = posts.filter((post) => matchesSearch(post, searchQuery))
  }

  if (options?.limit) {
    posts = posts.slice(0, options.limit)
  }

  return posts
}

function matchesSearch(post: BlogPost, query: string) {
  const needle = query.trim().toLowerCase()
  if (!needle) return true

  return [post.title, post.excerpt, post.content, ...post.tags.map((tag) => tag.name)]
    .filter(Boolean)
    .join(" ")
    .toLowerCase()
    .includes(needle)
}
