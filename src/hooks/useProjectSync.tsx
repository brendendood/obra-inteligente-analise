
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
      debugLog('🔄 SYNC: Auth pronto, carregando projetos iniciais');
      loadProjects();
    }
  }, [authLoading, isAuthenticated, loadProjects, debugLog]);

  // Restaurar projeto salvo apenas uma vez quando projetos carregarem
  useEffect(() => {
    if (state.projects.length > 0 && !state.currentProject && !authLoading) {
      debugLog('🔄 SYNC: Tentando restaurar projeto salvo');
      restoreSavedProject();
    }
  }, [state.projects.length, state.currentProject, restoreSavedProject, authLoading, debugLog]);

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
    forceRefresh: () => {
      debugLog('🔄 SYNC: Forçando refresh completo');
      return loadProjects(true);
    },
    clearCurrentProject: () => {
      debugLog('🧹 SYNC: Limpando projeto atual');
      setCurrentProject(null);
    }
  };
};
