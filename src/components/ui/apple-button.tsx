import { cn } from "@/lib/utils"
import { ElementType, ComponentPropsWithoutRef } from "react"

interface AppleButtonProps<T extends ElementType> {
  as?: T
  variant?: "primary" | "secondary" | "ghost"
  size?: "sm" | "md" | "lg"
  className?: string
  children: React.ReactNode
}

export function AppleButton<T extends ElementType = "button">({
  as,
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: AppleButtonProps<T> & Omit<ComponentPropsWithoutRef<T>, keyof AppleButtonProps<T>>) {
  const Component = as || "button"

  const baseClasses = [
    "inline-flex items-center justify-center gap-2",
    "font-medium rounded-xl transition-all duration-300 ease-out",
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
    "disabled:opacity-50 disabled:pointer-events-none",
    "transform hover:scale-[1.02] active:scale-[0.98]",
    "shadow-sm hover:shadow-md active:shadow-sm"
  ]

  const variantClasses = {
    primary: [
      "bg-primary text-primary-foreground",
      "hover:bg-primary/90",
      "border border-primary/20"
    ],
    secondary: [
      "bg-secondary text-secondary-foreground",
      "hover:bg-secondary/80",
      "border border-border"
    ],
    ghost: [
      "bg-background/50 text-foreground",
      "hover:bg-accent hover:text-accent-foreground",
      "border border-border/50 hover:border-border"
    ]
  }

  const sizeClasses = {
    sm: "px-4 py-2 text-sm h-9",
    md: "px-6 py-3 text-base h-11",
    lg: "px-8 py-4 text-lg h-12"
  }

  return (
    <Component
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </Component>
  )
}