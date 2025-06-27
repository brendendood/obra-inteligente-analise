
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
      console.log('🔄 PROJECT SYNC: Carregando projetos após autenticação');
      loadProjects();
    }
  }, [authLoading, isAuthenticated, loadProjects]);

  // Restaurar projeto salvo quando projetos carregarem
  useEffect(() => {
    if (state.projects.length > 0 && !state.currentProject) {
      console.log('🔄 PROJECT SYNC: Tentando restaurar projeto salvo');
      restoreSavedProject();
    }
  }, [state.projects.length, state.currentProject, restoreSavedProject]);

  // CORREÇÃO: Função melhorada para definir projeto atual
  const setCurrentProjectSafe = (project: any) => {
    if (!project) {
      console.log('🔄 PROJECT SYNC: Limpando projeto atual');
      setCurrentProject(null);
      return;
    }

    console.log('✅ PROJECT SYNC: Definindo projeto atual:', project.name);
    setCurrentProject(project);
  };

  // CORREÇÃO: Verificação de existência melhorada
  const projectExistsSafe = (projectId: string): boolean => {
    if (!projectId || !state.projects.length) {
      return false;
    }
    
    const exists = state.projects.some(p => p.id === projectId);
    console.log('🔍 PROJECT SYNC: Verificando existência:', { projectId, exists, totalProjects: state.projects.length });
    return exists;
  };

  // CORREÇÃO: Busca de projeto melhorada
  const getProjectByIdSafe = (projectId: string) => {
    if (!projectId || !state.projects.length) {
      return null;
    }
    
    const project = state.projects.find(p => p.id === projectId);
    console.log('🔍 PROJECT SYNC: Buscando projeto:', { projectId, found: !!project });
    return project || null;
  };

  return {
    // Estado
    projects: state.projects,
    currentProject: state.currentProject,
    isLoading: state.isLoading,
    error: state.error,
    lastSync: state.lastSync,
    
    // Ações
    loadProjects,
    setCurrentProject: setCurrentProjectSafe,
    getProjectById: getProjectByIdSafe,
    projectExists: projectExistsSafe,
    
    // Utilities
    forceRefresh: () => {
      console.log('🔄 PROJECT SYNC: Forçando refresh');
      return loadProjects(true);
    },
    clearCurrentProject: () => {
      console.log('🧹 PROJECT SYNC: Limpando projeto atual');
      setCurrentProject(null);
    }
  };
};
