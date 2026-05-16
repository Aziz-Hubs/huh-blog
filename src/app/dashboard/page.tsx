import type { Metadata } from "next"
import { Activity, Clock, FileText, MailWarning, MessageSquare, Send, Sparkles } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getDashboardMetrics, getNotifications } from "@/lib/db/dashboard"
import { timeAgo } from "@/lib/format"

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Owner dashboard overview.",
}

export default async function DashboardPage() {
  const [metrics, notifications] = await Promise.all([getDashboardMetrics(), getNotifications()])
  const cards = [
    { label: "Total posts", value: metrics.totalPosts, icon: FileText },
    { label: "Drafts", value: metrics.drafts, icon: Clock },
    { label: "Scheduled", value: metrics.scheduled, icon: Send },
    { label: "Published", value: metrics.published, icon: Sparkles },
    { label: "Total views", value: metrics.totalViews, icon: Activity },
    { label: "Recent comments", value: metrics.recentComments, icon: MessageSquare },
    { label: "Email failures", value: metrics.failedEmails, icon: MailWarning },
  ]

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm font-medium text-muted-foreground">Situational awareness</p>
        <h1 className="font-heading text-3xl font-semibold tracking-tight">Dashboard overview</h1>
      </header>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <Card key={card.label}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm text-muted-foreground">{card.label}</CardTitle>
              <card.icon className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent><p className="text-3xl font-semibold">{card.value.toLocaleString()}</p></CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader><CardTitle>Recent notifications</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {notifications.length ? notifications.slice(0, 5).map((item) => (
            <div key={item.id} className="rounded-xl border p-4">
              <div className="flex justify-between gap-4">
                <p className="font-medium">{item.title}</p>
                <span className="text-xs text-muted-foreground">{timeAgo(item.createdAt)}</span>
              </div>
              {item.body ? <p className="mt-1 text-sm text-muted-foreground">{item.body}</p> : null}
            </div>
          )) : <p className="text-sm text-muted-foreground">No notifications yet.</p>}
        </CardContent>
      </Card>
    </div>
  )
}
