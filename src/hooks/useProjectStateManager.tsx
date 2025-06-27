
import { useCallback, useEffect } from 'react';
import { useProject } from '@/contexts/ProjectContext';
import { useProjectsConsistency } from '@/hooks/useProjectsConsistency';
import { useParams } from 'react-router-dom';
import { Project } from '@/types/project';

interface UseProjectStateManagerOptions {
  autoLoadFromUrl?: boolean;
  validateOnMount?: boolean;
}

export const useProjectStateManager = (options: UseProjectStateManagerOptions = {}) => {
  const { autoLoadFromUrl = true, validateOnMount = true } = options;
  const { projectId } = useParams<{ projectId: string }>();
  const { currentProject, setCurrentProject } = useProject();
  const { getProject, projectExists, forceRefresh } = useProjectsConsistency();

  // Sincronizar projeto atual com URL
  const syncProjectWithUrl = useCallback(async () => {
    if (!projectId || !autoLoadFromUrl) return;

    console.log('🔄 STATE MANAGER: Sincronizando projeto com URL', { projectId });

    // Se já temos o projeto correto, não fazer nada
    if (currentProject?.id === projectId) {
      console.log('✅ STATE MANAGER: Projeto já está sincronizado');
      return;
    }

    // Verificar se projeto existe
    if (!projectExists(projectId)) {
      console.warn('⚠️ STATE MANAGER: Projeto não encontrado, forçando refresh');
      await forceRefresh();
      
      // Verificar novamente após refresh
      if (!projectExists(projectId)) {
        console.error('❌ STATE MANAGER: Projeto não existe após refresh');
        setCurrentProject(null);
        return;
      }
    }

    // Carregar projeto
    const project = getProject(projectId);
    if (project) {
      console.log('✅ STATE MANAGER: Projeto carregado:', project.name);
      setCurrentProject(project);
    }
  }, [projectId, currentProject, projectExists, getProject, setCurrentProject, forceRefresh, autoLoadFromUrl]);

  // Validar consistência do projeto atual
  const validateCurrentProject = useCallback(() => {
    if (!currentProject || !validateOnMount) return true;

    console.log('🔍 STATE MANAGER: Validando projeto atual:', currentProject.name);

    // Verificar se projeto ainda existe
    if (!projectExists(currentProject.id)) {
      console.warn('⚠️ STATE MANAGER: Projeto atual não existe mais');
      setCurrentProject(null);
      return false;
    }

    // Verificar se dados estão atualizados
    const latestProject = getProject(currentProject.id);
    if (latestProject && latestProject.updated_at !== currentProject.updated_at) {
      console.log('🔄 STATE MANAGER: Atualizando projeto com dados mais recentes');
      setCurrentProject(latestProject);
    }

    return true;
  }, [currentProject, projectExists, getProject, setCurrentProject, validateOnMount]);

  // Auto-sync na montagem e mudanças de URL
  useEffect(() => {
    syncProjectWithUrl();
  }, [syncProjectWithUrl]);

  // Validar na montagem
  useEffect(() => {
    validateCurrentProject();
  }, [validateCurrentProject]);

  const refreshCurrentProject = useCallback(async () => {
    if (!currentProject) return null;

    console.log('🔄 STATE MANAGER: Atualizando projeto atual');
    await forceRefresh();
    
    const updatedProject = getProject(currentProject.id);
    if (updatedProject) {
      setCurrentProject(updatedProject);
      return updatedProject;
    }
    
    return null;
  }, [currentProject, forceRefresh, getProject, setCurrentProject]);

  const clearCurrentProject = useCallback(() => {
    console.log('🧹 STATE MANAGER: Limpando projeto atual');
    setCurrentProject(null);
  }, [setCurrentProject]);

  return {
    currentProject,
    isProjectLoaded: !!currentProject,
    isProjectValid: currentProject ? projectExists(currentProject.id) : false,
    syncProjectWithUrl,
    validateCurrentProject,
    refreshCurrentProject,
    clearCurrentProject,
    setCurrentProject
  };
};
