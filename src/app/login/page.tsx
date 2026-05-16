import { Suspense } from "react"
import type { Metadata } from "next"
import Link from "next/link"
import { LoginForm } from "@/components/auth/login-form"

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to comment, save posts, and access the owner dashboard.",
}

export default function LoginPage() {
  return (
    <div className="mx-auto flex min-h-[70dvh] w-full max-w-5xl items-center justify-center px-4 py-12 sm:px-6">
      <div className="w-full max-w-md">
        <Suspense fallback={<div className="rounded-2xl border p-6 text-sm text-muted-foreground">Loading sign in...</div>}><LoginForm /></Suspense>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          New here? <Link href="/register" className="font-medium text-primary hover:underline">Create an account</Link>
        </p>
      </div>
    </div>
  )
}
