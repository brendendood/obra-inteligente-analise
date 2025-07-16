
import { Loader, Zap, CheckCircle, Hammer, Drill, Wrench, Ruler } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SmartLoadingProps {
  isLoading: boolean;
  hasData: boolean;
  loadingText?: string;
  successText?: string;
  className?: string;
  showProgress?: boolean;
  progress?: number;
}

export const SmartLoading = ({ 
  isLoading, 
  hasData,
  loadingText = "Construindo resultados...",
  successText = "Dados carregados",
  className,
  showProgress = false,
  progress = 0
}: SmartLoadingProps) => {
  if (!isLoading && hasData) {
    return (
      <div className={cn("flex items-center space-x-2 text-green-600 text-sm", className)}>
        <CheckCircle className="h-4 w-4" />
        <span>{successText}</span>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={cn("flex items-center space-x-2 text-blue-600 text-sm", className)}>
        <div className="animate-hammer">
          <Hammer className="h-4 w-4 text-orange-500" />
        </div>
        <div className="flex flex-col">
          <span>{loadingText}</span>
          {showProgress && (
            <div className="w-24 h-1 bg-gray-200 rounded-full mt-1">
              <div 
                className="h-1 bg-blue-600 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
              />
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
};

export const InlineLoading = ({ text = "Construindo resultados..." }: { text?: string }) => (
  <div className="flex items-center justify-center space-x-2 text-gray-600 py-8">
    <div className="animate-hammer">
      <Hammer className="h-5 w-5 text-orange-500" />
    </div>
    <span>{text}</span>
  </div>
);

export const PageLoading = ({ text = "Construindo página..." }: { text?: string }) => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="text-center">
      <div className="flex items-center justify-center space-x-2 mb-4">
        <div className="animate-hammer">
          <Hammer className="h-8 w-8 text-orange-500" />
        </div>
        <div className="animate-drill">
          <Drill className="h-8 w-8 text-blue-500" />
        </div>
        <div className="animate-wrench">
          <Wrench className="h-8 w-8 text-green-500" />
        </div>
        <div className="animate-ruler">
          <Ruler className="h-8 w-8 text-purple-500" />
        </div>
      </div>
      <p className="text-gray-600 font-medium">{text}</p>
    </div>
  </div>
);
