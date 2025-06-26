
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useProject } from '@/contexts/ProjectContext';
import { useProjectsConsistency } from '@/hooks/useProjectsConsistency';
import { EnhancedSkeleton } from '@/components/ui/enhanced-skeleton';
import { AppLayout } from '@/components/layout/AppLayout';

export const useProjectLoader = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { currentProject, setCurrentProject } = useProject();
  const { getProject, projectExists } = useProjectsConsistency();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProject = async () => {
      if (!projectId) {
        setLoading(false);
        return;
      }

      try {
        // Aguardar carregamento dos projetos
        await new Promise(resolve => setTimeout(resolve, 300));
        
        if (!projectExists(projectId)) {
          // Não mostrar erro imediatamente - tentar novamente
          setTimeout(() => {
            if (projectExists(projectId)) {
              const project = getProject(projectId);
              if (project) {
                setCurrentProject(project);
                setError(null);
              }
            }
          }, 1000);
          
          setLoading(false);
          return;
        }

        const project = getProject(projectId);
        if (project) {
          setCurrentProject(project);
          setError(null);
        }
      } catch (err) {
        console.error('Erro temporário ao carregar projeto:', err);
        // Não definir erro - pode ser temporário
      } finally {
        setLoading(false);
      }
    };

    loadProject();
  }, [projectId, projectExists, getProject, setCurrentProject]);

  // Loading Component otimizado - sem mostrar erro desnecessário
  const LoadingComponent = () => (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center space-x-3 mb-6">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
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
