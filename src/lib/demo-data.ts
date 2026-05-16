import type { BlogComment, BlogPost, BlogTag, DashboardMetrics, EmailOutboxItem, NotificationItem, PublicProfile } from "@/lib/types"

export const demoAuthor: PublicProfile = {
  id: "demo-owner",
  username: "aziz",
  displayName: "Aziz",
  avatarUrl: null,
  bio: "Writing technical notes, personal essays, and quiet observations from the edge of software work.",
  websiteUrl: "https://example.com",
  isOwner: true,
}

export const demoTags: BlogTag[] = [
  { id: "1", name: "Supabase", slug: "supabase", description: "Database, auth, storage, and edge patterns.", isPrimary: true },
  { id: "2", name: "Next.js", slug: "nextjs", description: "App Router notes and interface architecture." },
  { id: "3", name: "Writing", slug: "writing", description: "Personal reflections on writing and making." },
]

export const demoPosts: BlogPost[] = [
  {
    id: "post-1",
    title: "Building software that still feels personal",
    slug: "building-software-that-still-feels-personal",
    excerpt: "A small note on keeping systems useful, humane, and quiet even when they gain powerful capabilities.",
    content: `# Building software that still feels personal

The best tools I use do not keep announcing themselves. They make room for thought, then get out of the way.

This blog is built around that same constraint: publishing should be direct, reading should be calm, and community should stay lightweight.

## A working shape

- Posts are Markdown.
- Comments are available, but not turned into a feed.
- Search, RSS, and metadata are treated as durable infrastructure.

> A personal site can be complete without becoming a product dashboard.

\`quiet defaults\` are a feature, not a lack of ambition.

\`\`\`ts
export function publish(note: Draft) {
  return note.status === "ready" ? "published" : "draft"
}
\`\`\`
`,
    coverImageUrl: null,
    coverImageAlt: "Abstract desk with notebook and laptop in soft morning light",
    coverImageCaption: null,
    publishedAt: new Date("2026-05-12T12:00:00Z").toISOString(),
    updatedAt: new Date("2026-05-14T18:00:00Z").toISOString(),
    status: "published",
    seoTitle: "Building software that still feels personal",
    seoDescription: "A calm note on building personal publishing software with modern infrastructure.",
    ogImageUrl: null,
    tags: [demoTags[2], demoTags[1]],
    likeCount: 14,
    bookmarkCount: 4,
    viewCount: 428,
    author: demoAuthor,
  },
  {
    id: "post-2",
    title: "Supabase as the quiet backend for a one-person blog",
    slug: "supabase-as-the-quiet-backend",
    excerpt: "Using database rules, views, storage, and RPCs as the product boundary instead of inventing a second content model.",
    content: `# Supabase as the quiet backend

The database already knows most of the product rules. The app should respect that and avoid a parallel model.

| Layer | Responsibility |
| --- | --- |
| RLS | Authorization |
| Views | Public read models |
| RPCs | Intentful operations |
| App | Experience and validation |

That separation keeps the interface light while preserving safety.
`,
    coverImageUrl: null,
    coverImageAlt: "Layered architecture sketch on paper",
    coverImageCaption: null,
    publishedAt: new Date("2026-05-08T09:30:00Z").toISOString(),
    updatedAt: new Date("2026-05-08T09:30:00Z").toISOString(),
    status: "published",
    seoTitle: null,
    seoDescription: null,
    ogImageUrl: null,
    tags: [demoTags[0], demoTags[1]],
    likeCount: 22,
    bookmarkCount: 7,
    viewCount: 691,
    author: demoAuthor,
  },
]

export const demoComments: BlogComment[] = [
  {
    id: "comment-1",
    postId: "post-1",
    parentId: null,
    body: "This is exactly the kind of publishing tool I keep wanting: capable, but not loud.",
    createdAt: new Date("2026-05-13T15:12:00Z").toISOString(),
    updatedAt: null,
    deletedAt: null,
    likeCount: 3,
    author: {
      username: "reader",
      displayName: "Thoughtful Reader",
      avatarUrl: null,
      bio: "Reads slowly.",
      websiteUrl: null,
    },
    replies: [
      {
        id: "comment-2",
        postId: "post-1",
        parentId: "comment-1",
        body: "Same. The line between a blog and a dashboard gets blurry quickly.",
        createdAt: new Date("2026-05-13T16:01:00Z").toISOString(),
        updatedAt: null,
        deletedAt: null,
        likeCount: 1,
        author: demoAuthor,
        replies: [],
      },
    ],
  },
]

export const demoMetrics: DashboardMetrics = {
  totalPosts: 8,
  drafts: 2,
  scheduled: 1,
  published: 5,
  totalViews: 2458,
  recentComments: 4,
  failedEmails: 1,
}

export const demoNotifications: NotificationItem[] = [
  {
    id: "notification-1",
    type: "comment_reply",
    title: "New reply on your post",
    body: "A reader replied to Building software that still feels personal.",
    readAt: null,
    createdAt: new Date("2026-05-15T10:00:00Z").toISOString(),
    href: "/blog/building-software-that-still-feels-personal#comments",
  },
]

export const demoEmailOutbox: EmailOutboxItem[] = [
  {
    id: "email-1",
    to: "reader@example.com",
    subject: "New reply on Huh",
    status: "failed",
    attempts: 2,
    lastError: "Demo failure state for dashboard visibility",
    createdAt: new Date("2026-05-15T10:01:00Z").toISOString(),
    sentAt: null,
  },
]
