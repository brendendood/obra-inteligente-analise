import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Wifi, WifiOff, RefreshCw, AlertTriangle, CheckCircle2, Database } from 'lucide-react';
import { useProjectSyncManager } from '@/hooks/useProjectSyncManager';
import { useUnifiedProjectStore } from '@/stores/unifiedProjectStore';
import { useUnifiedProjectRealtime } from '@/hooks/useUnifiedProjectRealtime';

/**
 * Indicador visual do status de sincronização
 * Mostra conexão, operações pendentes e permite forçar sync
 */
export const SyncStatusIndicator = () => {
  const { 
    isRealtimeConnected, 
    isFullyConnected, 
    hasPendingOperations,
    syncMetrics,
    forceSyncAll,
    pendingOperationsCount
  } = useProjectSyncManager();
  
  const { 
    projects, 
    isLoading, 
    error, 
    debugInfo,
    clearCache,
    forceRefresh 
  } = useUnifiedProjectStore();
  
  const {
    reconnectAttempts
  } = useUnifiedProjectRealtime();

  const getStatusInfo = () => {
    if (error) {
      return {
        icon: <AlertTriangle className="h-3 w-3" />,
        color: 'destructive' as const,
        label: 'Erro',
        description: `Erro no carregamento: ${error}. Clique para tentar novamente.`,
      };
    }

    if (isLoading) {
      return {
        icon: <RefreshCw className="h-3 w-3 animate-spin" />,
        color: 'secondary' as const,
        label: 'Carregando',
        description: 'Carregando dados dos projetos...',
      };
    }

    if (!isFullyConnected) {
      return {
        icon: <WifiOff className="h-3 w-3" />,
        color: 'destructive' as const,
        label: 'Offline',
        description: 'Sem conexão com o servidor. Dados podem estar desatualizados.',
      };
    }

    if (hasPendingOperations) {
      return {
        icon: <RefreshCw className="h-3 w-3 animate-spin" />,
        color: 'secondary' as const,
        label: `${pendingOperationsCount} pendentes`,
        description: `${pendingOperationsCount} operações aguardando sincronização.`,
      };
    }

    if (!isRealtimeConnected) {
      return {
        icon: <AlertTriangle className="h-3 w-3" />,
        color: 'outline' as const,
        label: 'Limitado',
        description: 'Conexão limitada. Atualizações em tempo real indisponíveis.',
      };
    }

    if (projects.length === 0) {
      return {
        icon: <Database className="h-3 w-3" />,
        color: 'outline' as const,
        label: 'Nenhum projeto',
        description: 'Nenhum projeto encontrado. Crie seu primeiro projeto.',
      };
    }

    return {
      icon: <CheckCircle2 className="h-3 w-3" />,
      color: 'default' as const,
      label: 'Sincronizado',
      description: `${projects.length} projetos sincronizados em tempo real.`,
    };
  };

  const statusInfo = getStatusInfo();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center space-x-2">
            <Badge 
              variant={statusInfo.color}
              className="flex items-center space-x-1 cursor-pointer hover:bg-opacity-80"
              onClick={(e) => {
                e.preventDefault();
                if (e.shiftKey) {
                  console.log('🗑️ SYNC STATUS: Limpando cache por shift+click');
                  clearCache();
                } else if (error) {
                  console.log('🔄 SYNC STATUS: Tentando refresh por erro');
                  forceRefresh();
                } else {
                  console.log('🔄 SYNC STATUS: Forçando sync completo');
                  forceSyncAll();
                }
              }}
            >
              {statusInfo.icon}
              <span className="text-xs">{statusInfo.label}</span>
            </Badge>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <div className="space-y-2">
            <p className="font-medium">{statusInfo.description}</p>
            
            {/* Status detalhado */}
            <div className="text-xs space-y-1">
              <div>📊 Projetos: {projects.length}</div>
              <div>🔌 Realtime: {isRealtimeConnected ? '✅' : '❌'}</div>
              <div>🌐 Conexão: {isFullyConnected ? '✅' : '❌'}</div>
              {reconnectAttempts > 0 && (
                <div>🔄 Tentativas: {reconnectAttempts}</div>
              )}
            </div>
            
            {/* Debug info */}
            {debugInfo.retryCount > 0 && (
              <div className="text-xs text-yellow-400">
                🔄 Tentativas de carregamento: {debugInfo.retryCount}
              </div>
            )}
            
            {syncMetrics.errorCount > 0 && (
              <p className="text-xs text-red-400">
                ❌ {syncMetrics.errorCount} erros de sincronização
              </p>
            )}
            
            <div className="border-t pt-2">
              <p className="text-xs text-muted-foreground">
                Clique para forçar sincronização
              </p>
              <p className="text-xs text-muted-foreground">
                Shift+Click para limpar cache
              </p>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};