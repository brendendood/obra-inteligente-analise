
import { useEffect, useCallback, useRef } from 'react';

interface UseAutoRefreshProps {
  onRefresh: () => void;
  interval?: number;
  enabled?: boolean;
}

export const useAutoRefresh = ({ 
  onRefresh, 
  interval = 300000, // 5 minutos - muito mais conservador
  enabled = true
}: UseAutoRefreshProps) => {
  const intervalRef = useRef<NodeJS.Timeout>();
  const lastRefreshRef = useRef<number>(Date.now());
  const isRefreshingRef = useRef<boolean>(false);

  // Função de refresh com proteção simples
  const refresh = useCallback(() => {
    if (isRefreshingRef.current) {
      return;
    }

    const timeSinceLastRefresh = Date.now() - lastRefreshRef.current;
    if (timeSinceLastRefresh < 60000) { // Mínimo 1 minuto entre refreshes
      return;
    }

    isRefreshingRef.current = true;
    lastRefreshRef.current = Date.now();
    
    try {
      onRefresh();
    } finally {
      setTimeout(() => {
        isRefreshingRef.current = false;
      }, 3000);
    }
  }, [onRefresh]);

  // Auto refresh apenas por intervalo (removido todos os outros triggers)
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

  const forceRefresh = useCallback(() => {
    // Resetar proteções para force refresh
    isRefreshingRef.current = false;
    lastRefreshRef.current = 0;
    refresh();
  }, [refresh]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    forceRefresh,
    lastRefresh: lastRefreshRef.current
  };
};
