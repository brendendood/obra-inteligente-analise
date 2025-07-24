import { useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useOptimizedProjectStore } from '@/stores/optimizedProjectStore';
import { useAuth } from '@/hooks/useAuth';
import { Project } from '@/types/project';
import { useToast } from '@/hooks/use-toast';

/**
 * Hook para sincronização em tempo real dos projetos via Supabase Realtime
 * SOLUÇÃO DEFINITIVA para o erro de múltiplas subscrições
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
  
  // Estados de controle mais rigorosos
  const channelRef = useRef<any>(null);
  const isConnectedRef = useRef(false);
  const isConnectingRef = useRef(false);
  const reconnectAttempts = useRef(0);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const maxReconnectAttempts = 3;
  const channelNameRef = useRef<string | null>(null);

  // Função para limpar completamente todas as conexões
  const cleanupAll = useCallback(() => {
    console.log('🧹 REALTIME: Limpeza completa iniciada...');
    
    // Limpar timeout de reconexão
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    
    // Desconectar canal atual
    if (channelRef.current) {
      try {
        console.log('🔌 REALTIME: Removendo canal existente...');
        supabase.removeChannel(channelRef.current);
      } catch (error) {
        console.warn('⚠️ REALTIME: Erro ao remover canal:', error);
      }
      channelRef.current = null;
    }
    
    // Reset de todos os estados
    isConnectedRef.current = false;
    isConnectingRef.current = false;
    channelNameRef.current = null;
    
    console.log('✅ REALTIME: Limpeza completa finalizada');
  }, []);

  // Função para conectar (com prevenção total de duplicação)
  const connectRealtime = useCallback(() => {
    if (!user?.id) {
      console.log('❌ REALTIME: Usuário não disponível');
      return;
    }

    // Prevenção rigorosa de múltiplas conexões
    if (isConnectingRef.current || channelRef.current) {
      console.log('⚠️ REALTIME: Conexão já em andamento ou canal já existe, cancelando...');
      return;
    }

    isConnectingRef.current = true;
    const channelName = `projects-${user.id}-${Date.now()}`;
    channelNameRef.current = channelName;
    
    console.log(`🔗 REALTIME: Iniciando conexão para canal: ${channelName}`);
    
    try {
      const channel = supabase
        .channel(channelName, {
          config: {
            presence: {
              key: user.id,
            },
          },
        })
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
          console.log(`🔌 REALTIME: Status da conexão [${channelName}]: ${status}`);
          
          if (status === 'SUBSCRIBED') {
            isConnectedRef.current = true;
            isConnectingRef.current = false;
            reconnectAttempts.current = 0;
            console.log(`✅ REALTIME: Conectado com sucesso ao canal ${channelName}`);
          } else if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
            isConnectedRef.current = false;
            isConnectingRef.current = false;
            
            // Só tentar reconectar se este ainda é o canal ativo
            if (channelNameRef.current === channelName && reconnectAttempts.current < maxReconnectAttempts) {
              console.warn(`❌ REALTIME: Conexão perdida para ${channelName}, tentando reconectar...`);
              
              const delay = Math.pow(2, reconnectAttempts.current) * 2000; // 2s, 4s, 8s
              reconnectAttempts.current++;
              
              reconnectTimeoutRef.current = setTimeout(() => {
                console.log(`🔄 REALTIME: Tentativa de reconexão ${reconnectAttempts.current}/${maxReconnectAttempts}`);
                cleanupAll();
                connectRealtime();
              }, delay);
            } else if (reconnectAttempts.current >= maxReconnectAttempts) {
              console.error('❌ REALTIME: Máximo de tentativas de reconexão atingido');
              toast({
                title: "⚠️ Conexão instável",
                description: "A sincronização será retomada automaticamente.",
                variant: "destructive",
              });
            }
          }
        });

      channelRef.current = channel;
      console.log(`📋 REALTIME: Canal ${channelName} criado com sucesso`);
      
    } catch (error) {
      console.error('💥 REALTIME: Erro ao criar canal:', error);
      isConnectingRef.current = false;
    }
  }, [user?.id, addProject, updateProject, toast, cleanupAll]);

  // Conectar quando usuário estiver disponível
  useEffect(() => {
    if (user?.id) {
      console.log('👤 REALTIME: Usuário disponível, conectando...');
      connectRealtime();
    } else {
      console.log('❌ REALTIME: Usuário não disponível, limpando conexões...');
      cleanupAll();
    }

    return () => {
      console.log('🔄 REALTIME: Hook desmontando, limpando tudo...');
      cleanupAll();
    };
  }, [user?.id, connectRealtime, cleanupAll]);

  // Monitorar mudanças de visibilidade da página (simplificado)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && user?.id && !isConnectedRef.current && !isConnectingRef.current) {
        console.log('👁️ REALTIME: Página visível, verificando reconexão...');
        reconnectAttempts.current = 0; // Reset attempts when page becomes visible
        connectRealtime();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [user?.id, connectRealtime]);

  // Função para ressincronizar projetos
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
    disconnectRealtime: cleanupAll,
    resyncProjects,
    reconnectAttempts: reconnectAttempts.current,
  };
};