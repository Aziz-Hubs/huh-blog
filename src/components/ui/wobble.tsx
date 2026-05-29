"use client"

import React, {
  cloneElement,
  useState,
  type CSSProperties,
  type ReactElement,
} from "react"
import { cn } from "@/lib/utils"

export { __config } from "./wobble.config"

export interface WobbleChildProps {
  onMouseMove?: (event: React.MouseEvent<Element>) => void
  onMouseEnter?: (event: React.MouseEvent<Element>) => void
  onMouseLeave?: (event: React.MouseEvent<Element>) => void
  style?: CSSProperties
  className?: string
  ref?: React.ForwardedRef<HTMLElement>
}

export interface WobbleProps {
  children: ReactElement<WobbleChildProps>
  className?: string
  scale?: number // default 1.01
  off?: boolean // default false
}

interface Position {
  x: number
  y: number
}

const MAX_MOVEMENT_PIXELS = { x: 1, y: 1 } as const

export function Wobble({ children, className, scale = 1.01, off = false }: WobbleProps) {
  const [movement, setMovement] = useState<Position>({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)

  // Escape hatch 1: If explicitly turned off, return unchanged child
  if (off) {
    return children
  }

  const childClassName = children?.props?.className ?? ""

  // Escape hatch 2: If child already has transforms, bypass wobble to avoid layout conflict
  if (/translate/.test(childClassName)) {
    return children
  }

  const handleMouseMove = (event: React.MouseEvent<Element>) => {
    // Execute original handler if present on child
    if (children?.props?.onMouseMove) {
      children.props.onMouseMove(event)
    }

    const rect = event.currentTarget.getBoundingClientRect()
    const offsetX = event.clientX - (rect.left + rect.width / 2)
    const offsetY = event.clientY - (rect.top + rect.height / 2)

    // Normalize offsets between [-1, 1]
    const normalizedX = Math.max(-1, Math.min(1, offsetX / (rect.width / 2)))
    const normalizedY = Math.max(-1, Math.min(1, offsetY / (rect.height / 2)))

    // Map normalized values to maximum pixel displacement
    const x = normalizedX * MAX_MOVEMENT_PIXELS.x
    const y = normalizedY * MAX_MOVEMENT_PIXELS.y

    setMovement({ x, y })
  }

  const handleMouseEnter = (event: React.MouseEvent<Element>) => {
    if (children?.props?.onMouseEnter) {
      children.props.onMouseEnter(event)
    }
    setIsHovering(true)
  }

  const handleMouseLeave = (event: React.MouseEvent<Element>) => {
    if (children?.props?.onMouseLeave) {
      children.props.onMouseLeave(event)
    }
    setIsHovering(false)
    setMovement({ x: 0, y: 0 })
  }

  // Map intent scale to applied inverse scale
  const appliedScale = 1 - (scale - 1)

    // Inline CSS variable bindings with inline transform overrides to ensure 100% robust wobble jiggling on all elements
    const wobbleStyles: CSSProperties = {
      ...children?.props?.style,
      transform: isHovering
        ? `translate(var(--wobble-x, 0px), var(--wobble-y, 0px)) scale(var(--scale, 1))`
        : `translate(0px, 0px) scale(1)`,
      "--wobble-x": isHovering ? `${movement.x}px` : "0px",
      "--wobble-y": isHovering ? `${movement.y}px` : "0px",
      "--scale": `${appliedScale}`,
    } as CSSProperties

    // Tailwind classes mapping transition properties
    const wobbleClasses = cn(
      "transition-all ease-out duration-200",
      className,
      childClassName
    )

  return cloneElement(children, {
    onMouseMove: handleMouseMove,
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    style: wobbleStyles,
    className: wobbleClasses,
  })
}

Wobble.displayName = "Wobble"
