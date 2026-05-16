import Link from "next/link"
import { Bell, FileText, Image, Inbox, LayoutDashboard, MessageSquare, PenLine, Settings, Tags } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/shared/theme-toggle"
import { cn } from "@/lib/utils"

const nav = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/posts", label: "Posts", icon: FileText },
  { href: "/dashboard/posts/new", label: "New Post", icon: PenLine },
  { href: "/dashboard/tags", label: "Tags", icon: Tags },
  { href: "/dashboard/media", label: "Media", icon: Image },
  { href: "/dashboard/comments", label: "Comments", icon: MessageSquare },
  { href: "/dashboard/notifications", label: "Notifications", icon: Bell },
  { href: "/dashboard/email-outbox", label: "Email Outbox", icon: Inbox },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
]

export function DashboardShell({ children, setupMode = false }: { children: React.ReactNode; setupMode?: boolean }) {
  return (
    <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[240px_1fr]">
      <aside className="h-fit rounded-2xl border bg-card p-3 lg:sticky lg:top-24">
        <div className="mb-3 flex items-center justify-between px-2">
          <div>
            <p className="text-sm font-medium">Owner dashboard</p>
            <p className="text-xs text-muted-foreground">Write and manage</p>
          </div>
          <ThemeToggle />
        </div>
        <nav className="grid gap-1" aria-label="Dashboard navigation">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className={cn("flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground")}> 
              <item.icon className="size-4" /> {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <section className="min-w-0 space-y-6">
        {setupMode ? (
          <Alert>
            <AlertTitle>Supabase setup mode</AlertTitle>
            <AlertDescription>
              Dashboard pages are shown with demo data because Supabase public environment variables are not configured. Once configured, these routes require an authenticated blog owner via <code>is_blog_owner()</code>.
            </AlertDescription>
          </Alert>
        ) : null}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Badge variant="secondary">Owner only</Badge>
        </div>
        {children}
      </section>
    </div>
  )
}
