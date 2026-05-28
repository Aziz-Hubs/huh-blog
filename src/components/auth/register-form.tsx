"use client"

import { useTransition } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getSupabaseBrowserClient } from "@/lib/supabase/browser"
import { zodFormResolver } from "@/lib/validations/resolver"
import { registerSchema } from "@/lib/validations/auth"
import type { z } from "zod"

type RegisterValues = z.infer<typeof registerSchema>

export function RegisterForm() {
  const supabase = getSupabaseBrowserClient()
  const [isPending, startTransition] = useTransition()
  const form = useForm<RegisterValues>({ resolver: zodFormResolver(registerSchema), defaultValues: { email: "", password: "", username: "", displayName: "" } })

  function submit(values: RegisterValues) {
    startTransition(async () => {
      if (!supabase) {
        toast.info("Add Supabase environment variables to enable registration.")
        return
      }

      const { error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            username: values.username,
            display_name: values.displayName,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        toast.error(error.message)
        return
      }

      toast.success("Account created. Check your email if confirmation is enabled.")
    })
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>Profiles are lightweight identities for comments and replies.</CardDescription>
      </CardHeader>
      <CardContent>
        <form noValidate onSubmit={form.handleSubmit(submit)} className="space-y-4">
          <Field label="Email" id="email" error={form.formState.errors.email?.message}>
            <Input id="email" type="email" autoComplete="email" {...form.register("email")} />
          </Field>
          <Field label="Password" id="password" error={form.formState.errors.password?.message}>
            <Input id="password" type="password" autoComplete="new-password" {...form.register("password")} />
          </Field>
          <Field label="Username" id="username" error={form.formState.errors.username?.message}>
            <Input id="username" autoComplete="username" placeholder="zee" {...form.register("username")} />
          </Field>
          <Field label="Display name" id="displayName" error={form.formState.errors.displayName?.message}>
            <Input id="displayName" placeholder="Zee" {...form.register("displayName")} />
          </Field>
          <Button type="submit" className="w-full" disabled={isPending}>{isPending ? "Creating..." : "Create account"}</Button>
        </form>
      </CardContent>
    </Card>
  )
}

function Field({ label, id, error, children }: { label: string; id: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  )
}
