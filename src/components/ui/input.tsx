
import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-12 w-full rounded-lg border-2 border-border bg-background px-4 py-3 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20 focus-visible:border-primary hover:border-border/80 transition-all duration-200 shadow-sm hover:shadow-md focus-visible:shadow-lg disabled:cursor-not-allowed disabled:opacity-50 md:text-base",
          className
        )}
        style={{ fontSize: '16px', minWidth: 0, maxWidth: '100%', boxSizing: 'border-box' }}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
