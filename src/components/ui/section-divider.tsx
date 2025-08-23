import { cn } from "@/lib/utils";

interface SectionDividerProps {
  variant?: "light-to-dark" | "dark-to-light";
  className?: string;
}

export const SectionDivider = ({ 
  variant = "light-to-dark", 
  className 
}: SectionDividerProps) => {
  const gradientClass = variant === "light-to-dark" 
    ? "bg-gradient-to-b from-background via-background/50 to-background-dark"
    : "bg-gradient-to-b from-background-dark via-background-dark/50 to-background";

  return (
    <div 
      className={cn(
        "relative h-32 w-full overflow-hidden",
        gradientClass,
        className
      )}
    >
      <div className="absolute inset-0 backdrop-blur-sm" />
      <div 
        className={cn(
          "absolute inset-0 opacity-30",
          variant === "light-to-dark" 
            ? "bg-gradient-to-b from-transparent via-muted/20 to-muted-dark/40"
            : "bg-gradient-to-b from-muted-dark/40 via-muted/20 to-transparent"
        )}
      />
    </div>
  );
};