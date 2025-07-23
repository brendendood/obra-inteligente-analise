import { useEffect } from 'react';
import { useProjectStore } from '@/stores/projectStore';
import { useProject } from '@/contexts/ProjectContext';

/**
 * Hook para sincronizar automaticamente o contexto do projeto
 * com mudanças no store (exclusões, atualizações, etc.)
 */
export const useProjectSync = () => {
  const { projects } = useProjectStore();
  const { currentProject, setCurrentProject } = useProject();

  useEffect(() => {
    if (!currentProject) return;

    // Verificar se o projeto atual ainda existe
    const projectExists = projects.find(p => p.id === currentProject.id);
    
    if (!projectExists) {
      console.log('🔄 PROJECT SYNC: Projeto atual não existe mais, limpando contexto');
      setCurrentProject(null);
    } else if (projectExists.updated_at !== currentProject.updated_at) {
      // Atualizar com dados mais recentes
      console.log('🔄 PROJECT SYNC: Atualizando projeto com dados mais recentes');
      setCurrentProject(projectExists);
    }
  }, [projects, currentProject, setCurrentProject]);

  return {
    isProjectInSync: currentProject ? projects.some(p => p.id === currentProject.id) : true,
    totalProjects: projects.length,
  };
};