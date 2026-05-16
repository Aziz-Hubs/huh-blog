import type { Metadata } from "next"
import Link from "next/link"
import { PostsTable } from "@/components/dashboard/posts-table"
import { buttonVariants } from "@/components/ui/button"
import { getOwnerPosts } from "@/lib/db/dashboard"

export const metadata: Metadata = { title: "Posts" }

export default async function DashboardPostsPage() {
  const posts = await getOwnerPosts()

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground">Manage all statuses</p>
          <h1 className="font-heading text-3xl font-semibold tracking-tight">Posts</h1>
        </div>
        <Link href="/dashboard/posts/new" className={buttonVariants()}>New post</Link>
      </div>
      <PostsTable posts={posts} />
    </div>
  )
}
