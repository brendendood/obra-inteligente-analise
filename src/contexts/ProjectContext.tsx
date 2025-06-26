
import React, { createContext, useContext, ReactNode, useMemo } from 'react';
import { Project, ProjectContextType } from '@/types/project';
import { useProjectSync } from '@/hooks/useProjectSync';
import { useProjectUpload } from '@/hooks/useProjectUpload';
import { useNotificationControl } from '@/hooks/useNotificationControl';

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: ReactNode }) {
  const {
    projects,
    currentProject,
    isLoading,
    setCurrentProject,
    loadProjects,
    clearCurrentProject
  } = useProjectSync();

  const { showControlledSuccess } = useNotificationControl();
  const { uploadProject } = useProjectUpload(setCurrentProject);

  const loadUserProjects = async (): Promise<Project[]> => {
    console.log('📋 PROJECT CONTEXT: Delegando carregamento para useProjectSync');
    const result = await loadProjects(true);
    
    if (result.length > 0) {
      showControlledSuccess(
        "✅ Projetos sincronizados",
        `${result.length} projetos carregados com sucesso.`
      );
    }
    
    return result;
  };

  const clearAllProjects = () => {
    console.log('🧹 PROJECT CONTEXT: Limpando todos os projetos');
    clearCurrentProject();
  };

  // Memoizar o contexto para evitar re-renders desnecessários
  const contextValue = useMemo(() => ({
    currentProject,
    isLoading,
    uploadProject,
    setCurrentProject,
    loadUserProjects,
    clearAllProjects,
    requiresAuth: false,
  }), [currentProject, isLoading, uploadProject, setCurrentProject]);

  return (
    <ProjectContext.Provider value={contextValue}>
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject() {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
}
