import { useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useUnifiedProjectStore } from '@/stores/unifiedProjectStore';
import { useAuth } from '@/hooks/useAuth';
import { Project } from '@/types/project';
import { useToast } from '@/hooks/use-toast';

/**
 * Hook unificado para real-time com prevenção total de duplicação
 * e reconexão automática robusta
 */
export const useUnifiedProjectRealtime = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { 
    addProject, 
    updateProject, 
    deleteProject, 
    forceRefresh 
  } = useUnifiedProjectStore();
  
  // Estados de controle rigorosos
  const channelRef = useRef<any>(null);
  const isConnectedRef = useRef(false);
  const isConnectingRef = useRef(false);
  const reconnectAttempts = useRef(0);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const maxReconnectAttempts = 3;
  const lastConnectionTime = useRef<number>(0);
  const minConnectionInterval = 10000; // 10 segundos mínimo entre reconexões
  const channelNameRef = useRef<string | null>(null);

  // Limpeza completa e robusta
  const cleanupAll = useCallback(() => {
    console.log('🧹 UNIFIED REALTIME: Limpeza completa iniciada...');
    
    // Limpar timeout de reconexão
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    
    // Desconectar canal atual
    if (channelRef.current) {
      try {
        console.log('🔌 UNIFIED REALTIME: Removendo canal existente...');
        supabase.removeChannel(channelRef.current);
      } catch (error) {
        console.warn('⚠️ UNIFIED REALTIME: Erro ao remover canal:', error);
      }
      channelRef.current = null;
    }
    
    // Reset completo dos estados
    isConnectedRef.current = false;
    isConnectingRef.current = false;
    channelNameRef.current = null;
    reconnectAttempts.current = 0;
    
    console.log('✅ UNIFIED REALTIME: Limpeza completa finalizada');
  }, []);

  // Conexão robusta com prevenção de duplicação
  const connectRealtime = useCallback(() => {
    if (!user?.id) {
      console.log('❌ UNIFIED REALTIME: Usuário não disponível');
      return;
    }

    // Prevenção rigorosa de múltiplas conexões
    if (isConnectingRef.current || channelRef.current) {
      console.log('⚠️ UNIFIED REALTIME: Conexão já em andamento, cancelando...');
      return;
    }

    isConnectingRef.current = true;
    const channelName = `unified-projects-${user.id}-${Date.now()}`;
    channelNameRef.current = channelName;
    
    console.log(`🔗 UNIFIED REALTIME: Iniciando conexão: ${channelName}`);
    
    try {
      const channel = supabase
        .channel(channelName, {
          config: {
            presence: { key: user.id },
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
            console.log('➕ UNIFIED REALTIME: Novo projeto:', payload.new);
            const newProject = payload.new as Project;
            addProject(newProject);
            
            toast({
              title: "📁 Novo projeto",
              description: `"${newProject.name}" foi criado com sucesso.`,
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
            console.log('✏️ UNIFIED REALTIME: Projeto atualizado:', payload.new);
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
            console.log('🗑️ UNIFIED REALTIME: Projeto deletado:', payload.old);
            const deletedProject = payload.old as Project;
            
            // Usar deleteProject com flag de exclusão externa
            deleteProject(deletedProject.id, true);
            
            toast({
              title: "🗑️ Projeto removido",
              description: `"${deletedProject.name}" foi excluído.`,
            });
          }
        )
        .subscribe((status) => {
          console.log(`🔌 UNIFIED REALTIME: Status [${channelName}]: ${status}`);
          
          if (status === 'SUBSCRIBED') {
            isConnectedRef.current = true;
            isConnectingRef.current = false;
            const currentAttempts = reconnectAttempts.current;
            reconnectAttempts.current = 0;
            console.log(`✅ UNIFIED REALTIME: Conectado: ${channelName}`);
            
            // Toast apenas na primeira conexão (não em reconexões)
            if (currentAttempts === 0) {
              toast({
                title: "🔗 Sincronização ativa",
                description: "Seus projetos serão atualizados automaticamente.",
              });
            }
          } else if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
            isConnectedRef.current = false;
            isConnectingRef.current = false;
            
            // Reconexão automática inteligente com throttling
            const now = Date.now();
            const timeSinceLastConnection = now - lastConnectionTime.current;
            
            if (
              channelNameRef.current === channelName && 
              reconnectAttempts.current < maxReconnectAttempts &&
              timeSinceLastConnection > minConnectionInterval
            ) {
              console.warn(`❌ UNIFIED REALTIME: Conexão perdida, reconectando...`);
              
              const delay = Math.pow(2, reconnectAttempts.current) * 3000; // Aumentado para 3s base
              reconnectAttempts.current++;
              lastConnectionTime.current = now;
              
              reconnectTimeoutRef.current = setTimeout(() => {
                console.log(`🔄 UNIFIED REALTIME: Tentativa ${reconnectAttempts.current}/${maxReconnectAttempts}`);
                cleanupAll();
                connectRealtime();
              }, delay);
            } else if (timeSinceLastConnection <= minConnectionInterval) {
              console.log('⏳ UNIFIED REALTIME: Throttling reconexão - muito recente');
            } else if (reconnectAttempts.current >= maxReconnectAttempts) {
              console.error('❌ UNIFIED REALTIME: Máximo de tentativas atingido');
              toast({
                title: "⚠️ Conexão instável",
                description: "A sincronização será retomada automaticamente.",
                variant: "destructive",
              });
            }
          }
        });

      channelRef.current = channel;
      console.log(`📋 UNIFIED REALTIME: Canal criado: ${channelName}`);
      
    } catch (error) {
      console.error('💥 UNIFIED REALTIME: Erro ao criar canal:', error);
      isConnectingRef.current = false;
    }
  }, [user?.id, addProject, updateProject, deleteProject, toast, cleanupAll]);

  // Gerenciamento de ciclo de vida - SEM dependências circulares
  useEffect(() => {
    if (user?.id) {
      console.log('👤 UNIFIED REALTIME: Usuário disponível, conectando...');
      connectRealtime();
    } else {
      console.log('❌ UNIFIED REALTIME: Usuário indisponível, limpando...');
      cleanupAll();
    }

    return () => {
      console.log('🔄 UNIFIED REALTIME: Hook desmontando...');
      cleanupAll();
    };
  }, [user?.id]); // REMOVIDO dependências circulares

  // Reconexão por visibilidade - SEM dependências circulares
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (
        document.visibilityState === 'visible' && 
        user?.id && 
        !isConnectedRef.current && 
        !isConnectingRef.current
      ) {
        console.log('👁️ UNIFIED REALTIME: Página visível, reconectando...');
        reconnectAttempts.current = 0;
        connectRealtime();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [user?.id]); // REMOVIDO dependência circular

  // Ressincronização manual
  const resyncProjects = useCallback(async () => {
    console.log('🔄 UNIFIED REALTIME: Ressincronizando projetos...');
    try {
      await forceRefresh();
      console.log('✅ UNIFIED REALTIME: Ressincronização concluída');
      
      toast({
        title: "🔄 Dados atualizados",
        description: "Seus projetos foram sincronizados com o servidor.",
      });
    } catch (error) {
      console.error('❌ UNIFIED REALTIME: Erro na ressincronização:', error);
      toast({
        title: "❌ Erro na sincronização",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
    }
  }, [forceRefresh, toast]);

  return {
    isRealtimeConnected: isConnectedRef.current,
    connectRealtime,
    disconnectRealtime: cleanupAll,
    resyncProjects,
    reconnectAttempts: reconnectAttempts.current,
  };
};