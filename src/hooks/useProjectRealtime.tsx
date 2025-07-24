import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useProjectStore } from '@/stores/projectStore';
import { useAuth } from '@/hooks/useAuth';
import { Project } from '@/types/project';

/**
 * Hook para sincronização em tempo real dos projetos via Supabase Realtime
 * Escuta mudanças na tabela 'projects' e atualiza o store automaticamente
 */
export const useProjectRealtime = () => {
  const { user, isAuthenticated } = useAuth();
  const channelRef = useRef<any>(null);
  const { addProject, updateProject, deleteProject: removeFromStore, forceRefresh } = useProjectStore();

  useEffect(() => {
    if (!isAuthenticated || !user) {
      console.log('🔄 REALTIME: Usuário não autenticado, ignorando realtime');
      return;
    }

    console.log('🔄 REALTIME: Iniciando sincronização em tempo real para usuário:', user.id);

    // Criar canal para escutar mudanças na tabela projects
    const channel = supabase
      .channel('projects-realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'projects',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          console.log('➕ REALTIME: Novo projeto criado:', payload.new);
          const newProject = payload.new as Project;
          addProject(newProject);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'projects',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          console.log('📝 REALTIME: Projeto atualizado:', payload.new);
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
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          console.log('🗑️ REALTIME: Projeto excluído:', payload.old);
          const deletedProject = payload.old as Project;
          // Para exclusão, apenas removemos do store local (sem chamar API)
          // pois a exclusão já foi feita por outro processo
          removeFromStore(deletedProject.id, true); // flag para indicar que é exclusão externa
        }
      )
      .subscribe((status) => {
        console.log('📡 REALTIME: Status da conexão:', status);
        
        if (status === 'SUBSCRIBED') {
          console.log('✅ REALTIME: Conectado com sucesso ao canal de projetos');
        } else if (status === 'CHANNEL_ERROR') {
          console.error('❌ REALTIME: Erro na conexão do canal');
        } else if (status === 'TIMED_OUT') {
          console.warn('⏰ REALTIME: Timeout na conexão');
        }
      });

    channelRef.current = channel;

    // Cleanup na desmontagem
    return () => {
      console.log('🧹 REALTIME: Desconectando canal de projetos');
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [isAuthenticated, user?.id, addProject, updateProject, removeFromStore]);

  // Função para forçar resincronização
  const resyncProjects = async () => {
    console.log('🔄 REALTIME: Forçando resincronização completa...');
    await forceRefresh();
  };

  return {
    isRealtimeConnected: channelRef.current?.state === 'joined',
    resyncProjects,
  };
};