
import { cn } from '@/lib/utils';
import { CheckCircle, XCircle } from 'lucide-react';

interface DropIndicatorProps {
  isVisible?: boolean;
  isActive?: boolean;
  isValid?: boolean;
  className?: string;
}

export const DropIndicator = ({ 
  isVisible = false, 
  isActive = false, 
  isValid = true,
  className 
}: DropIndicatorProps) => {
  if (!isVisible) return null;

  return (
    <div
      className={cn(
        "h-1 w-full rounded-full transition-all duration-300 ease-in-out relative",
        isActive && isValid
          ? "bg-blue-500 shadow-lg shadow-blue-500/50 animate-pulse" 
          : isActive && !isValid
          ? "bg-red-500 shadow-lg shadow-red-500/50 animate-pulse"
          : "bg-gray-300",
        className
      )}
    >
      {isActive && (
        <div className="flex items-center justify-center absolute -top-8 left-1/2 transform -translate-x-1/2">
          <div className={cn(
            "flex items-center space-x-2 px-3 py-1 rounded-full shadow-lg text-xs font-medium",
            isValid 
              ? "bg-blue-500 text-white" 
              : "bg-red-500 text-white"
          )}>
            {isValid ? (
              <>
                <CheckCircle className="h-3 w-3" />
                <span>Soltar aqui</span>
              </>
            ) : (
              <>
                <XCircle className="h-3 w-3" />
                <span>Posição inválida</span>
              </>
            )}
          </div>
        </div>
      )}
      
      {/* Indicador de linha com animação */}
      {isActive && (
        <div className={cn(
          "absolute inset-0 rounded-full animate-pulse",
          isValid ? "bg-blue-500" : "bg-red-500"
        )} />
      )}
    </div>
  );
};
