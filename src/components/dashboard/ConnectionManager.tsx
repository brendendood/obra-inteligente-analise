import React, { useEffect, useState, useCallback } from 'react';
import { useUnifiedProjectRealtime } from '@/hooks/useUnifiedProjectRealtime';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { useProjectSyncManager } from '@/hooks/useProjectSyncManager';
import { EnhancedNotification, useEnhancedNotifications } from '@/components/ui/enhanced-notification';
import { NotificationContainer } from '@/components/ui/notification-container';

/**
 * Gerenciador central de conexão e sincronização
 * Resolve os problemas de:
 * 1. Conexão instável 
 * 2. Projetos não encontrados
 * 3. Notificações duplicadas
 */
export const ConnectionManager = () => {
  const { isRealtimeConnected, reconnectAttempts } = useUnifiedProjectRealtime();
  const { isFullyConnected, checkConnection } = useNetworkStatus();
  const { forceSyncAll, hasPendingOperations } = useProjectSyncManager();
  const { showError, showInfo, showSuccess, removeNotification } = useEnhancedNotifications();
  
  const [connectionNotificationId, setConnectionNotificationId] = useState<string | null>(null);
  const [hasShownConnectionError, setHasShownConnectionError] = useState(false);
  const [lastConnectionState, setLastConnectionState] = useState({ 
    isRealtimeConnected, 
    isFullyConnected 
  });

  // Gerenciar notificações de conexão de forma inteligente
  const handleConnectionStatus = useCallback(() => {
    const currentState = { isRealtimeConnected, isFullyConnected };
    
    // Só atualizar se houve mudança real no estado
    if (JSON.stringify(currentState) === JSON.stringify(lastConnectionState)) {
      return;
    }

    // Remover notificação anterior se existir
    if (connectionNotificationId) {
      removeNotification(connectionNotificationId);
      setConnectionNotificationId(null);
    }

    // Estado totalmente offline
    if (!isFullyConnected) {
      const id = showError(
        'Conexão perdida',
        'Verificando conectividade com o servidor...',
      );
      setConnectionNotificationId(id);
      setHasShownConnectionError(true);
    }
    // Conexão básica ok, mas realtime com problemas
    else if (isFullyConnected && !isRealtimeConnected && reconnectAttempts > 0) {
      const id = showInfo(
        'Conexão instável',
        'A sincronização será retomada automaticamente.',
      );
      setConnectionNotificationId(id);
    }
    // Conexão totalmente restaurada
    else if (isFullyConnected && isRealtimeConnected && hasShownConnectionError) {
      const id = showSuccess(
        'Conexão restaurada',
        'Todos os dados foram sincronizados.',
      );
      setConnectionNotificationId(id);
      setHasShownConnectionError(false);
      
      // Auto-remover após 3 segundos
      setTimeout(() => {
        removeNotification(id);
        setConnectionNotificationId(null);
      }, 3000);
    }

    setLastConnectionState(currentState);
  }, [
    isRealtimeConnected, 
    isFullyConnected, 
    reconnectAttempts, 
    lastConnectionState,
    connectionNotificationId,
    hasShownConnectionError,
    showError,
    showInfo,
    showSuccess,
    removeNotification
  ]);

  // Monitorar mudanças de conexão
  useEffect(() => {
    handleConnectionStatus();
  }, [handleConnectionStatus]);

  // Auto-recovery para conexões persistentemente instáveis
  useEffect(() => {
    if (!isFullyConnected || (!isRealtimeConnected && reconnectAttempts >= 3)) {
      const recoveryTimer = setTimeout(async () => {
        console.log('🔧 CONNECTION MANAGER: Iniciando recuperação automática...');
        
        try {
          // Verificar conectividade primeiro
          const connection = await checkConnection();
          
          if (connection.isOnline && connection.isSupabaseConnected) {
            // Forçar sincronização completa
            await forceSyncAll();
            console.log('✅ CONNECTION MANAGER: Recuperação concluída');
          }
        } catch (error) {
          console.error('❌ CONNECTION MANAGER: Erro na recuperação:', error);
        }
      }, 10000); // 10 segundos

      return () => clearTimeout(recoveryTimer);
    }
  }, [isFullyConnected, isRealtimeConnected, reconnectAttempts, checkConnection, forceSyncAll]);

  // Detectar operações pendentes
  useEffect(() => {
    if (hasPendingOperations && isFullyConnected) {
      const pendingTimer = setTimeout(() => {
        showInfo(
          'Sincronizando...',
          'Finalizando operações pendentes.',
        );
      }, 2000);

      return () => clearTimeout(pendingTimer);
    }
  }, [hasPendingOperations, isFullyConnected, showInfo]);

  return (
    <>
      <NotificationContainer />
      
      {/* Debug info em desenvolvimento */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 left-4 bg-black/80 text-white p-2 rounded text-xs z-50">
          <div>Realtime: {isRealtimeConnected ? '✅' : '❌'}</div>
          <div>Network: {isFullyConnected ? '✅' : '❌'}</div>
          <div>Attempts: {reconnectAttempts}</div>
          <div>Pending: {hasPendingOperations ? '⏳' : '✅'}</div>
        </div>
      )}
    </>
  );
};