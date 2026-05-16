"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Github, Mail } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { useTransition } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { getSupabaseBrowserClient } from "@/lib/supabase/browser"
import { loginSchema } from "@/lib/validations/auth"
import type { z } from "zod"

type LoginValues = z.infer<typeof loginSchema>

export function LoginForm() {
  const supabase = getSupabaseBrowserClient()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get("redirectTo") ?? "/dashboard"
  const [isPending, startTransition] = useTransition()
  const form = useForm<LoginValues>({ resolver: zodResolver(loginSchema), defaultValues: { email: "", password: "" } })

  function signInWithPassword(values: LoginValues) {
    startTransition(async () => {
      if (!supabase) {
        toast.info("Add Supabase environment variables to enable sign in.")
        return
      }

      if (!values.password) {
        toast.error("Enter your password or use a magic link.")
        return
      }

      const { error } = await supabase.auth.signInWithPassword({ email: values.email, password: values.password })
      if (error) {
        toast.error(error.message)
        return
      }

      window.location.href = redirectTo
    })
  }

  function sendMagicLink() {
    const email = form.getValues("email")
    startTransition(async () => {
      if (!supabase) {
        toast.info("Add Supabase environment variables to enable magic links.")
        return
      }

      const parsed = loginSchema.pick({ email: true }).safeParse({ email })
      if (!parsed.success) {
        toast.error("Enter a valid email first.")
        return
      }

      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback?redirectTo=${encodeURIComponent(redirectTo)}` },
      })

      if (error) {
        toast.error(error.message)
        return
      }

      toast.success("Magic link sent")
    })
  }

  function oauth(provider: "github" | "google") {
    startTransition(async () => {
      if (!supabase) {
        toast.info("Add Supabase environment variables to enable OAuth.")
        return
      }

      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo: `${window.location.origin}/auth/callback?redirectTo=${encodeURIComponent(redirectTo)}` },
      })

      if (error) toast.error(error.message)
    })
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Sign in</CardTitle>
        <CardDescription>Use email/password, magic link, or an enabled OAuth provider.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(signInWithPassword)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" autoComplete="email" {...form.register("email")} />
            {form.formState.errors.email ? <p className="text-sm text-destructive">{form.formState.errors.email.message}</p> : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" autoComplete="current-password" {...form.register("password")} />
          </div>
          <Button type="submit" className="w-full" disabled={isPending}>{isPending ? "Signing in..." : "Sign in"}</Button>
        </form>
        <Button type="button" variant="ghost" className="mt-3 w-full" onClick={sendMagicLink} disabled={isPending}>
          <Mail className="size-4" /> Send magic link
        </Button>
        <Separator className="my-5" />
        <div className="grid gap-2 sm:grid-cols-2">
          <Button type="button" variant="outline" onClick={() => oauth("github")} disabled={isPending}><Github className="size-4" /> GitHub</Button>
          <Button type="button" variant="outline" onClick={() => oauth("google")} disabled={isPending}>Google</Button>
        </div>
      </CardContent>
    </Card>
  )
}
