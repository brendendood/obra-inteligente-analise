
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

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
        return 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-lg hover:shadow-xl';
      case 'secondary':
        return 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-500 hover:bg-slate-50 dark:hover:bg-slate-600 shadow-sm hover:shadow-md';
      case 'outline':
        return 'border-2 border-slate-300 dark:border-slate-500 text-slate-700 dark:text-slate-200 hover:border-blue-400 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm';
      default:
        return '';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-4 py-2 text-sm h-9';
      case 'md':
        return 'px-6 py-3 text-base h-11';
      case 'lg':
        return 'px-8 py-4 text-lg h-12';
      default:
        return '';
    }
  };

  return (
    <Button
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`${getVariantClasses()} ${getSizeClasses()} font-semibold rounded-xl transition-all duration-300 ${className}`}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin mr-2" />
      ) : icon ? (
        <span className="flex items-center">
          {icon}
          <span className="ml-2">{children}</span>
        </span>
      ) : (
        children
      )}
    </Button>
  );
};

export default ActionButton;
