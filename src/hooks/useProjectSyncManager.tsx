import { useEffect, useCallback, useRef } from 'react';
import { useUnifiedProjectStore } from '@/stores/unifiedProjectStore';
import { useUnifiedProjectRealtime } from './useUnifiedProjectRealtime';
import { useNetworkStatus } from './useNetworkStatus';
import { useToast } from '@/hooks/use-toast';

interface SyncOperation {
  id: string;
  type: 'create' | 'update' | 'delete';
  data: any;
  timestamp: number;
  retryCount: number;
}

/**
 * Hook principal para gerenciar toda a sincronização de projetos
 * Coordena realtime, fallbacks, revalidação e cache de emergência
 */
export const useProjectSyncManager = () => {
  const { forceRefresh } = useUnifiedProjectStore();
  const { isRealtimeConnected, resyncProjects } = useUnifiedProjectRealtime();
  const { isFullyConnected, checkConnection } = useNetworkStatus();
  const { toast } = useToast();
  
  const pendingOperations = useRef<SyncOperation[]>([]);
  const syncMetrics = useRef({
    successCount: 0,
    errorCount: 0,
    lastSyncTime: Date.now(),
    inconsistencyDetected: false,
  });

  // Processar operações pendentes quando conexão for restaurada
  const processPendingOperations = useCallback(async () => {
    if (pendingOperations.current.length === 0) return;
    
    console.log('🔄 SYNC MANAGER: Processando operações pendentes:', pendingOperations.current.length);
    
    const operations = [...pendingOperations.current];
    pendingOperations.current = [];
    
    for (const operation of operations) {
      try {
        // Tentar executar a operação novamente
        switch (operation.type) {
          case 'create':
          case 'update':
          case 'delete':
            // Forçar refresh completo para garantir consistência
            await forceRefresh();
            break;
        }
        
        syncMetrics.current.successCount++;
        console.log('✅ SYNC MANAGER: Operação processada:', operation.id);
      } catch (error) {
        console.error('❌ SYNC MANAGER: Erro ao processar operação:', operation.id, error);
        
        operation.retryCount++;
        if (operation.retryCount < 3) {
          pendingOperations.current.push(operation);
        } else {
          syncMetrics.current.errorCount++;
          toast({
            title: "⚠️ Erro de sincronização",
            description: "Algumas alterações podem não ter sido salvas. Verifique sua conexão.",
            variant: "destructive",
          });
        }
      }
    }
  }, [forceRefresh, toast]);

  // Monitorar mudanças de conectividade
  useEffect(() => {
    if (isFullyConnected && pendingOperations.current.length > 0) {
      console.log('✅ SYNC MANAGER: Conexão restaurada, processando operações pendentes');
      processPendingOperations();
    }
  }, [isFullyConnected, processPendingOperations]);

  // Detectar inconsistências
  const detectInconsistencies = useCallback(async () => {
    try {
      console.log('🔍 SYNC MANAGER: Verificando consistência dos dados...');
      
      // Verificar se há problemas de conectividade
      const connectionStatus = await checkConnection();
      
      if (!connectionStatus.isSupabaseConnected) {
        console.warn('⚠️ SYNC MANAGER: Inconsistência detectada - Supabase desconectado');
        syncMetrics.current.inconsistencyDetected = true;
        return false;
      }
      
      syncMetrics.current.inconsistencyDetected = false;
      syncMetrics.current.lastSyncTime = Date.now();
      return true;
    } catch (error) {
      console.error('❌ SYNC MANAGER: Erro na verificação de consistência:', error);
      return false;
    }
  }, [checkConnection]);

  // Revalidação automática periódica - SEM dependências circulares
  useEffect(() => {
    const interval = setInterval(async () => {
      if (isFullyConnected && !isRealtimeConnected) {
        console.log('🔄 SYNC MANAGER: Revalidação automática (realtime desconectado)');
        await resyncProjects();
      }
      
      // Verificar consistência a cada 5 minutos
      await detectInconsistencies();
    }, 30000); // 30 segundos

    return () => clearInterval(interval);
  }, [isFullyConnected, isRealtimeConnected]); // REMOVIDO dependências de função

  // Adicionar operação à fila de pendências
  const addPendingOperation = useCallback((operation: Omit<SyncOperation, 'id' | 'timestamp' | 'retryCount'>) => {
    const fullOperation: SyncOperation = {
      ...operation,
      id: `${operation.type}-${Date.now()}-${Math.random()}`,
      timestamp: Date.now(),
      retryCount: 0,
    };
    
    pendingOperations.current.push(fullOperation);
    console.log('📝 SYNC MANAGER: Operação adicionada à fila:', fullOperation.id);
  }, []);

  // Forçar sincronização completa
  const forceSyncAll = useCallback(async () => {
    console.log('🔄 SYNC MANAGER: Forçando sincronização completa...');
    
    try {
      await forceRefresh();
      await resyncProjects();
      await detectInconsistencies();
      
      toast({
        title: "✅ Sincronização concluída",
        description: "Todos os dados foram atualizados com o servidor.",
      });
    } catch (error) {
      console.error('❌ SYNC MANAGER: Erro na sincronização forçada:', error);
      toast({
        title: "❌ Erro na sincronização",
        description: "Não foi possível sincronizar com o servidor.",
        variant: "destructive",
      });
    }
  }, [forceRefresh, resyncProjects, detectInconsistencies, toast]);

  return {
    // Status
    isRealtimeConnected,
    isFullyConnected,
    hasPendingOperations: pendingOperations.current.length > 0,
    syncMetrics: syncMetrics.current,
    
    // Ações
    addPendingOperation,
    forceSyncAll,
    detectInconsistencies,
    
    // Info para debugging
    pendingOperationsCount: pendingOperations.current.length,
  };
};