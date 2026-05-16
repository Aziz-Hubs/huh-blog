import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { PostEditor } from "@/components/dashboard/post-editor"
import { getOwnerPosts } from "@/lib/db/dashboard"

export const metadata: Metadata = { title: "Edit Post" }

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const posts = await getOwnerPosts()
  const post = posts.find((item) => item.id === id)

  if (!post) notFound()

  return <PostEditor post={post} />
}
