"use client"

import { Link } from "react-router-dom"
import { GlowingShadow } from "@/components/ui/glowing-shadow"
import { cn } from "@/lib/utils"

type CtaGlowProps = {
  label: string
  href?: string
  onClick?: () => void
  className?: string
  ariaLabel?: string
  size?: "sm" | "md" | "lg"
}

const sizeClasses = {
  sm: "px-3 py-2 text-sm",
  md: "px-4 py-2.5 text-sm",
  lg: "px-5 py-3 text-base",
}

export function CtaGlow({
  label,
  href,
  onClick,
  className,
  ariaLabel,
  size = "md",
}: CtaGlowProps) {
  const contentClasses = cn(
    "inline-flex items-center justify-center rounded-full",
    "bg-background text-foreground",
    "transition-colors",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60",
    sizeClasses[size],
    className
  )

  const content = (
    <span className="select-none font-semibold tracking-tight">{label}</span>
  )

  return (
    <GlowingShadow>
      {href ? (
        <Link to={href} aria-label={ariaLabel ?? label} className={contentClasses}>
          {content}
        </Link>
      ) : (
        <button
          type="button"
          aria-label={ariaLabel ?? label}
          onClick={onClick}
          className={contentClasses}
        >
          {content}
        </button>
      )}
    </GlowingShadow>
  )
}