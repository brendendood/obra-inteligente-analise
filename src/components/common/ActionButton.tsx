
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
        return 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-md';
      case 'secondary':
        return 'bg-secondary hover:bg-secondary/80 text-secondary-foreground';
      case 'outline':
        return 'border border-border text-foreground hover:bg-accent bg-card shadow-sm';
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
      className={`${getVariantClasses()} ${getSizeClasses()} font-medium transition-all duration-200 ${className}`}
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
