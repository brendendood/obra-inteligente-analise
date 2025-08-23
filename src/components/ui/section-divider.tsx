import { cn } from "@/lib/utils";

interface SectionDividerProps {
  variant?: "light-to-dark" | "dark-to-light";
  from?: string;
  to?: string;
  height?: number;
  blur?: number;
  className?: string;
}

export const SectionDivider = ({ 
  variant = "light-to-dark",
  from,
  to,
  height = 48,
  blur = 12,
  className 
}: SectionDividerProps) => {
  // Use semantic color variants if no specific colors provided
  const gradientClass = variant === "light-to-dark" 
    ? "bg-gradient-to-b from-background via-background/50 to-muted"
    : "bg-gradient-to-b from-muted via-background/50 to-background";

  return (
    <div 
      className={cn(
        "relative w-full overflow-hidden",
        !from && !to && gradientClass,
        className
      )}
      style={{ 
        height,
        ...(from && to && {
          background: `linear-gradient(to bottom, ${from}, ${to})`,
          filter: `blur(${blur}px)`,
          opacity: 0.3
        })
      }}
    >
      {!from && !to && (
        <>
          <div className="absolute inset-0 backdrop-blur-sm" />
          <div 
            className={cn(
              "absolute inset-0 opacity-30",
              variant === "light-to-dark" 
                ? "bg-gradient-to-b from-transparent via-muted/20 to-muted/40"
                : "bg-gradient-to-b from-muted/40 via-muted/20 to-transparent"
            )}
          />
        </>
      )}
    </div>
  );
};