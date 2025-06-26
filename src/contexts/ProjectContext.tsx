
import React, { createContext, useContext, ReactNode } from 'react';
import { Project, ProjectContextType } from '@/types/project';
import { useProjectSync } from '@/hooks/useProjectSync';
import { useProjectUpload } from '@/hooks/useProjectUpload';

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

  const { uploadProject } = useProjectUpload(setCurrentProject);

  const loadUserProjects = async (): Promise<Project[]> => {
    console.log('📋 PROJECT CONTEXT: Delegando carregamento para useProjectSync');
    return await loadProjects(true);
  };

  const clearAllProjects = () => {
    console.log('🧹 PROJECT CONTEXT: Limpando todos os projetos');
    clearCurrentProject();
  };

  return (
    <ProjectContext.Provider value={{
      currentProject,
      isLoading,
      uploadProject,
      setCurrentProject,
      loadUserProjects,
      clearAllProjects,
      requiresAuth: false, // Será gerenciado pelo useProjectSync
    }}>
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
