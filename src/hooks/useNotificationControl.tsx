
import { useState, useCallback, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';

interface NotificationState {
  lastError: string | null;
  errorCount: number;
  lastErrorTime: number;
}

export const useNotificationControl = () => {
  const { toast } = useToast();
  const [notificationState, setNotificationState] = useState<NotificationState>({
    lastError: null,
    errorCount: 0,
    lastErrorTime: 0
  });
  
  const timeoutRef = useRef<NodeJS.Timeout>();

  const showControlledError = useCallback((title: string, description: string, errorKey?: string) => {
    const now = Date.now();
    const errorIdentifier = errorKey || `${title}-${description}`;
    
    // Evitar notificações duplicadas nos últimos 5 segundos
    if (
      notificationState.lastError === errorIdentifier && 
      now - notificationState.lastErrorTime < 5000
    ) {
      return;
    }

    // Limitar a 1 notificação de erro por tipo
    if (notificationState.errorCount > 0 && notificationState.lastError === errorIdentifier) {
      return;
    }

    setNotificationState({
      lastError: errorIdentifier,
      errorCount: 1,
      lastErrorTime: now
    });

    toast({
      title,
      description,
      variant: "destructive",
      duration: 4000 // Auto-remover após 4 segundos
    });

    // Reset automático após 10 segundos
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      setNotificationState({
        lastError: null,
        errorCount: 0,
        lastErrorTime: 0
      });
    }, 10000);
  }, [notificationState, toast]);

  const showControlledSuccess = useCallback((title: string, description: string) => {
    // Limpar erros anteriores ao mostrar sucesso
    setNotificationState({
      lastError: null,
      errorCount: 0,
      lastErrorTime: 0
    });

    toast({
      title,
      description,
      duration: 3000
    });
  }, [toast]);

  const clearNotifications = useCallback(() => {
    setNotificationState({
      lastError: null,
      errorCount: 0,
      lastErrorTime: 0
    });
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  return {
    showControlledError,
    showControlledSuccess,
    clearNotifications
  };
};
