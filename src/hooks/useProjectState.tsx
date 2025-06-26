
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
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  // Obter projeto por ID
  const getProjectById = useCallback((projectId: string): Project | null => {
    const project = state.projects.find(p => p.id === projectId);
    debugLog('🔍 Buscando projeto por ID', { projectId, found: !!project });
    return project || null;
  }, [state.projects, debugLog]);

  // Verificar se projeto existe
  const projectExists = useCallback((projectId: string): boolean => {
    const exists = state.projects.some(p => p.id === projectId);
    debugLog('✅ Verificando existência do projeto', { projectId, exists });
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
