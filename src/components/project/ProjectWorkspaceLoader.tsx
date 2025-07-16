
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useProject } from '@/contexts/ProjectContext';
import { useProjectStore } from '@/stores/projectStore';
import { EnhancedSkeleton } from '@/components/ui/enhanced-skeleton';
import { AppLayout } from '@/components/layout/AppLayout';
import { Hammer } from 'lucide-react';

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

  // Loading Component otimizado
  const LoadingComponent = () => (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center space-x-3 mb-6">
          <div className="animate-hammer">
            <Hammer className="h-6 w-6 text-orange-500" />
          </div>
          <span className="text-gray-600">Carregando projeto...</span>
        </div>
        <EnhancedSkeleton variant="card" className="h-20" />
        <EnhancedSkeleton variant="card" className="h-16" />
        <div className="space-y-4">
          <EnhancedSkeleton variant="card" className="h-32" />
          <EnhancedSkeleton variant="card" className="h-48" />
          <EnhancedSkeleton variant="card" className="h-24" />
        </div>
      </div>
    </AppLayout>
  );

  return {
    loading,
    error,
    currentProject,
    LoadingComponent
  };
};
