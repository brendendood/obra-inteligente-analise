
import { CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CompactUnifiedLoading } from './unified-loading';

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
    return <CompactUnifiedLoading text={loadingText} className={className} />;
  }

  return null;
};

// Legacy exports for backward compatibility
export const InlineLoading = ({ text = "Carregando..." }: { text?: string }) => (
  <CompactUnifiedLoading text={text} />
);

export const PageLoading = ({ text = "Carregando..." }: { text?: string }) => (
  <div className="flex items-center justify-center min-h-[400px]">
    <CompactUnifiedLoading text={text} />
  </div>
);
