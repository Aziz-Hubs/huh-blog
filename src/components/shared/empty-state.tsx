import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

export function EmptyState({
  title,
  description,
  action,
  className,
}: {
  title: string
  description: string
  action?: ReactNode
  className?: string
}) {
  return (
    <div className={cn("rounded-2xl border border-dashed bg-muted/30 p-8 text-center", className)}>
      <div className="mx-auto mb-4 flex size-10 items-center justify-center rounded-full bg-background text-muted-foreground ring-1 ring-border">
        <span aria-hidden="true">...</span>
      </div>
      <h2 className="font-heading text-lg font-medium">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">{description}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  )
}
