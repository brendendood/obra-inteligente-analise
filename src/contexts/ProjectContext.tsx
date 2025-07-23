import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Project, ProjectContextType } from '@/types/project';
import { useProjectStorage } from '@/hooks/useProjectStorage';
import { useProjectUpload } from '@/hooks/useProjectUpload';
import { useProjectValidation } from '@/hooks/useProjectValidation';

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider = ({ children }: { children: ReactNode }) => {
  const [currentProject, setCurrentProjectState] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const { user, isAuthenticated, loading } = useAuth();
  
  const { saveProjectToStorage, getProjectFromStorage, clearProjectFromStorage } = useProjectStorage();
  const { validateProject } = useProjectValidation();

  const clearAllProjects = useCallback(() => {
    console.log('🧹 PROJECT CONTEXT: Limpando todos os projetos');
    setCurrentProjectState(null);
    clearProjectFromStorage();
  }, [clearProjectFromStorage]);

  const setCurrentProject = useCallback((project: Project | null) => {
    console.log('📌 PROJECT CONTEXT: Definindo projeto atual:', project?.name || 'null');
    setCurrentProjectState(project);
    if (project) {
      saveProjectToStorage(project);
    } else {
      clearProjectFromStorage();
    }
  }, [saveProjectToStorage, clearProjectFromStorage]);

  const uploadProject = useCallback(async (file: File, projectName: string): Promise<boolean> => {
    console.log('📤 PROJECT CONTEXT: Upload bem-sucedido:', projectName);
    return true;
  }, []);

  // REMOVER useEffect que pode causar loops - dados vêm do Layout agora
  // useEffect(() => {
  //   if (!loading && isAuthenticated) {
  //     const savedProject = getProjectFromStorage();
  //     if (savedProject && validateProject(savedProject)) {
  //       console.log('✅ PROJECT CONTEXT: Projeto salvo válido encontrado:', savedProject.name);
  //       setCurrentProjectState(savedProject);
  //     }
  //   }
  // }, [loading, isAuthenticated, getProjectFromStorage, validateProject]);

  const loadUserProjects = useCallback(async (): Promise<Project[]> => {
    console.log('📋 PROJECT CONTEXT: Método legado - retornando array vazio');
    return [];
  }, []);

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