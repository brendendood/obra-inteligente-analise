
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Project } from '@/types/project';

export const useProjectLoader = () => {
  const { user, isAuthenticated, loading } = useAuth();

  const loadUserProjects = useCallback(async (): Promise<Project[]> => {
    // Se ainda está carregando auth, aguardar
    if (loading) {
      console.log('Auth ainda carregando, aguardando...');
      return [];
    }

    // Se não está autenticado após carregamento, retornar vazio
    if (!isAuthenticated || !user) {
      console.log('Usuário não autenticado para carregar projetos');
      return [];
    }

    try {
      console.log('Carregando projetos para usuário:', user.id);
      
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao carregar projetos:', error.message);
        throw error;
      }
      
      console.log('Projetos carregados com sucesso:', data?.length || 0, 'projetos encontrados');
      
      // Log detalhado para debug
      if (data && data.length > 0) {
        console.log('Primeiro projeto:', {
          id: data[0].id,
          name: data[0].name,
          user_id: data[0].user_id,
          created_at: data[0].created_at
        });
      }
      
      return data || [];
    } catch (error) {
      console.error('Erro ao carregar projetos:', error);
      return [];
    }
  }, [isAuthenticated, user, loading]);

  return { loadUserProjects };
};
