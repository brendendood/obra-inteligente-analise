
import { useCallback, useEffect } from 'react';
import { useProject } from '@/contexts/ProjectContext';
import { useOptimizedProjectStore } from '@/stores/optimizedProjectStore';
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
  const { projects, getProjectById } = useOptimizedProjectStore();

  // Sincronizar projeto atual com URL
  const syncProjectWithUrl = useCallback(async () => {
    if (!projectId || !autoLoadFromUrl) return;

    console.log('🔄 STATE MANAGER: Sincronizando projeto com URL', { projectId });

    // Se já temos o projeto correto, não fazer nada
    if (currentProject?.id === projectId) {
      console.log('✅ STATE MANAGER: Projeto já está sincronizado');
      return;
    }

    // Obter projeto do Zustand store
    const project = getProjectById(projectId);
    if (project) {
      console.log('✅ STATE MANAGER: Projeto carregado:', project.name);
      setCurrentProject(project);
    } else {
      console.error('❌ STATE MANAGER: Projeto não encontrado');
      setCurrentProject(null);
    }
  }, [projectId, currentProject, getProjectById, setCurrentProject, autoLoadFromUrl]);

  // Validar consistência do projeto atual
  const validateCurrentProject = useCallback(() => {
    if (!currentProject || !validateOnMount) return true;

    console.log('🔍 STATE MANAGER: Validando projeto atual:', currentProject.name);

    // Verificar se projeto ainda existe
    const projectExists = getProjectById(currentProject.id);
    if (!projectExists) {
      console.warn('⚠️ STATE MANAGER: Projeto atual não existe mais');
      setCurrentProject(null);
      return false;
    }

    // Verificar se dados estão atualizados
    if (projectExists && projectExists.updated_at !== currentProject.updated_at) {
      console.log('🔄 STATE MANAGER: Atualizando projeto com dados mais recentes');
      setCurrentProject(projectExists);
    }

    return true;
  }, [currentProject, getProjectById, setCurrentProject, validateOnMount]);

  // REMOVER auto-sync que causa loops 
  // useEffect(() => {
  //   syncProjectWithUrl();
  // }, [syncProjectWithUrl]);

  // REMOVER validação automática que causa loops
  // useEffect(() => {
  //   validateCurrentProject();
  // }, [validateCurrentProject]);

  const refreshCurrentProject = useCallback(async () => {
    if (!currentProject) return null;

    console.log('🔄 STATE MANAGER: Atualizando projeto atual');
    
    const updatedProject = getProjectById(currentProject.id);
    if (updatedProject) {
      setCurrentProject(updatedProject);
      return updatedProject;
    }
    
    return null;
  }, [currentProject, getProjectById, setCurrentProject]);

  const clearCurrentProject = useCallback(() => {
    console.log('🧹 STATE MANAGER: Limpando projeto atual');
    setCurrentProject(null);
  }, [setCurrentProject]);

  return {
    currentProject,
    isProjectLoaded: !!currentProject,
    isProjectValid: currentProject ? !!getProjectById(currentProject.id) : false,
    syncProjectWithUrl,
    validateCurrentProject,
    refreshCurrentProject,
    clearCurrentProject,
    setCurrentProject
  };
};
