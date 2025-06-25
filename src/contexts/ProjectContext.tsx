
import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Project, ProjectContextType } from '@/types/project';
import { useProjectStorage } from '@/hooks/useProjectStorage';
import { useProjectUpload } from '@/hooks/useProjectUpload';
import { useProjectValidation } from '@/hooks/useProjectValidation';
import { useProjectLoader } from '@/hooks/useProjectLoader';

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [currentProject, setCurrentProjectState] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user, isAuthenticated, loading } = useAuth();
  
  const { saveProjectToStorage, getProjectFromStorage, clearProjectFromStorage } = useProjectStorage();
  const { validateProject } = useProjectValidation();
  const { loadUserProjects: loadProjects } = useProjectLoader();

  const clearAllProjects = useCallback(() => {
    console.log('🧹 ProjectContext: limpando todos os projetos');
    setCurrentProjectState(null);
    clearProjectFromStorage();
  }, [clearProjectFromStorage]);

  const setCurrentProject = useCallback((project: Project | null) => {
    console.log('📌 ProjectContext: atualizando projeto atual:', project?.name || 'null');
    setCurrentProjectState(project);
    saveProjectToStorage(project);
  }, [saveProjectToStorage]);

  const { uploadProject } = useProjectUpload(setCurrentProject);

  // Validar projeto salvo quando auth estiver pronto
  useEffect(() => {
    const validateSavedProject = async () => {
      console.log('🔍 ProjectContext: validando projeto salvo', { loading, isAuthenticated, userId: user?.id });
      
      if (loading) return;
      
      if (!isAuthenticated || !user) {
        console.log('🚫 ProjectContext: não autenticado, limpando');
        clearAllProjects();
        return;
      }

      const savedProject = getProjectFromStorage();
      if (savedProject) {
        console.log('📦 ProjectContext: validando projeto do localStorage:', savedProject.name);
        const validatedProject = await validateProject(savedProject);
        if (validatedProject) {
          console.log('✅ ProjectContext: projeto validado');
          setCurrentProjectState(validatedProject);
        } else {
          console.log('❌ ProjectContext: projeto inválido, limpando');
          clearAllProjects();
        }
      }
    };

    if (!loading) {
      validateSavedProject();
    }
  }, [loading, isAuthenticated, user?.id, getProjectFromStorage, validateProject, clearAllProjects]);

  const loadUserProjects = useCallback(async (): Promise<Project[]> => {
    console.log('📋 ProjectContext: carregando projetos do usuário');
    const projects = await loadProjects();
    
    if (!projects || projects.length === 0) {
      console.log('📭 ProjectContext: nenhum projeto encontrado');
      clearAllProjects();
      return [];
    }
    
    // Se não há projeto atual, definir o mais recente
    if (!currentProject && projects.length > 0) {
      console.log('📌 ProjectContext: definindo projeto mais recente como atual');
      setCurrentProject(projects[0]);
    }
    
    // Verificar se projeto atual ainda existe
    if (currentProject) {
      const projectExists = projects.find(p => p.id === currentProject.id);
      if (!projectExists) {
        console.log('🗑️ ProjectContext: projeto atual não existe mais');
        clearAllProjects();
      }
    }
    
    return projects;
  }, [currentProject, setCurrentProject, clearAllProjects, loadProjects]);

  return (
    <ProjectContext.Provider value={{
      currentProject,
      isLoading,
      uploadProject,
      setCurrentProject,
      loadUserProjects,
      clearAllProjects,
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
