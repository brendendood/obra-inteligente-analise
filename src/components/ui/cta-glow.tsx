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
}

export function CtaGlow({ label, href, onClick, className, ariaLabel }: CtaGlowProps) {
  const content = (
    <span
      className={cn(
        "select-none text-sm font-semibold tracking-tight",
        "text-foreground",
      )}
    >
      {label}
    </span>
  )

  return (
    <GlowingShadow>
      {href ? (
        <Link
          to={href}
          aria-label={ariaLabel ?? label}
          className={cn(
            "inline-flex items-center justify-center rounded-full",
            "bg-background text-foreground",
            "px-5 py-3",
            "ring-1 ring-border hover:ring-primary/60",
            "transition-colors",
            className
          )}
        >
          {content}
        </Link>
      ) : (
        <button
          type="button"
          aria-label={ariaLabel ?? label}
          onClick={onClick}
          className={cn(
            "inline-flex items-center justify-center rounded-full",
            "bg-background text-foreground",
            "px-5 py-3",
            "ring-1 ring-border hover:ring-primary/60",
            "transition-colors",
            className
          )}
        >
          {content}
        </button>
      )}
    </GlowingShadow>
  )
}