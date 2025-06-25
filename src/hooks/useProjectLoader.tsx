
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Project } from '@/types/project';

export const useProjectLoader = () => {
  const { user, isAuthenticated, loading } = useAuth();

  const loadUserProjects = useCallback(async (): Promise<Project[]> => {
    console.log('📂 loadUserProjects chamado:', { loading, isAuthenticated, userId: user?.id });
    
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
      console.log('🔍 Buscando projetos para usuário:', user.id);
      
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Erro na consulta:', error);
        throw error;
      }
      
      console.log('✅ Projetos encontrados:', data?.length || 0);
      
      if (data && data.length > 0) {
        console.log('📊 Primeiro projeto:', {
          id: data[0].id,
          name: data[0].name,
          created_at: data[0].created_at
        });
      }
      
      return data || [];
    } catch (error) {
      console.error('💥 Erro ao carregar projetos:', error);
      return [];
    }
  }, [isAuthenticated, user, loading]);

  return { loadUserProjects };
};
