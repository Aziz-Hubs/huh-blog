import type { Metadata } from "next"
import Link from "next/link"
import { ShieldBan } from "lucide-react"
import { demoComments } from "@/lib/demo-data"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { timeAgo } from "@/lib/format"

export const metadata: Metadata = { title: "Comments" }

export default function CommentsDashboardPage() {
  const comments = demoComments.flatMap((comment) => [comment, ...comment.replies])

  return (
    <Card>
      <CardHeader><CardTitle>Comments</CardTitle><CardDescription>Observe conversation and ban abusive users if needed.</CardDescription></CardHeader>
      <CardContent>
        <Table>
          <TableHeader><TableRow><TableHead>Author</TableHead><TableHead>Comment</TableHead><TableHead>Age</TableHead><TableHead className="text-right">Action</TableHead></TableRow></TableHeader>
          <TableBody>
            {comments.map((comment) => (
              <TableRow key={comment.id}>
                <TableCell>{comment.author ? <Link href={`/profile/${comment.author.username}`}>{comment.author.displayName}</Link> : "Deleted user"}</TableCell>
                <TableCell className="max-w-xl truncate">{comment.deletedAt ? "[deleted]" : comment.body}</TableCell>
                <TableCell>{timeAgo(comment.createdAt)}</TableCell>
                <TableCell className="text-right"><Button variant="outline" size="sm"><ShieldBan className="size-4" /> Ban</Button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
