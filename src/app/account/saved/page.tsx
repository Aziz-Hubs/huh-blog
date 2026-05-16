import type { Metadata } from "next"
import { EmptyState } from "@/components/shared/empty-state"

export const metadata: Metadata = { title: "Saved Posts" }

export default function SavedPostsPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <h1 className="font-heading text-4xl font-semibold tracking-tight">Saved posts</h1>
      <div className="mt-8">
        <EmptyState title="No saved posts yet" description="When you bookmark published posts, they will appear here for your account only." />
      </div>
    </div>
  )
}
