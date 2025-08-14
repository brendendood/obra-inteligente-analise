
import React, { useState, useEffect, useCallback, useRef, useContext, createContext } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Project, ProjectContextType } from '@/types/project';
import { useProjectStorage } from '@/hooks/useProjectStorage';
import { useProjectUpload } from '@/hooks/useProjectUpload';
import { useProjectValidation } from '@/hooks/useProjectValidation';
import { useUnifiedProjectStore } from '@/stores/unifiedProjectStore';

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

// Safe hook check
const isSafeToUseHooks = (): boolean => {
  try {
    const testRef = useRef(null);
    return true;
  } catch (error) {
    console.error('🔴 CRITICAL: React hooks not available in ProjectProvider:', error);
    return false;
  }
};

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  // Emergency fallback if React hooks are corrupted
  if (!isSafeToUseHooks()) {
    console.error('🔴 EMERGENCY: ProjectProvider using fallback');
    return (
      <ProjectContext.Provider value={undefined}>
        {children}
      </ProjectContext.Provider>
    );
  }

  let currentProject: any;
  let setCurrentProjectState: any;
  let isLoading: any;
  let setIsLoading: any;

  try {
    [currentProject, setCurrentProjectState] = useState<Project | null>(null);
    [isLoading, setIsLoading] = useState(false);
  } catch (error) {
    console.error('🔴 CRITICAL: useState failed in ProjectProvider:', error);
    return (
      <ProjectContext.Provider value={undefined}>
        {children}
      </ProjectContext.Provider>
    );
  }
  const { user, isAuthenticated, loading } = useAuth();
  
  const { saveProjectToStorage, getProjectFromStorage, clearProjectFromStorage } = useProjectStorage();
  const { validateProject } = useProjectValidation();
  const { projects: allProjects } = useUnifiedProjectStore();

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
        const projectStillExists = allProjects.some(p => p.id === savedProject.id);
        
        if (projectStillExists) {
          // Usar dados mais recentes da lista
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
    };

    if (!loading && allProjects.length >= 0) {
      validateSavedProject();
    }
  }, [loading, isAuthenticated, user?.id, allProjects, getProjectFromStorage, clearAllProjects, saveProjectToStorage]);

  const loadUserProjects = useCallback(async (): Promise<Project[]> => {
    console.log('📋 PROJECT CONTEXT: Retornando projetos do Zustand store');
    
    if (!allProjects || allProjects.length === 0) {
      console.log('📭 PROJECT CONTEXT: Nenhum projeto encontrado');
      clearAllProjects();
      return [];
    }
    
    // Se não há projeto atual, definir o mais recente
    if (!currentProject && allProjects.length > 0) {
      console.log('📌 PROJECT CONTEXT: Definindo projeto mais recente como atual');
      setCurrentProject(allProjects[0]);
    }
    
    // Verificar se projeto atual ainda existe
    if (currentProject) {
      const projectExists = allProjects.find(p => p.id === currentProject.id);
      if (!projectExists) {
        console.log('🗑️ PROJECT CONTEXT: Projeto atual não existe mais');
        clearAllProjects();
      }
    }
    
    return allProjects;
  }, [currentProject, setCurrentProject, clearAllProjects, allProjects]);

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
