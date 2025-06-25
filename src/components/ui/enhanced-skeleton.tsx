
import { cn } from "@/lib/utils";

interface EnhancedSkeletonProps {
  className?: string;
  variant?: 'default' | 'card' | 'text' | 'circular';
}

export const EnhancedSkeleton = ({ 
  className,
  variant = 'default'
}: EnhancedSkeletonProps) => {
  const baseClasses = "animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%]";
  
  const variantClasses = {
    default: "h-4 w-full rounded",
    card: "h-24 w-full rounded-xl",
    text: "h-4 w-3/4 rounded",
    circular: "h-12 w-12 rounded-full"
  };

  return (
    <div
      className={cn(
        baseClasses,
        variantClasses[variant],
        className
      )}
      style={{
        animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite, shimmer 2s linear infinite'
      }}
    />
  );
};
