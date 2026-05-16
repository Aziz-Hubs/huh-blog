import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { getTags } from "@/lib/db/posts"

export const metadata: Metadata = { title: "Tag Manager" }

export default async function DashboardTagsPage() {
  const tags = await getTags()

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
      <Card>
        <CardHeader><CardTitle>Tags</CardTitle><CardDescription>Maintain the lightweight taxonomy attached to posts.</CardDescription></CardHeader>
        <CardContent className="grid gap-3">
          {tags.map((tag) => <div key={tag.slug} className="rounded-xl border p-4"><p className="font-medium">{tag.name}</p><p className="text-sm text-muted-foreground">/{tag.slug}</p><p className="mt-2 text-sm text-muted-foreground">{tag.description}</p></div>)}
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Create tag</CardTitle><CardDescription>Slug generation is left to the database.</CardDescription></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2"><Label>Name</Label><Input placeholder="Supabase" /></div>
          <div className="space-y-2"><Label>Description</Label><Textarea placeholder="What this tag covers" /></div>
          <div className="space-y-2"><Label>SEO title</Label><Input /></div>
          <div className="space-y-2"><Label>SEO description</Label><Textarea /></div>
          <Button type="button">Save tag</Button>
        </CardContent>
      </Card>
    </div>
  )
}
