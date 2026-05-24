import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default async function Home() {
  const supabase = await createClient()

  let connectionStatus = "unknown"
  let blogSettings = null

  try {
    const { data, error } = await supabase
      .from("blog_settings")
      .select("*")
      .limit(1)
      .maybeSingle()

    if (error) {
      connectionStatus = "error"
    } else {
      connectionStatus = "connected"
      blogSettings = data
    }
  } catch {
    connectionStatus = "error"
  }

  const siteName = blogSettings?.site_title ?? "Huh Blog"
  const siteDescription =
    blogSettings?.site_description ??
    "A calm, minimal blog for publishing technical notes, personal writing, and general thoughts."

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <main className="w-full max-w-2xl space-y-8 py-16 text-center">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">{siteName}</h1>
          <p className="text-lg text-muted-foreground">{siteDescription}</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Environment Status</CardTitle>
            <CardDescription>Development environment health check</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Supabase Connection</span>
              <Badge variant={connectionStatus === "connected" ? "default" : "destructive"}>
                {connectionStatus}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Next.js</span>
              <Badge variant="default">running</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">ShadCN UI</span>
              <Badge variant="default">installed</Badge>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-center gap-4">
          <Button variant="default">Get Started</Button>
          <Button variant="outline">Learn More</Button>
        </div>
      </main>
    </div>
  )
}
