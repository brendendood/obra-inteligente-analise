import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Wifi, WifiOff, RefreshCw, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useProjectSyncManager } from '@/hooks/useProjectSyncManager';

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

  const getStatusInfo = () => {
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

    return {
      icon: <CheckCircle2 className="h-3 w-3" />,
      color: 'default' as const,
      label: 'Sincronizado',
      description: 'Todos os dados estão sincronizados em tempo real.',
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
              onClick={forceSyncAll}
            >
              {statusInfo.icon}
              <span className="text-xs">{statusInfo.label}</span>
            </Badge>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <div className="space-y-1">
            <p className="font-medium">{statusInfo.description}</p>
            {syncMetrics.errorCount > 0 && (
              <p className="text-xs text-red-400">
                {syncMetrics.errorCount} erros de sincronização
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Clique para forçar sincronização
            </p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};