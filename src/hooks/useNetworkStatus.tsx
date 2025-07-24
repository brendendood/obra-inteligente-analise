import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface NetworkStatusState {
  isOnline: boolean;
  isSupabaseConnected: boolean;
  lastConnectionCheck: number;
  retryCount: number;
}

/**
 * Hook para monitorar status da rede e conexão com Supabase
 * Fornece fallback e revalidação automática em caso de perda de conexão
 */
export const useNetworkStatus = () => {
  const [status, setStatus] = useState<NetworkStatusState>({
    isOnline: navigator.onLine,
    isSupabaseConnected: true,
    lastConnectionCheck: Date.now(),
    retryCount: 0,
  });

  // Verificar conectividade com Supabase
  const checkSupabaseConnection = useCallback(async (): Promise<boolean> => {
    try {
      const { error } = await supabase.from('projects').select('id').limit(1);
      return !error;
    } catch (error) {
      console.error('🔌 NETWORK: Erro na conexão com Supabase:', error);
      return false;
    }
  }, []);

  // Executar verificação de conexão
  const performConnectionCheck = useCallback(async () => {
    console.log('🔍 NETWORK: Verificando status da conexão...');
    
    const isSupabaseOk = await checkSupabaseConnection();
    const now = Date.now();
    
    setStatus(prev => ({
      ...prev,
      isSupabaseConnected: isSupabaseOk,
      lastConnectionCheck: now,
      retryCount: isSupabaseOk ? 0 : prev.retryCount + 1,
    }));

    return {
      isOnline: navigator.onLine,
      isSupabaseConnected: isSupabaseOk,
    };
  }, [checkSupabaseConnection]);

  // Monitorar eventos de rede do navegador
  useEffect(() => {
    const handleOnline = () => {
      console.log('✅ NETWORK: Conexão restaurada');
      setStatus(prev => ({ ...prev, isOnline: true, retryCount: 0 }));
      // Verificar Supabase quando a conexão voltar
      performConnectionCheck();
    };

    const handleOffline = () => {
      console.log('❌ NETWORK: Conexão perdida');
      setStatus(prev => ({ 
        ...prev, 
        isOnline: false, 
        isSupabaseConnected: false 
      }));
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [performConnectionCheck]);

  // Verificação periódica quando offline
  useEffect(() => {
    if (!status.isOnline || !status.isSupabaseConnected) {
      const interval = setInterval(() => {
        console.log('🔄 NETWORK: Tentativa de reconexão...');
        performConnectionCheck();
      }, Math.min(5000 * Math.pow(2, status.retryCount), 30000)); // Backoff exponencial

      return () => clearInterval(interval);
    }
  }, [status.isOnline, status.isSupabaseConnected, status.retryCount, performConnectionCheck]);

  // Verificação inicial
  useEffect(() => {
    performConnectionCheck();
  }, [performConnectionCheck]);

  return {
    ...status,
    checkConnection: performConnectionCheck,
    isFullyConnected: status.isOnline && status.isSupabaseConnected,
  };
};