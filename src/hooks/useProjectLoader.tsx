
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Project } from '@/types/project';

export const useProjectLoader = () => {
  const { user, isAuthenticated } = useAuth();

  const loadUserProjects = useCallback(async (): Promise<Project[]> => {
    if (!isAuthenticated || !user) {
      console.log('Usuário não autenticado');
      return [];
    }

    try {
      console.log('Carregando projetos do usuário:', user.email);
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao carregar projetos:', error);
        throw error;
      }
      
      console.log('Projetos carregados do DB:', data?.length || 0);
      return data || [];
    } catch (error) {
      console.error('Error loading projects:', error);
      return [];
    }
  }, [isAuthenticated, user]);

  return { loadUserProjects };
};
