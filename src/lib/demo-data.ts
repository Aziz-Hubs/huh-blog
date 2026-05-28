import type { BlogComment, BlogPost, BlogTag, DashboardMetrics, EmailOutboxItem, NotificationItem, PublicProfile } from "@/lib/types"

export const demoAuthor: PublicProfile = {
  id: "demo-owner",
  username: "zee",
  displayName: "Zee",
  avatarUrl: null,
  bio: "Programmer, security tinkerer, AI watcher, and certified opener of too many tabs before doing the obvious thing.",
  websiteUrl: "https://example.com",
  isOwner: true,
}

export const demoTags: BlogTag[] = [
  { id: "1", name: "Programming", slug: "programming", description: "Code notes, architecture detours, and bugs that waited patiently.", isPrimary: true },
  { id: "2", name: "Cybersecurity", slug: "cybersecurity", description: "Threat models, defensive habits, and security notes without the movie soundtrack." },
  { id: "3", name: "AI", slug: "ai", description: "Practical AI experiments, tooling, agents, and careful skepticism." },
]

export const demoPosts: BlogPost[] = [
  {
    id: "post-1",
    title: "I automated the task I was avoiding",
    slug: "i-automated-the-task-i-was-avoiding",
    excerpt: "A programming note about turning procrastination into a small script, then pretending that was the plan all along.",
    content: `# I automated the task I was avoiding

There are two ways to finish a boring task: do it immediately, or spend slightly too long building a tool that does it for you.

I will not be taking questions about which path I chose.

## The useful part

The trick is to keep the detour honest. If the automation is smaller than the dread, ship it. If the automation becomes a second job, close the tab and do the thing manually like a citizen.

- Name the repetitive step.
- Script only the sharp edge.
- Leave a README for future Zee, who will absolutely forget.

> Procrastination is dangerous. Procrastination with tests is sometimes infrastructure.

\`todo-later.ts\` is not a personality, but it does compile.

\`\`\`ts
export function shouldAutomate(minutesSaved: number, minutesToBuild: number) {
  return minutesSaved * 3 > minutesToBuild ? "ship the tiny robot" : "do the task"
}
\`\`\`
`,
    coverImageUrl: null,
    coverImageAlt: "A laptop with a terminal open beside a suspiciously untouched task list",
    coverImageCaption: null,
    publishedAt: new Date("2026-05-12T12:00:00Z").toISOString(),
    updatedAt: new Date("2026-05-14T18:00:00Z").toISOString(),
    status: "published",
    seoTitle: "I automated the task I was avoiding",
    seoDescription: "Zee writes about programming, procrastination, and the tiny scripts that make both less embarrassing.",
    ogImageUrl: null,
    tags: [demoTags[0], demoTags[2]],
    likeCount: 18,
    bookmarkCount: 6,
    viewCount: 512,
    author: demoAuthor,
  },
  {
    id: "post-2",
    title: "Threat modeling my own bad habits",
    slug: "threat-modeling-my-own-bad-habits",
    excerpt: "A cybersecurity reflection on treating distraction, stale dependencies, and future-me as realistic adversaries.",
    content: `# Threat modeling my own bad habits

Security gets easier when I admit the attacker is not always a hoodie in a dark room. Sometimes the attacker is me, tired, overconfident, and saying, "I'll patch that after lunch."

Lunch has done a lot of damage in this industry.

| Risk | Control |
| --- | --- |
| Stale dependencies | Scheduled updates, not vibes |
| Secret sprawl | Environment boundaries and reviews |
| Tired deploys | Checklists with fewer heroic assumptions |
| Future me | Comments that explain the weird parts |

The goal is not paranoia. The goal is fewer avoidable surprises.
`,
    coverImageUrl: null,
    coverImageAlt: "A quiet desk with a checklist, lock icon sketch, and coffee cup",
    coverImageCaption: null,
    publishedAt: new Date("2026-05-08T09:30:00Z").toISOString(),
    updatedAt: new Date("2026-05-08T09:30:00Z").toISOString(),
    status: "published",
    seoTitle: "Threat modeling my own bad habits",
    seoDescription: "A cybersecurity note from Zee about defensive habits and procrastination as an attack surface.",
    ogImageUrl: null,
    tags: [demoTags[1], demoTags[0]],
    likeCount: 26,
    bookmarkCount: 9,
    viewCount: 734,
    author: demoAuthor,
  },
  {
    id: "post-3",
    title: "AI agents and the art of supervised laziness",
    slug: "ai-agents-and-supervised-laziness",
    excerpt: "A practical AI note on using agents like interns with root access denied and receipts required.",
    content: `# AI agents and the art of supervised laziness

I like AI tools most when they make me more deliberate, not when they let me disappear from the work entirely.

An agent is useful when it can gather context, draft options, run checks, and show its receipts. It is less useful when it confidently invents a database table and then looks at me like I asked for drama.

## My current rules

1. Give the agent a narrow job.
2. Ask for evidence, not enthusiasm.
3. Keep secrets out of the prompt.
4. Review the diff like it was written at 1:47 AM, because spiritually it was.

AI can save time. It can also create a brand-new kind of chore. I am choosing the first one whenever possible.
`,
    coverImageUrl: null,
    coverImageAlt: "A small robot sticker next to a code review checklist",
    coverImageCaption: null,
    publishedAt: new Date("2026-05-03T14:15:00Z").toISOString(),
    updatedAt: new Date("2026-05-04T10:00:00Z").toISOString(),
    status: "published",
    seoTitle: "AI agents and supervised laziness",
    seoDescription: "Zee writes about practical AI agents, code review, and productive procrastination.",
    ogImageUrl: null,
    tags: [demoTags[2], demoTags[0]],
    likeCount: 31,
    bookmarkCount: 12,
    viewCount: 901,
    author: demoAuthor,
  },
]

export const demoComments: BlogComment[] = [
  {
    id: "comment-1",
    postId: "post-1",
    parentId: null,
    body: "I came for programming notes and stayed because 'ship the tiny robot' is now my sprint strategy.",
    createdAt: new Date("2026-05-13T15:12:00Z").toISOString(),
    updatedAt: null,
    deletedAt: null,
    likeCount: 3,
    author: {
      username: "reader",
      displayName: "Reasonable Reader",
      avatarUrl: null,
      bio: "Reads the docs eventually.",
      websiteUrl: null,
    },
    replies: [
      {
        id: "comment-2",
        postId: "post-1",
        parentId: "comment-1",
        body: "A tiny robot with tests is basically project management, if you squint.",
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
  totalPosts: 9,
  drafts: 3,
  scheduled: 1,
  published: 5,
  totalViews: 3147,
  recentComments: 4,
  failedEmails: 1,
}

export const demoNotifications: NotificationItem[] = [
  {
    id: "notification-1",
    type: "comment_reply",
    title: "New reply on your post",
    body: "A reader replied to I automated the task I was avoiding.",
    readAt: null,
    createdAt: new Date("2026-05-15T10:00:00Z").toISOString(),
    href: "/blog/i-automated-the-task-i-was-avoiding#comments",
  },
]

export const demoEmailOutbox: EmailOutboxItem[] = [
  {
    id: "email-1",
    to: "reader@example.com",
    subject: "New reply on Zee",
    status: "failed",
    attempts: 2,
    lastError: "Demo failure state for dashboard visibility",
    createdAt: new Date("2026-05-15T10:01:00Z").toISOString(),
    sentAt: null,
  },
]
