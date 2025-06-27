
import { useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Project } from '@/types/project';

export const useProjectStorage = () => {
  const { isAuthenticated } = useAuth();

  const saveProjectToStorage = useCallback((project: Project | null) => {
    if (project && isAuthenticated) {
      localStorage.setItem('currentProject', JSON.stringify(project));
      console.log('Projeto salvo no localStorage:', project.name);
    } else {
      localStorage.removeItem('currentProject');
      console.log('Projeto removido do localStorage');
    }
  }, [isAuthenticated]);

  const getProjectFromStorage = useCallback((): Project | null => {
    if (!isAuthenticated) return null;
    
    const savedProject = localStorage.getItem('currentProject');
    if (savedProject) {
      try {
        return JSON.parse(savedProject);
      } catch (error) {
        console.error('Erro ao parse do projeto do localStorage:', error);
        localStorage.removeItem('currentProject');
      }
    }
    return null;
  }, [isAuthenticated]);

  const clearProjectFromStorage = useCallback(() => {
    localStorage.removeItem('currentProject');
    console.log('Projeto removido do localStorage');
  }, []);

  return {
    saveProjectToStorage,
    getProjectFromStorage,
    clearProjectFromStorage
  };
};
