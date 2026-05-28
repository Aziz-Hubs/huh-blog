"use client"

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { AnimatePresence, motion, useMotionTemplate } from "motion/react"
import { cn } from "@/lib/utils"

interface Position {
  x: number
  y: number
}

interface LensProps {
  children: React.ReactNode
  zoomFactor?: number
  lensSize?: number
  position?: Position
  defaultPosition?: Position
  isStatic?: boolean
  duration?: number
  lensColor?: string
  ariaLabel?: string
  className?: string
}

export function Lens({
  children,
  zoomFactor = 1.24,
  lensSize = 190,
  isStatic = false,
  position = { x: 0, y: 0 },
  defaultPosition,
  duration = 0.16,
  lensColor = "black",
  ariaLabel = "Magnified article text",
  className,
}: LensProps) {
  if (zoomFactor < 1) {
    throw new Error("zoomFactor must be greater than 1")
  }

  if (lensSize < 0) {
    throw new Error("lensSize must be greater than 0")
  }

  const [isHovering, setIsHovering] = useState(false)
  const [mousePosition, setMousePosition] = useState<Position>(position)
  const containerRef = useRef<HTMLDivElement>(null)
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Clear timers on unmount
  useEffect(() => {
    return () => {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current)
      }
    }
  }, [])

  const currentPosition = useMemo(() => {
    if (isStatic) return position
    if (defaultPosition && !isHovering) return defaultPosition
    return mousePosition
  }, [defaultPosition, isHovering, isStatic, mousePosition, position])

  const handleMouseMove = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    // Only show lens when directly hovering text content elements, not empty container margins
    const target = event.target as HTMLElement
    const isOverText = !!target.closest('p, h1, h2, h3, h4, h5, h6, li, pre, code, blockquote, strong, em, a, table')

    if (isOverText) {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current)
        hideTimeoutRef.current = null
      }
      setIsHovering(true)
    } else {
      // Add a small 400ms buffer when moving between lines/gaps to prevent jarring flickering
      if (!hideTimeoutRef.current) {
        hideTimeoutRef.current = setTimeout(() => {
          setIsHovering(false)
          hideTimeoutRef.current = null
        }, 420)
      }
    }

    setMousePosition({ x, y })
  }, [])

  const handleMouseEnter = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement
    const isOverText = !!target.closest('p, h1, h2, h3, h4, h5, h6, li, pre, code, blockquote, strong, em, a, table')
    if (isOverText) {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current)
        hideTimeoutRef.current = null
      }
      setIsHovering(true)
    }
  }, [])

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === "Escape") setIsHovering(false)
  }, [])

  const maskImage = useMotionTemplate`radial-gradient(circle ${
    lensSize / 2
  }px at ${currentPosition.x}px ${
    currentPosition.y
  }px, ${lensColor} 100%, transparent 100%)`

  const lensContent = useMemo(() => {
    const { x, y } = currentPosition

    return (
      <>
        {/* Magnifying lens border and glass glare ring */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration }}
          className="pointer-events-none absolute z-50 rounded-full border border-foreground/15"
          style={{
            width: lensSize,
            height: lensSize,
            left: x - lensSize / 2,
            top: y - lensSize / 2,
            boxShadow: "inset 0 0 12px rgba(0,0,0,0.04), 0 8px 30px rgba(0,0,0,0.08)",
            background: "rgba(255, 255, 255, 0.01)",
            backdropFilter: "blur(0.5px)",
          }}
        />

        {/* Magnified content layer masked to a circle */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration }}
          className="pointer-events-none absolute inset-0 overflow-hidden"
          style={{
            maskImage,
            WebkitMaskImage: maskImage,
            transformOrigin: `${x}px ${y}px`,
            zIndex: 40,
          }}
        >
          <div
            className="absolute inset-0 bg-background"
            style={{
              transform: `scale(${zoomFactor})`,
              transformOrigin: `${x}px ${y}px`,
            }}
          >
            {children}
          </div>
        </motion.div>
      </>
    )
  }, [children, currentPosition, duration, lensSize, maskImage, zoomFactor])

  return (
    <div
      ref={containerRef}
      className={cn("relative overflow-hidden rounded-xl", className)}
      onFocus={(event) => {
        const target = event.target as HTMLElement
        setIsHovering(!!target.closest('p, h1, h2, h3, h4, h5, h6, li, pre, code, blockquote, strong, em, a, table'))
      }}
      onKeyDown={handleKeyDown}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => {
        if (hideTimeoutRef.current) {
          clearTimeout(hideTimeoutRef.current)
          hideTimeoutRef.current = null
        }
        setIsHovering(false)
      }}
      onMouseMove={handleMouseMove}
      role="region"
      aria-label={ariaLabel}
      tabIndex={0}
    >
      {children}
      {isStatic || defaultPosition ? (
        lensContent
      ) : (
        <AnimatePresence mode="popLayout">
          {isHovering && lensContent}
        </AnimatePresence>
      )}
    </div>
  )
}
