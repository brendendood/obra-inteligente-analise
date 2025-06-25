
import { useEffect, useCallback, useRef } from 'react';
import { useLocation } from 'react-router-dom';

interface UseAutoRefreshProps {
  onRefresh: () => void;
  interval?: number;
  enabled?: boolean;
  refreshOnRouteChange?: boolean;
}

export const useAutoRefresh = ({ 
  onRefresh, 
  interval = 30000, // 30 segundos
  enabled = true,
  refreshOnRouteChange = true 
}: UseAutoRefreshProps) => {
  const location = useLocation();
  const intervalRef = useRef<NodeJS.Timeout>();
  const lastRefreshRef = useRef<number>(Date.now());

  const refresh = useCallback(() => {
    console.log('🔄 Auto refresh triggered');
    lastRefreshRef.current = Date.now();
    onRefresh();
  }, [onRefresh]);

  // Auto refresh por intervalo
  useEffect(() => {
    if (!enabled) return;

    intervalRef.current = setInterval(() => {
      refresh();
    }, interval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [refresh, interval, enabled]);

  // Refresh ao voltar para a página
  useEffect(() => {
    if (!refreshOnRouteChange) return;

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        const timeSinceLastRefresh = Date.now() - lastRefreshRef.current;
        // Se passou mais de 10 segundos, fazer refresh
        if (timeSinceLastRefresh > 10000) {
          console.log('🔄 Refresh on page visibility');
          refresh();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [refresh, refreshOnRouteChange]);

  // Refresh ao mudar de rota
  useEffect(() => {
    if (!refreshOnRouteChange) return;
    
    console.log('🔄 Refresh on route change:', location.pathname);
    refresh();
  }, [location.pathname, refresh, refreshOnRouteChange]);

  const forceRefresh = useCallback(() => {
    console.log('🔄 Force refresh');
    refresh();
  }, [refresh]);

  return {
    forceRefresh,
    lastRefresh: lastRefreshRef.current
  };
};
