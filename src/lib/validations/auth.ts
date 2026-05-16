import { z } from "zod"

export const emailSchema = z.string().trim().email("Enter a valid email address")
export const passwordSchema = z.string().min(8, "Password must be at least 8 characters")

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().optional(),
})

export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  username: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters")
    .max(32, "Username must be 32 characters or fewer")
    .regex(/^[a-z0-9_]+$/, "Use lowercase letters, numbers, and underscores only"),
  displayName: z.string().trim().min(2, "Display name is required").max(80),
})
