
import { useEffect } from 'react';
import { useProjectState } from '@/hooks/useProjectState';
import { useProjectOperations } from '@/hooks/useProjectOperations';
import { useAuth } from '@/hooks/useAuth';

export const useProjectSync = () => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  
  const {
    state,
    debugLog,
    setCurrentProject,
    updateProjectsState,
    getProjectById,
    projectExists
  } = useProjectState();

  const {
    loadProjects,
    restoreSavedProject
  } = useProjectOperations(
    debugLog,
    updateProjectsState,
    setCurrentProject,
    getProjectById,
    state
  );

  // Carregar projetos quando auth estiver pronto
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      loadProjects();
    }
  }, [authLoading, isAuthenticated, loadProjects]);

  // Restaurar projeto salvo quando projetos carregarem
  useEffect(() => {
    if (state.projects.length > 0 && !state.currentProject) {
      restoreSavedProject();
    }
  }, [state.projects.length, state.currentProject, restoreSavedProject]);

  // REMOVIDO: Auto-refresh periódico que causava notificações infinitas

  return {
    // Estado
    projects: state.projects,
    currentProject: state.currentProject,
    isLoading: state.isLoading,
    error: state.error,
    lastSync: state.lastSync,
    
    // Ações
    loadProjects,
    setCurrentProject,
    getProjectById,
    projectExists,
    
    // Utilities
    forceRefresh: () => loadProjects(true),
    clearCurrentProject: () => setCurrentProject(null)
  };
};
