
import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useProjectOperations } from '@/hooks/useProjectOperations';
import { useProjectState } from '@/hooks/useProjectState';
import { ProjectContextType } from '@/types/project';

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const { uploadProject, loadUserProjects } = useProjectOperations();
  const {
    currentProject,
    projects,
    isLoading,
    setCurrentProject,
    setProjects,
    setIsLoading,
  } = useProjectState();

  // Enhanced upload function that updates state
  const enhancedUploadProject = async (file: File, projectName: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const success = await uploadProject(file, projectName);
      if (success) {
        // Reload projects after successful upload
        const updatedProjects = await loadUserProjects();
        setProjects(updatedProjects);
        
        // Set the most recent project as current if we don't have one
        if (!currentProject && updatedProjects.length > 0) {
          setCurrentProject(updatedProjects[0]);
        }
      }
      return success;
    } finally {
      setIsLoading(false);
    }
  };

  // Enhanced load function that updates state
  const enhancedLoadUserProjects = async () => {
    const projectsData = await loadUserProjects();
    setProjects(projectsData);
    
    // Se não tiver projeto atual mas tiver projetos, pegar o mais recente
    if (!currentProject && projectsData && projectsData.length > 0) {
      setCurrentProject(projectsData[0]);
      console.log('Projeto mais recente definido como atual:', projectsData[0]);
    }
    
    return projectsData;
  };

  // Load user projects when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      enhancedLoadUserProjects();
    }
  }, [isAuthenticated]);

  return (
    <ProjectContext.Provider value={{
      currentProject,
      projects,
      isLoading,
      uploadProject: enhancedUploadProject,
      setCurrentProject,
      loadUserProjects: enhancedLoadUserProjects,
      requiresAuth: !isAuthenticated,
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
