import { redirect } from "next/navigation"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { buttonVariants } from "@/components/ui/button"
import { getDashboardAccess } from "@/lib/db/dashboard"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const access = await getDashboardAccess()

  if (access.state === "anonymous") {
    redirect("/login?redirectTo=/dashboard")
  }

  if (access.state === "forbidden") {
    return (
      <div className="mx-auto flex min-h-[70dvh] max-w-xl items-center px-4 py-12">
        <Alert variant="destructive">
          <AlertTitle>Not authorized</AlertTitle>
          <AlertDescription>
            This dashboard is only available to the claimed blog owner. Use the owner claim RPC after signing in, then return here.
            <a href="/" className={`${buttonVariants({ variant: "outline" })} mt-5`}>Back home</a>
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return <DashboardShell setupMode={access.state === "setup"}>{children}</DashboardShell>
}
