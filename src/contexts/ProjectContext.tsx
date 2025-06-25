
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
  const { user, isAuthenticated } = useAuth();
  
  const { saveProjectToStorage, getProjectFromStorage, clearProjectFromStorage } = useProjectStorage();
  const { validateProject } = useProjectValidation();
  const { loadUserProjects: loadProjects } = useProjectLoader();

  // Função para limpar todos os projetos do estado local
  const clearAllProjects = useCallback(() => {
    console.log('Limpando todos os projetos do estado local');
    setCurrentProjectState(null);
    clearProjectFromStorage();
  }, [clearProjectFromStorage]);

  // Função para atualizar o projeto atual com validação
  const setCurrentProject = useCallback((project: Project | null) => {
    console.log('Atualizando projeto atual:', project);
    setCurrentProjectState(project);
    saveProjectToStorage(project);
  }, [saveProjectToStorage]);

  const { uploadProject } = useProjectUpload(setCurrentProject);

  // Carregar e validar projeto do localStorage ao inicializar
  useEffect(() => {
    const validateAndLoadProject = async () => {
      if (isAuthenticated && user) {
        const savedProject = getProjectFromStorage();
        if (savedProject) {
          const validatedProject = await validateProject(savedProject);
          if (validatedProject) {
            console.log('Projeto validado e carregado do localStorage:', validatedProject);
            setCurrentProjectState(validatedProject);
          } else {
            console.log('Projeto do localStorage não existe mais no DB, limpando...');
            clearAllProjects();
          }
        }
      } else {
        clearAllProjects();
      }
    };

    if (user) {
      validateAndLoadProject();
    }
  }, [isAuthenticated, user, getProjectFromStorage, validateProject, clearAllProjects]);

  const loadUserProjects = useCallback(async (): Promise<Project[]> => {
    const projects = await loadProjects();
    
    // Se não há projetos no DB, limpar estado local
    if (!projects || projects.length === 0) {
      console.log('Nenhum projeto encontrado no DB, limpando estado local');
      clearAllProjects();
      return [];
    }
    
    // Se há projetos, mas não temos projeto atual, definir o mais recente
    if (!currentProject && projects.length > 0) {
      console.log('Definindo projeto mais recente como atual:', projects[0].name);
      setCurrentProject(projects[0]);
    }
    
    // Se temos projeto atual, verificar se ainda existe nos dados carregados
    if (currentProject) {
      const projectStillExists = projects.find(p => p.id === currentProject.id);
      if (!projectStillExists) {
        console.log('Projeto atual não existe mais, limpando...');
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
