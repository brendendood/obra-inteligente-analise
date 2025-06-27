
import { useState, useCallback } from 'react';
import { Project } from '@/types/project';

interface ProjectSyncState {
  projects: Project[];
  currentProject: Project | null;
  isLoading: boolean;
  lastSync: number;
  error: string | null;
}

export const useProjectState = () => {
  const [state, setState] = useState<ProjectSyncState>({
    projects: [],
    currentProject: null,
    isLoading: true,
    lastSync: 0,
    error: null
  });

  // Debug logger
  const debugLog = useCallback((action: string, data?: any) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`🔄 PROJECT_STATE [${new Date().toISOString()}]: ${action}`, data);
    }
  }, []);

  // Definir projeto atual
  const setCurrentProject = useCallback((project: Project | null) => {
    debugLog('📌 Definindo projeto atual', { 
      projectId: project?.id, 
      projectName: project?.name 
    });

    setState(prev => ({ ...prev, currentProject: project }));

    // Salvar no localStorage para persistência
    if (project) {
      localStorage.setItem('maden_current_project', JSON.stringify({
        id: project.id,
        name: project.name,
        timestamp: Date.now()
      }));
    } else {
      localStorage.removeItem('maden_current_project');
    }
  }, [debugLog]);

  // Atualizar estado dos projetos
  const updateProjectsState = useCallback((updates: Partial<ProjectSyncState>) => {
    setState(prev => {
      const newState = { ...prev, ...updates };
      
      // Log para debug
      if (updates.projects) {
        console.log('📊 PROJECT_STATE: Atualizando projetos:', {
          antes: prev.projects.length,
          depois: updates.projects.length,
          projetos: updates.projects.map(p => ({ id: p.id, name: p.name }))
        });
      }
      
      return newState;
    });
  }, []);

  // Obter projeto por ID
  const getProjectById = useCallback((projectId: string): Project | null => {
    if (!projectId || !state.projects.length) {
      debugLog('🔍 Buscando projeto por ID - sem projetos ou ID inválido', { projectId, projectsCount: state.projects.length });
      return null;
    }
    
    const project = state.projects.find(p => p.id === projectId);
    debugLog('🔍 Buscando projeto por ID', { 
      projectId, 
      found: !!project,
      projectsAvailable: state.projects.map(p => p.id)
    });
    return project || null;
  }, [state.projects, debugLog]);

  // Verificar se projeto existe
  const projectExists = useCallback((projectId: string): boolean => {
    if (!projectId || !state.projects.length) {
      debugLog('✅ Verificando existência - sem projetos ou ID inválido', { projectId, projectsCount: state.projects.length });
      return false;
    }
    
    const exists = state.projects.some(p => p.id === projectId);
    debugLog('✅ Verificando existência do projeto', { 
      projectId, 
      exists,
      projectsAvailable: state.projects.map(p => p.id)
    });
    return exists;
  }, [state.projects, debugLog]);

  return {
    state,
    debugLog,
    setCurrentProject,
    updateProjectsState,
    getProjectById,
    projectExists
  };
};
