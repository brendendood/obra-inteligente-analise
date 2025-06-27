
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

  // Limpar cache ao inicializar
  useEffect(() => {
    console.log('🧹 PROJECT SYNC: Limpando cache inicial');
    
    // Limpar localStorage problemático
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.includes('supabase') || key.includes('project') || key.includes('cache'))) {
        if (key !== 'maden_current_project') { // Manter apenas o projeto atual
          keysToRemove.push(key);
        }
      }
    }
    
    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
      debugLog('🧹 Cache removido:', key);
    });
    
    // Limpar sessionStorage também
    sessionStorage.clear();
    debugLog('🧹 SessionStorage limpo');
    
  }, [debugLog]);

  // Carregar projetos quando auth estiver pronto
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      console.log('🔄 PROJECT SYNC: Carregando projetos após autenticação');
      // Forçar carregamento sem cache
      loadProjects(true);
    }
  }, [authLoading, isAuthenticated, loadProjects]);

  // Restaurar projeto salvo quando projetos carregarem
  useEffect(() => {
    if (state.projects.length > 0 && !state.currentProject) {
      console.log('🔄 PROJECT SYNC: Tentando restaurar projeto salvo');
      restoreSavedProject();
    }
  }, [state.projects.length, state.currentProject, restoreSavedProject]);

  // Função para limpar todos os caches
  const clearAllCaches = () => {
    console.log('🧹 PROJECT SYNC: Limpeza completa de cache');
    
    // Limpar localStorage
    const projectKeys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.includes('maden')) {
        projectKeys.push(key);
      }
    }
    projectKeys.forEach(key => localStorage.removeItem(key));
    
    // Limpar sessionStorage
    sessionStorage.clear();
    
    // Limpar estado atual
    updateProjectsState({
      projects: [],
      currentProject: null,
      isLoading: false,
      error: null,
      lastSync: 0
    });
    
    console.log('✅ PROJECT SYNC: Cache completamente limpo');
  };

  // Função melhorada para definir projeto atual
  const setCurrentProjectSafe = (project: any) => {
    if (!project) {
      console.log('🔄 PROJECT SYNC: Limpando projeto atual');
      setCurrentProject(null);
      localStorage.removeItem('maden_current_project');
      return;
    }

    console.log('✅ PROJECT SYNC: Definindo projeto atual:', project.name);
    setCurrentProject(project);
    
    // Garantir que o projeto seja salvo corretamente no localStorage
    try {
      localStorage.setItem('maden_current_project', JSON.stringify({
        id: project.id,
        name: project.name,
        timestamp: Date.now()
      }));
    } catch (error) {
      console.error('❌ PROJECT SYNC: Erro ao salvar no localStorage:', error);
    }
  };

  // Verificação de existência melhorada
  const projectExistsSafe = (projectId: string): boolean => {
    if (!projectId || !state.projects.length) {
      return false;
    }
    
    const exists = state.projects.some(p => p.id === projectId);
    console.log('🔍 PROJECT SYNC: Verificando existência:', { 
      projectId: projectId.substring(0, 8) + '...', 
      exists, 
      totalProjects: state.projects.length 
    });
    return exists;
  };

  // Busca de projeto melhorada
  const getProjectByIdSafe = (projectId: string) => {
    if (!projectId || !state.projects.length) {
      return null;
    }
    
    const project = state.projects.find(p => p.id === projectId);
    console.log('🔍 PROJECT SYNC: Buscando projeto:', { 
      projectId: projectId.substring(0, 8) + '...', 
      found: !!project,
      projectName: project?.name || 'não encontrado'
    });
    return project || null;
  };

  // Função para forçar sincronização completa
  const forceSync = async () => {
    console.log('🔄 PROJECT SYNC: Forçando sincronização completa');
    
    // Limpar cache primeiro
    clearAllCaches();
    
    // Aguardar um pouco
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Recarregar projetos
    const freshProjects = await loadProjects(true);
    
    // Se há um projeto atual salvo, tentar restaurá-lo
    const savedProject = localStorage.getItem('maden_current_project');
    if (savedProject && freshProjects.length > 0) {
      try {
        const parsed = JSON.parse(savedProject);
        const foundProject = freshProjects.find(p => p.id === parsed.id);
        if (foundProject) {
          console.log('✅ PROJECT SYNC: Restaurando projeto após sync:', foundProject.name);
          setCurrentProject(foundProject);
        } else {
          console.log('❌ PROJECT SYNC: Projeto salvo não encontrado, limpando');
          localStorage.removeItem('maden_current_project');
        }
      } catch (error) {
        console.error('❌ PROJECT SYNC: Erro ao restaurar projeto salvo:', error);
        localStorage.removeItem('maden_current_project');
      }
    }
    
    return freshProjects;
  };

  return {
    // Estado
    projects: state.projects,
    currentProject: state.currentProject,
    isLoading: state.isLoading,
    error: state.error,
    lastSync: state.lastSync,
    
    // Ações
    loadProjects: (force = false) => loadProjects(force),
    setCurrentProject: setCurrentProjectSafe,
    getProjectById: getProjectByIdSafe,
    projectExists: projectExistsSafe,
    
    // Utilities
    forceRefresh: forceSync,
    clearCache: clearAllCaches,
    clearCurrentProject: () => {
      console.log('🧹 PROJECT SYNC: Limpando projeto atual');
      setCurrentProject(null);
      localStorage.removeItem('maden_current_project');
    }
  };
};
