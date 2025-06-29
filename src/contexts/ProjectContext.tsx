
import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Project, ProjectContextType } from '@/types/project';
import { useProjectStorage } from '@/hooks/useProjectStorage';
import { useProjectUpload } from '@/hooks/useProjectUpload';
import { useProjectValidation } from '@/hooks/useProjectValidation';
import { useProjectStore } from '@/stores/projectStore';

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [currentProject, setCurrentProjectState] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user, isAuthenticated, loading } = useAuth();
  
  const { saveProjectToStorage, getProjectFromStorage, clearProjectFromStorage } = useProjectStorage();
  const { validateProject } = useProjectValidation();
  const { projects: allProjects } = useProjectStore();

  console.log('🎯 PROJECT CONTEXT: Inicializando', { 
    loading, 
    isAuthenticated, 
    userId: user?.id,
    projectsCount: allProjects.length 
  });

  const clearAllProjects = useCallback(() => {
    console.log('🧹 PROJECT CONTEXT: Limpando todos os projetos');
    setCurrentProjectState(null);
    clearProjectFromStorage();
  }, [clearProjectFromStorage]);

  const setCurrentProject = useCallback((project: Project | null) => {
    console.log('📌 PROJECT CONTEXT: Atualizando projeto atual:', project?.name || 'null');
    setCurrentProjectState(project);
    saveProjectToStorage(project);
  }, [saveProjectToStorage]);

  const { uploadProject } = useProjectUpload(setCurrentProject);

  // Validar projeto salvo quando auth estiver pronto
  useEffect(() => {
    if (loading) return;
    
    if (!isAuthenticated || !user) {
      console.log('🚫 PROJECT CONTEXT: Não autenticado, limpando');
      clearAllProjects();
      return;
    }

    const savedProject = getProjectFromStorage();
    if (savedProject && allProjects.length > 0) {
      const projectStillExists = allProjects.some(p => p.id === savedProject.id);
      
      if (projectStillExists) {
        const updatedProject = allProjects.find(p => p.id === savedProject.id);
        if (updatedProject) {
          console.log('✅ PROJECT CONTEXT: Projeto atualizado com dados recentes');
          setCurrentProjectState(updatedProject);
          saveProjectToStorage(updatedProject);
        }
      } else {
        console.log('❌ PROJECT CONTEXT: Projeto não existe mais, limpando');
        clearAllProjects();
      }
    }
  }, [loading, isAuthenticated, user?.id, allProjects.length]);

  const loadUserProjects = useCallback(async (): Promise<Project[]> => {
    console.log('📋 PROJECT CONTEXT: Retornando projetos do store');
    return allProjects;
  }, [allProjects]);

  const contextValue: ProjectContextType = {
    currentProject,
    isLoading,
    uploadProject,
    setCurrentProject,
    loadUserProjects,
    clearAllProjects,
    requiresAuth: !isAuthenticated,
  };

  return (
    <ProjectContext.Provider value={contextValue}>
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject() {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    // Em vez de lançar erro, retornar um contexto padrão
    console.warn('⚠️ useProject usado fora do ProjectProvider, retornando valores padrão');
    return {
      currentProject: null,
      isLoading: false,
      uploadProject: async () => ({ success: false, error: 'Context not available' }),
      setCurrentProject: () => {},
      loadUserProjects: async () => [],
      clearAllProjects: () => {},
      requiresAuth: true,
    };
  }
  return context;
}
