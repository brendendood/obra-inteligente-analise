import { useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useOptimizedProjectStore } from '@/stores/optimizedProjectStore';
import { useAuth } from '@/hooks/useAuth';
import { Project } from '@/types/project';
import { useToast } from '@/hooks/use-toast';

/**
 * Hook para sincronização em tempo real dos projetos via Supabase Realtime
 * Escuta mudanças na tabela 'projects' e atualiza o store automaticamente
 */
export const useProjectRealtime = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { 
    projects, 
    addProject, 
    updateProject, 
    deleteProject: removeProject,
    forceRefresh 
  } = useOptimizedProjectStore();
  
  const channelRef = useRef<any>(null);
  const isConnectedRef = useRef(false);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  // Estabelecer conexão realtime
  const connectRealtime = useCallback(() => {
    if (!user?.id || channelRef.current) return;

    console.log('🔗 REALTIME: Conectando ao canal de projetos...');
    
    const channel = supabase
      .channel('projects-realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'projects',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('➕ REALTIME: Novo projeto inserido:', payload.new);
          const newProject = payload.new as Project;
          addProject(newProject);
          
          toast({
            title: "📁 Novo projeto adicionado",
            description: `Projeto "${newProject.name}" foi criado com sucesso.`,
          });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'projects',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('✏️ REALTIME: Projeto atualizado:', payload.new);
          const updatedProject = payload.new as Project;
          updateProject(updatedProject.id, updatedProject);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'projects',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('🗑️ REALTIME: Projeto deletado:', payload.old);
          const deletedProject = payload.old as Project;
          
          // Remove do store local sem chamar API
          const currentProjects = useOptimizedProjectStore.getState().projects;
          const newProjects = currentProjects.filter(p => p.id !== deletedProject.id);
          useOptimizedProjectStore.setState({ projects: newProjects });
          
          toast({
            title: "🗑️ Projeto removido",
            description: `Projeto "${deletedProject.name}" foi excluído.`,
          });
        }
      )
      .subscribe((status) => {
        console.log(`🔌 REALTIME: Status da conexão: ${status}`);
        
        if (status === 'SUBSCRIBED') {
          isConnectedRef.current = true;
          reconnectAttempts.current = 0;
          console.log('✅ REALTIME: Conectado com sucesso ao canal de projetos');
        } else if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
          isConnectedRef.current = false;
          console.warn('❌ REALTIME: Conexão perdida, tentando reconectar...');
          
          // Tentativa de reconexão com backoff exponencial
          if (reconnectAttempts.current < maxReconnectAttempts) {
            const delay = Math.pow(2, reconnectAttempts.current) * 1000; // 1s, 2s, 4s, 8s, 16s
            reconnectAttempts.current++;
            
            setTimeout(() => {
              console.log(`🔄 REALTIME: Tentativa de reconexão ${reconnectAttempts.current}/${maxReconnectAttempts}`);
              disconnectRealtime();
              connectRealtime();
            }, delay);
          } else {
            console.error('❌ REALTIME: Máximo de tentativas de reconexão atingido');
            toast({
              title: "⚠️ Conexão instável",
              description: "A sincronização em tempo real está indisponível. Os dados serão atualizados quando possível.",
              variant: "destructive",
            });
          }
        }
      });

    channelRef.current = channel;
  }, [user?.id, addProject, updateProject, toast]);

  // Desconectar realtime
  const disconnectRealtime = useCallback(() => {
    if (channelRef.current) {
      console.log('🔌 REALTIME: Desconectando canal...');
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
      isConnectedRef.current = false;
    }
  }, []);

  // Conectar quando usuário estiver disponível
  useEffect(() => {
    if (user?.id) {
      connectRealtime();
    } else {
      disconnectRealtime();
    }

    return () => {
      disconnectRealtime();
    };
  }, [user?.id, connectRealtime, disconnectRealtime]);

  // Monitorar mudanças de visibilidade da página
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && user?.id) {
        console.log('👁️ REALTIME: Página visível, verificando conexão...');
        if (!isConnectedRef.current) {
          disconnectRealtime();
          connectRealtime();
        }
        // Ressincronizar após volta do foco
        resyncProjects();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [user?.id, connectRealtime, disconnectRealtime]);

  // Ressincronizar projetos manualmente
  const resyncProjects = useCallback(async () => {
    console.log('🔄 REALTIME: Ressincronizando projetos...');
    try {
      await forceRefresh();
      console.log('✅ REALTIME: Ressincronização concluída');
    } catch (error) {
      console.error('❌ REALTIME: Erro na ressincronização:', error);
    }
  }, [forceRefresh]);

  return {
    isRealtimeConnected: isConnectedRef.current,
    connectRealtime,
    disconnectRealtime,
    resyncProjects,
    reconnectAttempts: reconnectAttempts.current,
  };
};