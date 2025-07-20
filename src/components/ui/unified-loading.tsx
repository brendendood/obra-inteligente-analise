
import { cn } from '@/lib/utils';

interface UnifiedLoadingProps {
  className?: string;
  text?: string;
}

export const UnifiedLoading = ({ 
  className, 
  text = "Carregando..." 
}: UnifiedLoadingProps) => {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center min-h-screen bg-gray-50/80 backdrop-blur-sm",
      className
    )}>
      <div className="flex flex-col items-center space-y-4">
        {/* Modern spinner inspired by Apple/macOS */}
        <div className="relative">
          <div className="w-8 h-8 border-2 border-gray-200 rounded-full"></div>
          <div className="absolute top-0 left-0 w-8 h-8 border-2 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
        </div>
        
        {/* Clean text */}
        <p className="text-gray-600 font-medium text-sm">
          {text}
        </p>
      </div>
    </div>
  );
};

// Inline version for smaller sections
export const InlineUnifiedLoading = ({ 
  className, 
  text = "Carregando..." 
}: UnifiedLoadingProps) => {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center py-12",
      className
    )}>
      <div className="flex flex-col items-center space-y-3">
        <div className="relative">
          <div className="w-6 h-6 border-2 border-gray-200 rounded-full"></div>
          <div className="absolute top-0 left-0 w-6 h-6 border-2 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
        </div>
        <p className="text-gray-600 text-sm">
          {text}
        </p>
      </div>
    </div>
  );
};

// Compact version for small spaces
export const CompactUnifiedLoading = ({ 
  className, 
  text = "Carregando..." 
}: UnifiedLoadingProps) => {
  return (
    <div className={cn(
      "flex items-center justify-center space-x-2 py-4",
      className
    )}>
      <div className="relative">
        <div className="w-4 h-4 border border-gray-200 rounded-full"></div>
        <div className="absolute top-0 left-0 w-4 h-4 border border-blue-600 rounded-full border-t-transparent animate-spin"></div>
      </div>
      <span className="text-gray-600 text-sm">{text}</span>
    </div>
  );
};
