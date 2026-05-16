import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { siteConfig } from "@/lib/env"

export const metadata: Metadata = { title: "Settings" }

export default function SettingsPage() {
  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
      <Card>
        <CardHeader><CardTitle>Blog settings</CardTitle><CardDescription>Simple identity fields backed by blog_settings.</CardDescription></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2"><Label>Site title</Label><Input defaultValue={siteConfig.name} /></div>
          <div className="space-y-2"><Label>Site description</Label><Textarea defaultValue={siteConfig.description} /></div>
          <Button type="button">Save settings</Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Owner claim</CardTitle><CardDescription>Run once after creating the owner Supabase Auth account.</CardDescription></CardHeader>
        <CardContent>
          <pre className="overflow-x-auto rounded-xl bg-muted p-4 text-xs"><code>{`await supabase.rpc("claim_blog_owner", {\n  p_username: "your_username",\n  p_display_name: "Your Name",\n})`}</code></pre>
          <p className="mt-4 text-sm text-muted-foreground">After this succeeds, dashboard access is verified with is_blog_owner() on every request.</p>
        </CardContent>
      </Card>
    </div>
  )
}
