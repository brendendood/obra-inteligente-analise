import { useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Project } from '@/types/project';

export type NotificationOrigin = 'upload' | 'manual' | 'auto' | 'external';

/**
 * Hook centralizado para notificações de projetos
 * Controla quando mostrar toasts baseado na origem da ação
 */
export const useProjectNotifications = () => {
  const { toast } = useToast();

  const showProjectCreated = useCallback((project: Project, origin: NotificationOrigin = 'auto') => {
    // Mostrar apenas para uploads e ações manuais
    if (origin === 'upload' || origin === 'manual') {
      toast({
        title: "📁 Novo projeto",
        description: `"${project.name}" foi criado com sucesso.`,
      });
    }
  }, [toast]);

  const showProjectUpdated = useCallback((project: Project, origin: NotificationOrigin = 'auto') => {
    // Mostrar apenas para ações manuais
    if (origin === 'manual') {
      toast({
        title: "✏️ Projeto atualizado",
        description: `"${project.name}" foi atualizado.`,
      });
    }
  }, [toast]);

  const showProjectDeleted = useCallback((project: Project, origin: NotificationOrigin = 'auto') => {
    // Mostrar apenas para ações manuais e exclusões externas
    if (origin === 'manual' || origin === 'external') {
      toast({
        title: "🗑️ Projeto removido",
        description: `"${project.name}" foi excluído.`,
      });
    }
  }, [toast]);

  const showSyncStatus = useCallback((status: 'connecting' | 'connected' | 'error', origin: NotificationOrigin = 'auto') => {
    // Mostrar apenas para conexões manuais
    if (origin === 'manual') {
      switch (status) {
        case 'connected':
          toast({
            title: "🔗 Sincronização ativa",
            description: "Seus projetos serão atualizados automaticamente.",
          });
          break;
        case 'error':
          toast({
            title: "⚠️ Conexão instável",
            description: "A sincronização será retomada automaticamente.",
            variant: "destructive",
          });
          break;
      }
    }
  }, [toast]);

  const showDataSynced = useCallback((origin: NotificationOrigin = 'auto') => {
    // Mostrar apenas para ressincronizações manuais
    if (origin === 'manual') {
      toast({
        title: "🔄 Dados atualizados",
        description: "Seus projetos foram sincronizados com o servidor.",
      });
    }
  }, [toast]);

  return {
    showProjectCreated,
    showProjectUpdated,
    showProjectDeleted,
    showSyncStatus,
    showDataSynced,
  };
};