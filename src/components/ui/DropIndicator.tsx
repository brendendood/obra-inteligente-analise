
import { cn } from '@/lib/utils';

interface DropIndicatorProps {
  isVisible: boolean;
  isActive: boolean;
  className?: string;
}

export const DropIndicator = ({ isVisible, isActive, className }: DropIndicatorProps) => {
  if (!isVisible) return null;

  return (
    <div className={cn(
      "h-0.5 w-full transition-all duration-200 ease-out",
      isActive ? "bg-blue-500 shadow-lg" : "bg-gray-300",
      "relative",
      className
    )}>
      {isActive && (
        <>
          {/* Linha principal */}
          <div className="absolute inset-0 bg-blue-500 rounded-full" />
          
          {/* Glow effect */}
          <div className="absolute inset-0 bg-blue-400 rounded-full blur-sm opacity-60" />
          
          {/* Pontos nas extremidades */}
          <div className="absolute -left-1 -top-1 w-2 h-2 bg-blue-500 rounded-full" />
          <div className="absolute -right-1 -top-1 w-2 h-2 bg-blue-500 rounded-full" />
        </>
      )}
    </div>
  );
};
