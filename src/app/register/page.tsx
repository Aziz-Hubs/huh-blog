import type { Metadata } from "next"
import Link from "next/link"
import { RegisterForm } from "@/components/auth/register-form"

export const metadata: Metadata = {
  title: "Register",
  description: "Create a lightweight reader profile.",
}

export default function RegisterPage() {
  return (
    <div className="mx-auto flex min-h-[70dvh] w-full max-w-5xl items-center justify-center px-4 py-12 sm:px-6">
      <div className="w-full max-w-md">
        <RegisterForm />
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account? <Link href="/login" className="font-medium text-primary hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
