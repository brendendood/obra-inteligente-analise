
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Project } from '@/types/project';

export const useProjectLoader = () => {
  const { user, isAuthenticated, loading } = useAuth();

  const loadUserProjects = useCallback(async (): Promise<Project[]> => {
    console.log('📂 loadUserProjects chamado:', { 
      loading, 
      isAuthenticated, 
      userId: user?.id,
      userEmail: user?.email 
    });
    
    // Aguardar auth completar
    if (loading) {
      console.log('⏳ Auth ainda carregando, retornando array vazio');
      return [];
    }

    // Verificar autenticação
    if (!isAuthenticated || !user) {
      console.log('🚫 Usuário não autenticado, retornando array vazio');
      return [];
    }

    try {
      console.log('🔍 Executando consulta para usuário:', {
        id: user.id,
        email: user.email
      });
      
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Erro na consulta do ProjectLoader:', error);
        throw error;
      }
      
      console.log('✅ Consulta ProjectLoader executada com sucesso:', {
        encontrados: data?.length || 0,
        dadosCompletos: data
      });
      
      if (data && data.length > 0) {
        console.log('📊 Primeiro projeto encontrado:', {
          id: data[0].id,
          name: data[0].name,
          user_id: data[0].user_id,
          created_at: data[0].created_at
        });
      } else {
        console.log('📭 Nenhum projeto encontrado para o usuário');
      }
      
      return data || [];
    } catch (error) {
      console.error('💥 Erro ao carregar projetos no ProjectLoader:', error);
      return [];
    }
  }, [isAuthenticated, user, loading]);

  return { loadUserProjects };
};
