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
  const gradientClass = variant === "light-to-dark" ? "bg-gradient-to-b from-background via-background/50 to-muted" : "bg-gradient-to-b from-muted via-background/50 to-background";
  
  return (
    <div 
      className={cn(gradientClass, className)}
      style={{ height: `${height}px`, filter: `blur(${blur}px)` }}
    />
  );
};