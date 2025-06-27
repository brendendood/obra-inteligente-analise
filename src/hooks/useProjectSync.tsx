
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

  // CORREÇÃO: Garantir que o projeto atual seja sempre válido
  useEffect(() => {
    if (state.currentProject && state.projects.length > 0) {
      const projectStillExists = state.projects.find(p => p.id === state.currentProject?.id);
      if (!projectStillExists) {
        console.log('⚠️ Projeto atual não existe mais, limpando...');
        setCurrentProject(null);
        localStorage.removeItem('maden_current_project');
      }
    }
  }, [state.projects, state.currentProject, setCurrentProject]);

  // CORREÇÃO: Função para definir projeto atual com melhor validação
  const setCurrentProjectSafe = (project: any) => {
    if (!project) {
      console.log('🔄 PROJECT SYNC: Limpando projeto atual');
      setCurrentProject(null);
      return;
    }

    // Verificar se o projeto existe na lista
    const projectExists = state.projects.find(p => p.id === project.id);
    if (!projectExists) {
      console.warn('⚠️ PROJECT SYNC: Tentativa de definir projeto inexistente:', project.id);
      return;
    }

    console.log('✅ PROJECT SYNC: Definindo projeto atual:', project.name);
    setCurrentProject(project);
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
    getProjectById,
    projectExists,
    
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
