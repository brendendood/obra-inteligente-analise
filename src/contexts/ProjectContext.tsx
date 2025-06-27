
import React, { createContext, useContext, ReactNode, useMemo, useEffect } from 'react';
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
    clearCurrentProject,
    clearCache
  } = useProjectSync();

  const { showControlledSuccess } = useNotificationControl();
  const { uploadProject } = useProjectUpload(setCurrentProject);

  // Limpeza de cache na inicialização
  useEffect(() => {
    console.log('🔄 PROJECT CONTEXT: Inicializando contexto');
    
    // Verificar integridade do localStorage
    try {
      const saved = localStorage.getItem('maden_current_project');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (!parsed.id || !parsed.name || !parsed.timestamp) {
          console.log('🧹 PROJECT CONTEXT: Dados corrompidos no localStorage, limpando');
          localStorage.removeItem('maden_current_project');
        }
      }
    } catch (error) {
      console.log('🧹 PROJECT CONTEXT: Erro ao ler localStorage, limpando');
      localStorage.removeItem('maden_current_project');
    }
  }, []);

  const loadUserProjects = async (): Promise<Project[]> => {
    console.log('📋 PROJECT CONTEXT: Carregando projetos do usuário');
    
    try {
      const result = await loadProjects(true);
      
      if (result.length > 0) {
        showControlledSuccess(
          "✅ Projetos sincronizados",
          `${result.length} projeto(s) carregado(s) com sucesso.`
        );
      }
      
      return result;
    } catch (error) {
      console.error('❌ PROJECT CONTEXT: Erro ao carregar projetos:', error);
      return [];
    }
  };

  const clearAllProjects = () => {
    console.log('🧹 PROJECT CONTEXT: Limpando todos os projetos');
    clearCurrentProject();
    clearCache();
  };

  // Função para refresh completo
  const refreshProjects = async () => {
    console.log('🔄 PROJECT CONTEXT: Fazendo refresh completo');
    clearCache();
    await loadProjects(true);
  };

  // Memoizar o contexto para evitar re-renders desnecessários
  const contextValue = useMemo(() => ({
    currentProject,
    isLoading,
    uploadProject,
    setCurrentProject,
    loadUserProjects,
    clearAllProjects,
    refreshProjects,
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
