"use client"

import React, { forwardRef } from "react"
import { ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

export type InteractiveHoverButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>

export const InteractiveHoverButton = forwardRef<
  HTMLButtonElement,
  InteractiveHoverButtonProps
>(({ children, className, disabled, ...props }, ref) => {
  return (
    <button
      ref={ref}
      disabled={disabled}
      className={cn(
        "group bg-background relative w-auto cursor-pointer overflow-hidden rounded-full border p-2 px-6 text-center font-semibold transition-all select-none",
        "disabled:pointer-events-none disabled:opacity-50",
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-center gap-2">
        {/* Hover expanding circle */}
        <div
          className={cn(
            "bg-primary h-2 w-2 rounded-full transition-all duration-300",
            !disabled && "group-hover:scale-[100.8]"
          )}
        />
        <span
          className={cn(
            "inline-block transition-all duration-300",
            !disabled && "group-hover:translate-x-12 group-hover:opacity-0"
          )}
        >
          {children}
        </span>
      </div>
      <div
        className={cn(
          "text-primary-foreground absolute top-0 left-0 z-10 flex h-full w-full items-center justify-center gap-2 opacity-0 transition-all duration-300",
          !disabled && "translate-x-12 group-hover:translate-x-0 group-hover:opacity-100"
        )}
      >
        <span>{children}</span>
        <ArrowRight className="size-4" />
      </div>
    </button>
  )
})

InteractiveHoverButton.displayName = "InteractiveHoverButton"
