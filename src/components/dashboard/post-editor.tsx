/* eslint-disable react-hooks/incompatible-library */
"use client"

import { Eye, Save } from "lucide-react"
import { useTransition } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { ArticleRenderer } from "@/components/public/article-renderer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { getSupabaseBrowserClient } from "@/lib/supabase/browser"
import { zodFormResolver } from "@/lib/validations/resolver"
import type { BlogPost } from "@/lib/types"
import { postEditorSchema, type PostEditorValues } from "@/lib/validations/post"

export function PostEditor({ post }: { post?: BlogPost }) {
  const supabase = getSupabaseBrowserClient()
  const [isPending, startTransition] = useTransition()
  const form = useForm<PostEditorValues>({
    resolver: zodFormResolver(postEditorSchema),
    defaultValues: {
      title: post?.title ?? "",
      excerpt: post?.excerpt ?? "",
      content: post?.content ?? "# Untitled\n\nStart writing...",
      coverImageUrl: post?.coverImageUrl ?? "",
      coverImageAlt: post?.coverImageAlt ?? "",
      status: (post?.status as PostEditorValues["status"]) ?? "draft",
      publishedAt: post?.publishedAt ?? "",
      seoTitle: post?.seoTitle ?? "",
      seoDescription: post?.seoDescription ?? "",
      ogImageUrl: post?.ogImageUrl ?? "",
    },
  })
  const content = form.watch("content")
  const title = form.watch("title")
  const excerpt = form.watch("excerpt")

  function submit(values: PostEditorValues) {
    startTransition(async () => {
      if (values.coverImageUrl && !values.coverImageAlt) {
        toast.error("Cover image alt text is required when using a cover image.")
        return
      }

      if (!supabase) {
        toast.info("Connect Supabase to save posts. The editor preview is fully local for now.")
        return
      }

      const payload = {
        title: values.title,
        excerpt: values.excerpt || null,
        content: values.content,
        cover_image_url: values.coverImageUrl || null,
        cover_image_alt: values.coverImageAlt || null,
        status: values.status,
        published_at: values.publishedAt || null,
        seo_title: values.seoTitle || null,
        seo_description: values.seoDescription || null,
        og_image_url: values.ogImageUrl || null,
      }

      const request = post
        ? supabase.from("posts").update(payload).eq("id", post.id)
        : supabase.from("posts").insert(payload)

      const { error } = await request
      if (error) {
        toast.error(error.message)
        return
      }

      toast.success(post ? "Post updated" : "Draft saved")
    })
  }

  function insertMarkdown(snippet: string) {
    const current = form.getValues("content")
    form.setValue("content", `${current}\n${snippet}`, { shouldDirty: true, shouldValidate: true })
  }

  return (
    <form onSubmit={form.handleSubmit(submit)} className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>{post ? "Edit post" : "New post"}</CardTitle>
            <CardDescription>Write in Markdown, preview live, and let Supabase enforce publishing rules.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Field label="Title" error={form.formState.errors.title?.message}>
              <Input {...form.register("title")} placeholder="A useful title" />
            </Field>
            <Field label="Excerpt" error={form.formState.errors.excerpt?.message}>
              <Textarea {...form.register("excerpt")} placeholder="Short summary for cards and metadata" />
            </Field>
            <div className="flex flex-wrap gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => insertMarkdown("## Heading")}>Heading</Button>
              <Button type="button" variant="outline" size="sm" onClick={() => insertMarkdown("**bold text**")}>Bold</Button>
              <Button type="button" variant="outline" size="sm" onClick={() => insertMarkdown("[link text](https://example.com)")}>Link</Button>
              <Button type="button" variant="outline" size="sm" onClick={() => insertMarkdown("> Quote")}>Quote</Button>
              <Button type="button" variant="outline" size="sm" onClick={() => insertMarkdown("```ts\n// code\n```")}>Code</Button>
              <Button type="button" variant="outline" size="sm" onClick={() => insertMarkdown("![Alt text](https://example.com/image.jpg)")}>Image</Button>
            </div>
            <Field label="Markdown content" error={form.formState.errors.content?.message}>
              <Textarea {...form.register("content")} className="min-h-[440px] font-mono text-sm" />
            </Field>
          </CardContent>
        </Card>
      </div>
      <aside className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Publish controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Field label="Status" error={form.formState.errors.status?.message}>
              <select {...form.register("status")} className="h-9 w-full rounded-lg border bg-background px-3 text-sm">
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="scheduled">Scheduled</option>
                <option value="archived">Archived</option>
              </select>
            </Field>
            <Field label="Publish date/time" error={form.formState.errors.publishedAt?.message}>
              <Input type="datetime-local" {...form.register("publishedAt")} />
            </Field>
            <Button type="submit" className="w-full" disabled={isPending}><Save className="size-4" /> {isPending ? "Saving..." : "Save post"}</Button>
          </CardContent>
        </Card>
        <Tabs defaultValue="preview">
          <TabsList className="w-full">
            <TabsTrigger value="preview" className="flex-1"><Eye className="size-4" /> Preview</TabsTrigger>
            <TabsTrigger value="seo" className="flex-1">SEO</TabsTrigger>
          </TabsList>
          <TabsContent value="preview" className="mt-3 rounded-2xl border bg-card p-5">
            <h2 className="font-heading text-2xl font-semibold">{title || "Untitled"}</h2>
            {excerpt ? <p className="mt-2 text-sm text-muted-foreground">{excerpt}</p> : null}
            <div className="mt-5 max-h-[520px] overflow-y-auto rounded-xl border bg-background p-4">
              <ArticleRenderer content={content} />
            </div>
          </TabsContent>
          <TabsContent value="seo" className="mt-3 space-y-4 rounded-2xl border bg-card p-5">
            <Field label="SEO title" error={form.formState.errors.seoTitle?.message}><Input {...form.register("seoTitle")} /></Field>
            <Field label="SEO description" error={form.formState.errors.seoDescription?.message}><Textarea {...form.register("seoDescription")} /></Field>
            <Field label="Cover image URL" error={form.formState.errors.coverImageUrl?.message}><Input {...form.register("coverImageUrl")} /></Field>
            <Field label="Cover image alt text" error={form.formState.errors.coverImageAlt?.message}><Input {...form.register("coverImageAlt")} /></Field>
            <Field label="Open Graph image" error={form.formState.errors.ogImageUrl?.message}><Input {...form.register("ogImageUrl")} /></Field>
          </TabsContent>
        </Tabs>
      </aside>
    </form>
  )
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  )
}
