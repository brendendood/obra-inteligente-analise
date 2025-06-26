
import { cn } from '@/lib/utils';

interface DropIndicatorProps {
  isVisible?: boolean;
  isActive?: boolean;
  className?: string;
}

export const DropIndicator = ({ 
  isVisible = false, 
  isActive = false, 
  className 
}: DropIndicatorProps) => {
  if (!isVisible) return null;

  return (
    <div
      className={cn(
        "h-1 w-full rounded-full transition-all duration-300 ease-in-out",
        isActive 
          ? "bg-blue-500 shadow-lg shadow-blue-500/50 animate-pulse" 
          : "bg-gray-300",
        className
      )}
    >
      {isActive && (
        <div className="flex items-center justify-center -mt-2">
          <div className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full shadow-lg">
            Soltar aqui
          </div>
        </div>
      )}
    </div>
  );
};
