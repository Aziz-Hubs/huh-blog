import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatDate } from "@/lib/format"
import type { BlogPost } from "@/lib/types"

export function PostsTable({ posts }: { posts: BlogPost[] }) {
  return (
    <div className="overflow-hidden rounded-2xl border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Published</TableHead>
            <TableHead>Views</TableHead>
            <TableHead>Likes</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {posts.map((post) => (
            <TableRow key={post.id}>
              <TableCell className="font-medium">
                <div>{post.title}</div>
                <div className="mt-1 text-xs text-muted-foreground">/{post.slug}</div>
              </TableCell>
              <TableCell><Badge variant={post.status === "published" ? "default" : "secondary"}>{post.status ?? "published"}</Badge></TableCell>
              <TableCell>{formatDate(post.publishedAt)}</TableCell>
              <TableCell>{post.viewCount.toLocaleString()}</TableCell>
              <TableCell>{post.likeCount.toLocaleString()}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button render={<Link href={`/blog/${post.slug}`} />} variant="ghost" size="sm">Preview</Button>
                  <Button render={<Link href={`/dashboard/posts/${post.id}/edit`} />} variant="outline" size="sm">Edit</Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
