
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
      "h-1 w-full transition-all duration-300 ease-out relative",
      isActive ? "bg-blue-500 shadow-lg" : "bg-gray-300",
      className
    )}>
      {isActive && (
        <>
          {/* Linha principal com animação */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full animate-pulse" />
          
          {/* Glow effect */}
          <div className="absolute inset-0 bg-blue-400 rounded-full blur-md opacity-70" />
          
          {/* Pontos nas extremidades com animação */}
          <div className="absolute -left-2 -top-1.5 w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg animate-bounce" />
          <div className="absolute -right-2 -top-1.5 w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg animate-bounce" style={{ animationDelay: '0.1s' }} />
        </>
      )}
    </div>
  );
};
