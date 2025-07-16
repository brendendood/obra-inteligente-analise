
import { Button } from '@/components/ui/button';
import { Loader2, Hammer } from 'lucide-react';

interface ActionButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
  icon?: React.ReactNode;
}

const ActionButton = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'md', 
  isLoading = false, 
  disabled = false,
  className = '',
  icon
}: ActionButtonProps) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-blue-600 hover:bg-blue-700 text-white';
      case 'secondary':
        return 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50';
      case 'outline':
        return 'border border-gray-300 text-gray-700 hover:border-blue-400 hover:bg-blue-50 bg-white';
      default:
        return '';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-2 text-sm h-9';
      case 'md':
        return 'px-4 py-3 text-base h-10';
      case 'lg':
        return 'px-6 py-4 text-lg h-12';
      default:
        return '';
    }
  };

  return (
    <Button
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`
        ${getVariantClasses()} 
        ${getSizeClasses()} 
        font-medium rounded-lg transition-all duration-200 
        w-full sm:w-auto min-w-0 max-w-full box-border
        flex items-center justify-center gap-2
        ${className}
      `}
      style={{ fontSize: '16px' }}
    >
      {isLoading ? (
        <>
          <div className="animate-hammer">
            <Hammer className="h-4 w-4 text-orange-500 flex-shrink-0" />
          </div>
          <span className="truncate">Construindo resultados...</span>
        </>
      ) : icon ? (
        <>
          <span className="flex-shrink-0">{icon}</span>
          <span className="truncate">{children}</span>
        </>
      ) : (
        <span className="truncate">{children}</span>
      )}
    </Button>
  );
};

export default ActionButton;
