
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useProject } from '@/contexts/ProjectContext';
import { useProjectStore } from '@/stores/projectStore';
import { AppLayout } from '@/components/layout/AppLayout';
import { UnifiedLoading } from '@/components/ui/unified-loading';

export const useProjectLoader = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { currentProject, setCurrentProject } = useProject();
  const { getProjectById } = useProjectStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProject = async () => {
      if (!projectId) {
        setLoading(false);
        return;
      }

      try {
        const project = getProjectById(projectId);
        if (project) {
          setCurrentProject(project);
          setError(null);
        } else {
          // Aguardar um pouco para os projetos carregarem
          setTimeout(() => {
            const retryProject = getProjectById(projectId);
            if (retryProject) {
              setCurrentProject(retryProject);
              setError(null);
            }
          }, 1000);
        }
      } catch (err) {
        console.error('Erro ao carregar projeto:', err);
      } finally {
        setLoading(false);
      }
    };

    loadProject();
  }, [projectId, getProjectById, setCurrentProject]);

  // Unified Loading Component
  const LoadingComponent = () => (
    <AppLayout>
      <UnifiedLoading />
    </AppLayout>
  );

  return {
    loading,
    error,
    currentProject,
    LoadingComponent
  };
};
