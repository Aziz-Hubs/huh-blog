import type { Metadata } from "next"
import { Copy, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export const metadata: Metadata = { title: "Media" }

export default function MediaPage() {
  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
      <Card>
        <CardHeader><CardTitle>Recent media</CardTitle><CardDescription>Blog media is public and stored in the blog-media bucket.</CardDescription></CardHeader>
        <CardContent>
          <div className="rounded-2xl border border-dashed p-8 text-center text-sm text-muted-foreground">Uploaded media will appear here with copyable public URLs.</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Upload asset</CardTitle><CardDescription>Recommended path: posts/{"{post_id}"}/{"{filename}"}</CardDescription></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2"><Label>File</Label><Input type="file" accept="image/*" /></div>
          <Button type="button" className="w-full"><Upload className="size-4" /> Upload</Button>
          <Button type="button" variant="outline" className="w-full"><Copy className="size-4" /> Copy selected URL</Button>
        </CardContent>
      </Card>
    </div>
  )
}
