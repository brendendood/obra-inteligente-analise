
import { CheckCircle, AlertCircle, Info, X, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EnhancedToastProps {
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  description?: string;
  onClose?: () => void;
  className?: string;
}

export const EnhancedToast = ({ 
  type, 
  title, 
  description, 
  onClose, 
  className 
}: EnhancedToastProps) => {
  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    info: Info,
    warning: AlertCircle
  };

  const styles = {
    success: "bg-green-50 border-green-200 text-green-800",
    error: "bg-red-50 border-red-200 text-red-800",
    info: "bg-blue-50 border-blue-200 text-blue-800",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-800"
  };

  const iconStyles = {
    success: "text-green-600",
    error: "text-red-600", 
    info: "text-blue-600",
    warning: "text-yellow-600"
  };

  const Icon = icons[type];

  return (
    <div className={cn(
      "flex items-start space-x-3 p-4 border rounded-lg shadow-lg animate-fade-in",
      styles[type],
      className
    )}>
      <Icon className={cn("h-5 w-5 flex-shrink-0 mt-0.5", iconStyles[type])} />
      
      <div className="flex-1 min-w-0">
        <p className="font-semibold">{title}</p>
        {description && (
          <p className="text-sm opacity-90 mt-1">{description}</p>
        )}
      </div>

      {onClose && (
        <button
          onClick={onClose}
          className="flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

// Hook para usar toasts melhorados
export const useEnhancedToast = () => {
  const showToast = (props: Omit<EnhancedToastProps, 'onClose'>) => {
    // Implementar lógica de exibição do toast
    console.log('Enhanced toast:', props);
  };

  return { showToast };
};
