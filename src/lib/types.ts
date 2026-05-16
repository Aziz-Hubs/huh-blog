export type BlogTag = {
  id?: string
  name: string
  slug: string
  description?: string | null
  seoTitle?: string | null
  seoDescription?: string | null
  isPrimary?: boolean
}

export type BlogPost = {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string
  coverImageUrl: string | null
  coverImageAlt: string | null
  coverImageCaption?: string | null
  publishedAt: string | null
  updatedAt: string | null
  status?: "draft" | "scheduled" | "published" | "archived" | string
  seoTitle?: string | null
  seoDescription?: string | null
  ogImageUrl?: string | null
  tags: BlogTag[]
  likeCount: number
  bookmarkCount?: number
  viewCount: number
  author?: PublicProfile | null
}

export type PublicProfile = {
  id?: string
  username: string
  displayName: string
  avatarUrl: string | null
  bio: string | null
  websiteUrl: string | null
  isOwner?: boolean
}

export type BlogComment = {
  id: string
  postId: string
  parentId: string | null
  body: string
  createdAt: string
  updatedAt: string | null
  deletedAt: string | null
  likeCount: number
  author: PublicProfile | null
  replies: BlogComment[]
}

export type DashboardMetrics = {
  totalPosts: number
  drafts: number
  scheduled: number
  published: number
  totalViews: number
  recentComments: number
  failedEmails: number
}

export type NotificationItem = {
  id: string
  type: string
  title: string
  body: string | null
  readAt: string | null
  createdAt: string
  href?: string | null
}

export type EmailOutboxItem = {
  id: string
  to: string
  subject: string
  status: string
  attempts: number
  lastError: string | null
  createdAt: string
  sentAt: string | null
}
