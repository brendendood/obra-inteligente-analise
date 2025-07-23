
import { useCallback } from 'react';
import { useOptimizedProjectStore } from '@/stores/optimizedProjectStore';
import { useAuth } from '@/hooks/useAuth';
import { Project } from '@/types/project';

export const useProjectLoader = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const { projects, fetchProjects } = useOptimizedProjectStore();

  const loadUserProjects = useCallback(async (): Promise<Project[]> => {
    // Aguardar auth completar
    if (loading) {
      return [];
    }

    // Verificar autenticação
    if (!isAuthenticated || !user) {
      return [];
    }

    console.log('🔄 PROJECT LOADER: Usando store otimizado para carregar projetos');
    
    try {
      // Usar o store otimizado que já tem cache inteligente
      await fetchProjects();
      return projects;
    } catch (error) {
      console.error('Erro ao carregar projetos no ProjectLoader:', error);
      return [];
    }
  }, [isAuthenticated, user, loading, fetchProjects, projects]);

  return { loadUserProjects };
};
