
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
  interval = 60000, // Aumentado para 1 minuto
  enabled = true,
  refreshOnRouteChange = false // Desabilitado por padrão
}: UseAutoRefreshProps) => {
  const location = useLocation();
  const intervalRef = useRef<NodeJS.Timeout>();
  const lastRefreshRef = useRef<number>(Date.now());
  const debounceRef = useRef<NodeJS.Timeout>();
  const isRefreshingRef = useRef<boolean>(false);

  // Função de refresh com debounce e proteção contra múltiplas execuções
  const refresh = useCallback(() => {
    if (isRefreshingRef.current) {
      console.log('🚫 Refresh já em andamento, ignorando...');
      return;
    }

    // Debounce para evitar múltiplas execuções
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      console.log('🔄 Auto refresh executado');
      isRefreshingRef.current = true;
      lastRefreshRef.current = Date.now();
      
      try {
        onRefresh();
      } finally {
        // Liberar flag após um tempo
        setTimeout(() => {
          isRefreshingRef.current = false;
        }, 2000);
      }
    }, 500); // Debounce de 500ms
  }, [onRefresh]);

  // Auto refresh por intervalo (mais conservador)
  useEffect(() => {
    if (!enabled) return;

    intervalRef.current = setInterval(() => {
      const timeSinceLastRefresh = Date.now() - lastRefreshRef.current;
      // Só fazer refresh se passou tempo suficiente
      if (timeSinceLastRefresh >= interval) {
        refresh();
      }
    }, interval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [refresh, interval, enabled]);

  // Refresh ao voltar para a página (mais conservador)
  useEffect(() => {
    if (!enabled) return;

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        const timeSinceLastRefresh = Date.now() - lastRefreshRef.current;
        // Só fazer refresh se passou mais de 30 segundos
        if (timeSinceLastRefresh > 30000) {
          console.log('🔄 Refresh on page visibility');
          refresh();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [refresh, enabled]);

  // Refresh ao mudar de rota (REMOVIDO - principal causa do loop)
  // Este useEffect foi removido pois estava causando o loop infinito

  const forceRefresh = useCallback(() => {
    console.log('🔄 Force refresh solicitado');
    // Resetar proteções para permitir force refresh
    isRefreshingRef.current = false;
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    refresh();
  }, [refresh]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
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
