import { EmptyState } from "@/components/shared/empty-state"
import { PostCard } from "@/components/public/post-card"
import type { BlogPost } from "@/lib/types"

export function PostList({ posts }: { posts: BlogPost[] }) {
  if (posts.length === 0) {
    return <EmptyState title="No published posts yet" description="When published posts exist in Supabase, they will appear here in reverse chronological order." />
  }

  return (
    <div className="grid gap-4">
      {posts.map((post, index) => (
        <PostCard key={post.id} post={post} featured={index === 0} />
      ))}
    </div>
  )
}
