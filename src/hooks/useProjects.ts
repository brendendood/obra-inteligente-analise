/**
 * Unified Projects Hook
 * Single wrapper for project store with optimized selectors
 */

import { useUnifiedProjectStore } from '@/stores/unifiedProjectStore';
import { Project } from '@/types/project';

export function useProjects() {
  // Optimized selectors to prevent unnecessary re-renders
  const projects = useUnifiedProjectStore((state) => state.projects);
  const isLoading = useUnifiedProjectStore((state) => state.isLoading);
  const error = useUnifiedProjectStore((state) => state.error);
  
  // Actions
  const fetchProjects = useUnifiedProjectStore((state) => state.fetchProjects);
  const deleteProject = useUnifiedProjectStore((state) => state.deleteProject);
  const addProject = useUnifiedProjectStore((state) => state.addProject);
  const updateProject = useUnifiedProjectStore((state) => state.updateProject);
  const clearError = useUnifiedProjectStore((state) => state.clearError);
  const clearCache = useUnifiedProjectStore((state) => state.clearCache);
  const forceRefresh = useUnifiedProjectStore((state) => state.forceRefresh);
  const getProjectById = useUnifiedProjectStore((state) => state.getProjectById);

  return {
    // Data
    projects,
    isLoading,
    error,
    
    // Actions
    fetchProjects,
    deleteProject,
    addProject,
    updateProject,
    clearError,
    clearCache,
    forceRefresh,
    getProjectById,
    
    // Computed
    projectCount: projects.length,
    hasProjects: projects.length > 0,
  };
}

// Selector hooks for specific project queries
export function useProjectById(projectId: string): Project | undefined {
  return useUnifiedProjectStore((state) => 
    state.projects.find(p => p.id === projectId)
  );
}

export function useProjectCount(): number {
  return useUnifiedProjectStore((state) => state.projects.length);
}

export function useProjectsLoading(): boolean {
  return useUnifiedProjectStore((state) => state.isLoading);
}
