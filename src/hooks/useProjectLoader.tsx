
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Project } from '@/types/project';

export const useProjectLoader = () => {
  const { user, isAuthenticated, loading } = useAuth();

  const loadUserProjects = useCallback(async (): Promise<Project[]> => {
    // Aguardar auth completar
    if (loading) {
      return [];
    }

    // Verificar autenticação
    if (!isAuthenticated || !user) {
      return [];
    }

    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro na consulta do ProjectLoader:', error);
        throw error;
      }
      
      return data || [];
    } catch (error) {
      console.error('Erro ao carregar projetos no ProjectLoader:', error);
      return [];
    }
  }, [isAuthenticated, user, loading]);

  return { loadUserProjects };
};
