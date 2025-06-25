
import { cn } from "@/lib/utils";

interface EnhancedSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'card' | 'text' | 'avatar' | 'button';
  lines?: number;
}

function EnhancedSkeleton({
  className,
  variant = 'default',
  lines = 1,
  ...props
}: EnhancedSkeletonProps) {
  if (variant === 'card') {
    return (
      <div className={cn("animate-pulse space-y-4 p-4 border rounded-lg", className)} {...props}>
        <div className="flex items-center space-x-4">
          <div className="rounded-full bg-slate-200 h-10 w-10"></div>
          <div className="space-y-2 flex-1">
            <div className="h-4 bg-slate-200 rounded w-3/4"></div>
            <div className="h-3 bg-slate-200 rounded w-1/2"></div>
          </div>
        </div>
        <div className="space-y-2">
          <div className="h-3 bg-slate-200 rounded"></div>
          <div className="h-3 bg-slate-200 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  if (variant === 'text') {
    return (
      <div className={cn("animate-pulse space-y-2", className)} {...props}>
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "h-4 bg-slate-200 rounded",
              i === lines - 1 ? "w-3/4" : "w-full"
            )}
          />
        ))}
      </div>
    );
  }

  if (variant === 'avatar') {
    return (
      <div
        className={cn("animate-pulse rounded-full bg-slate-200 h-10 w-10", className)}
        {...props}
      />
    );
  }

  if (variant === 'button') {
    return (
      <div
        className={cn("animate-pulse h-10 bg-slate-200 rounded-md", className)}
        {...props}
      />
    );
  }

  return (
    <div
      className={cn("animate-pulse rounded-md bg-slate-200", className)}
      {...props}
    />
  );
}

export { EnhancedSkeleton };
