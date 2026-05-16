import { z } from "zod"

export const postEditorSchema = z.object({
  title: z.string().trim().min(3, "Title is required").max(180),
  excerpt: z.string().trim().max(320).optional(),
  content: z.string().trim().min(1, "Post content is required"),
  coverImageUrl: z.string().trim().url("Use a valid URL").optional().or(z.literal("")),
  coverImageAlt: z.string().trim().max(180).optional(),
  status: z.enum(["draft", "published", "scheduled", "archived"]),
  publishedAt: z.string().optional(),
  seoTitle: z.string().trim().max(180).optional(),
  seoDescription: z.string().trim().max(320).optional(),
  ogImageUrl: z.string().trim().url("Use a valid URL").optional().or(z.literal("")),
})

export type PostEditorValues = z.infer<typeof postEditorSchema>
