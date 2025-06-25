
import { Loader, Zap, CheckCircle } from 'lucide-react';
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
  loadingText = "Carregando...",
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
        <Loader className="h-4 w-4 animate-spin" />
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

export const InlineLoading = ({ text = "Carregando..." }: { text?: string }) => (
  <div className="flex items-center justify-center space-x-2 text-gray-600 py-8">
    <Loader className="h-5 w-5 animate-spin" />
    <span>{text}</span>
  </div>
);

export const PageLoading = ({ text = "Carregando página..." }: { text?: string }) => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="text-center">
      <div className="relative">
        <Loader className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
        <div className="absolute inset-0 animate-ping">
          <Zap className="h-8 w-8 text-blue-200 mx-auto" />
        </div>
      </div>
      <p className="text-gray-600 font-medium">{text}</p>
    </div>
  </div>
);
