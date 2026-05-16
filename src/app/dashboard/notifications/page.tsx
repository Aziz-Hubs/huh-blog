import type { Metadata } from "next"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getNotifications } from "@/lib/db/dashboard"
import { timeAgo } from "@/lib/format"

export const metadata: Metadata = { title: "Notifications" }

export default async function NotificationsPage() {
  const notifications = await getNotifications()

  return (
    <Card>
      <CardHeader><CardTitle>Notifications</CardTitle><CardDescription>Replies, mentions, comment likes, and owner activity.</CardDescription></CardHeader>
      <CardContent className="space-y-3">
        {notifications.length ? notifications.map((item) => (
          <div key={item.id} className="rounded-xl border p-4">
            <div className="flex flex-wrap items-center justify-between gap-3"><p className="font-medium">{item.title}</p><Badge variant={item.readAt ? "secondary" : "default"}>{item.readAt ? "Read" : "Unread"}</Badge></div>
            {item.body ? <p className="mt-2 text-sm text-muted-foreground">{item.body}</p> : null}
            <p className="mt-2 text-xs text-muted-foreground">{timeAgo(item.createdAt)}</p>
          </div>
        )) : <p className="text-sm text-muted-foreground">No notifications yet.</p>}
      </CardContent>
    </Card>
  )
}
