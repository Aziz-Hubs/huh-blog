"use client"

import type { CSSProperties, ReactNode } from "react"
import { useCallback, useEffect, useState } from "react"
import { cn } from "@/lib/utils"

type BoopProps = {
  children: ReactNode
  className?: string
  x?: number
  y?: number
  rotation?: number
  scale?: number
  timing?: number
}

export function Boop({
  children,
  className,
  x = 0,
  y = -2,
  rotation = 8,
  scale = 1.06,
  timing = 180,
}: BoopProps) {
  const [isBooped, setIsBooped] = useState(false)

  useEffect(() => {
    if (!isBooped) return

    const timeoutId = window.setTimeout(() => setIsBooped(false), timing)
    return () => window.clearTimeout(timeoutId)
  }, [isBooped, timing])

  const trigger = useCallback(() => setIsBooped(true), [])
  const style = {
    "--boop-x": `${x}px`,
    "--boop-y": `${y}px`,
    "--boop-rotation": `${rotation}deg`,
    "--boop-scale": scale,
    "--boop-timing": `${timing}ms`,
  } as CSSProperties

  return (
    <span
      className={cn("boop", className)}
      data-booped={isBooped ? "true" : "false"}
      onFocus={trigger}
      onMouseEnter={trigger}
      onPointerDown={trigger}
      style={style}
    >
      {children}
    </span>
  )
}

export function AnimatedEmoji({
  emoji,
  label,
  className,
  delay = "0ms",
  ...boopProps
}: Omit<BoopProps, "children"> & {
  emoji: string
  label?: string
  delay?: string
}) {
  return (
    <Boop {...boopProps} className={cn("animated-emoji", className)}>
      <span aria-hidden={label ? undefined : true} aria-label={label} role={label ? "img" : undefined} style={{ animationDelay: delay }}>
        {emoji}
      </span>
    </Boop>
  )
}
