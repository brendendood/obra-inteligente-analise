
import { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle, Info, X, Zap, Loader } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NotificationProps {
  type: 'success' | 'error' | 'info' | 'loading';
  title: string;
  description?: string;
  duration?: number;
  onClose?: () => void;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const EnhancedNotification = ({ 
  type, 
  title, 
  description, 
  duration = 5000,
  onClose,
  action
}: NotificationProps) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (type !== 'loading' && duration > 0) {
      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(() => onClose?.(), 300);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose, type]);

  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    info: Info,
    loading: Loader
  };

  const styles = {
    success: "bg-green-50 border-green-200 text-green-800",
    error: "bg-red-50 border-red-200 text-red-800",
    info: "bg-blue-50 border-blue-200 text-blue-800",
    loading: "bg-gray-50 border-gray-200 text-gray-800"
  };

  const iconStyles = {
    success: "text-green-600",
    error: "text-red-600", 
    info: "text-blue-600",
    loading: "text-gray-600"
  };

  const Icon = icons[type];

  if (!visible) return null;

  return (
    <div className={cn(
      "flex items-start space-x-3 p-4 border rounded-lg shadow-lg transition-all duration-300",
      visible ? "animate-fade-in" : "animate-fade-out",
      styles[type]
    )}>
      <Icon className={cn(
        "h-5 w-5 flex-shrink-0 mt-0.5", 
        iconStyles[type],
        type === 'loading' && "animate-spin"
      )} />
      
      <div className="flex-1 min-w-0">
        <p className="font-semibold">{title}</p>
        {description && (
          <p className="text-sm opacity-90 mt-1">{description}</p>
        )}
        {action && (
          <button
            onClick={action.onClick}
            className="text-sm font-medium underline hover:no-underline mt-2"
          >
            {action.label}
          </button>
        )}
      </div>

      {type !== 'loading' && (
        <button
          onClick={() => {
            setVisible(false);
            setTimeout(() => onClose?.(), 300);
          }}
          className="flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

// Hook para gerenciar notificações
export const useEnhancedNotifications = () => {
  const [notifications, setNotifications] = useState<Array<NotificationProps & { id: string }>>([]);

  const addNotification = (notification: NotificationProps) => {
    const id = Math.random().toString(36).substr(2, 9);
    setNotifications(prev => [...prev, { ...notification, id }]);
    return id;
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const showSuccess = (title: string, description?: string) => {
    return addNotification({ type: 'success', title, description });
  };

  const showError = (title: string, description?: string) => {
    return addNotification({ type: 'error', title, description });
  };

  const showInfo = (title: string, description?: string) => {
    return addNotification({ type: 'info', title, description });
  };

  const showLoading = (title: string, description?: string) => {
    return addNotification({ type: 'loading', title, description, duration: 0 });
  };

  return {
    notifications,
    showSuccess,
    showError,
    showInfo,
    showLoading,
    removeNotification
  };
};
