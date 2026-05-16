import type { Metadata } from "next"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getEmailOutbox } from "@/lib/db/dashboard"
import { formatDateTime } from "@/lib/format"

export const metadata: Metadata = { title: "Email Outbox" }

export default async function EmailOutboxPage() {
  const rows = await getEmailOutbox()

  return (
    <Card>
      <CardHeader><CardTitle>Email outbox</CardTitle><CardDescription>Inspect pending, sent, and failed Resend notification emails without exposing API keys.</CardDescription></CardHeader>
      <CardContent>
        <Table>
          <TableHeader><TableRow><TableHead>Recipient</TableHead><TableHead>Subject</TableHead><TableHead>Status</TableHead><TableHead>Attempts</TableHead><TableHead>Created</TableHead><TableHead className="text-right">Action</TableHead></TableRow></TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.to}</TableCell>
                <TableCell>{row.subject}<div className="text-xs text-muted-foreground">{row.lastError}</div></TableCell>
                <TableCell><Badge variant={row.status === "failed" ? "destructive" : "secondary"}>{row.status}</Badge></TableCell>
                <TableCell>{row.attempts}</TableCell>
                <TableCell>{formatDateTime(row.createdAt)}</TableCell>
                <TableCell className="text-right"><Button variant="outline" size="sm">Retry</Button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
