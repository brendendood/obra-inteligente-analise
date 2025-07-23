
import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Project, ProjectContextType } from '@/types/project';
import { useProjectStorage } from '@/hooks/useProjectStorage';
import { useProjectUpload } from '@/hooks/useProjectUpload';
import { useProjectValidation } from '@/hooks/useProjectValidation';
import { useOptimizedProjectStore } from '@/stores/optimizedProjectStore';

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [currentProject, setCurrentProjectState] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user, isAuthenticated, loading } = useAuth();
  
  const { saveProjectToStorage, getProjectFromStorage, clearProjectFromStorage } = useProjectStorage();
  const { validateProject } = useProjectValidation();
  // Note: allProjects removido para evitar loops de re-renderização

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
    const validateSavedProject = () => {
      console.log('🔍 PROJECT CONTEXT: Validando projeto salvo', { loading, isAuthenticated, userId: user?.id });
      
      if (loading) return;
      
      if (!isAuthenticated || !user) {
        console.log('🚫 PROJECT CONTEXT: Não autenticado, limpando');
        clearAllProjects();
        return;
      }

      const savedProject = getProjectFromStorage();
      if (savedProject) {
        console.log('📦 PROJECT CONTEXT: Validando projeto do localStorage:', savedProject.name);
        
        // Verificar se o projeto ainda existe na lista atual
        const { projects } = useOptimizedProjectStore.getState();
        const projectStillExists = projects && projects.some(p => p.id === savedProject.id);
        
        if (projectStillExists) {
          // Usar dados mais recentes da lista
          const updatedProject = projects.find(p => p.id === savedProject.id);
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
    };

    if (!loading) {
      validateSavedProject();
    }
  }, [loading, isAuthenticated, user?.id, getProjectFromStorage, clearAllProjects, saveProjectToStorage]);

  const loadUserProjects = useCallback(async (): Promise<Project[]> => {
    console.log('📋 PROJECT CONTEXT: Retornando projetos do Zustand store');
    
    // Capturar projetos atuais no momento da chamada (não como dependência)
    const { projects } = useOptimizedProjectStore.getState();
    
    if (!projects || projects.length === 0) {
      console.log('📭 PROJECT CONTEXT: Nenhum projeto encontrado');
      return [];
    }
    
    return projects;
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
