/**
 * Project Sync Hook
 * Sincroniza projectId da URL com ProjectContext
 */

import { useCallback, useEffect } from 'react';
import { useProject } from '@/contexts/ProjectContext';
import { useUnifiedProjectStore } from '@/stores/unifiedProjectStore';
import { useParams } from 'react-router-dom';

export const useProjectSync = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { currentProject, setCurrentProject } = useProject();
  const { getProjectById } = useUnifiedProjectStore();

  // Sincronizar projeto atual com URL
  const syncProjectWithUrl = useCallback(async () => {
    if (!projectId) {
      setCurrentProject(null);
      return;
    }

    // Se já temos o projeto correto, não fazer nada
    if (currentProject?.id === projectId) {
      return;
    }

    // Obter projeto do Zustand store
    const project = getProjectById(projectId);
    if (project) {
      setCurrentProject(project);
    } else {
      setCurrentProject(null);
    }
  }, [projectId, currentProject, getProjectById, setCurrentProject]);

  // Auto-sync quando URL muda
  useEffect(() => {
    syncProjectWithUrl();
  }, [syncProjectWithUrl]);

  // Validar se projeto atual ainda existe
  const validateCurrentProject = useCallback(() => {
    if (!currentProject) return true;

    const projectExists = getProjectById(currentProject.id);
    if (!projectExists) {
      setCurrentProject(null);
      return false;
    }

    return true;
  }, [currentProject, getProjectById, setCurrentProject]);

  return {
    currentProject,
    isProjectLoaded: !!currentProject,
    syncProjectWithUrl,
    validateCurrentProject,
    setCurrentProject,
  };
};
