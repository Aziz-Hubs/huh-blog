import type { Metadata } from "next"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getOwnerPosts } from "@/lib/db/dashboard"
import { formatDateTime } from "@/lib/format"

export const metadata: Metadata = { title: "Revisions" }

export default async function RevisionsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const post = (await getOwnerPosts()).find((item) => item.id === id)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Revision history{post ? `: ${post.title}` : ""}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader><TableRow><TableHead>Revision</TableHead><TableHead>Status</TableHead><TableHead>Created</TableHead><TableHead>Title</TableHead></TableRow></TableHeader>
          <TableBody>
            <TableRow><TableCell>Current</TableCell><TableCell>{post?.status ?? "draft"}</TableCell><TableCell>{formatDateTime(post?.updatedAt)}</TableCell><TableCell>{post?.title ?? "Unknown post"}</TableCell></TableRow>
          </TableBody>
        </Table>
        <p className="mt-4 text-sm text-muted-foreground">When connected to Supabase, this route can read from post_revisions for prior saved versions.</p>
      </CardContent>
    </Card>
  )
}
