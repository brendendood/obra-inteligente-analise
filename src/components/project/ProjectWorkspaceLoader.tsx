
import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useProject } from '@/contexts/ProjectContext';
import { useProjectSync } from '@/hooks/useProjectSync';
import { EnhancedSkeleton } from '@/components/ui/enhanced-skeleton';
import { AppLayout } from '@/components/layout/AppLayout';

export const useProjectLoader = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { currentProject, setCurrentProject } = useProject();
  const { getProjectById, projectExists, projects } = useProjectSync();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const loadedProjectRef = useRef<string | null>(null);

  useEffect(() => {
    const loadProject = async () => {
      if (!projectId) {
        setLoading(false);
        return;
      }

      // Evitar recarregamento do mesmo projeto
      if (loadedProjectRef.current === projectId && currentProject?.id === projectId) {
        setLoading(false);
        return;
      }

      try {
        // Aguardar projetos carregarem se necessário
        if (projects.length === 0) {
          // Aguardar um ciclo para projetos carregarem
          const timeout = setTimeout(() => {
            if (projectExists(projectId)) {
              const project = getProjectById(projectId);
              if (project && project.id !== currentProject?.id) {
                setCurrentProject(project);
                loadedProjectRef.current = projectId;
                setError(null);
              }
            } else {
              setError('Projeto não encontrado');
            }
            setLoading(false);
          }, 1000);

          return () => clearTimeout(timeout);
        }

        // Projetos já carregados
        if (projectExists(projectId)) {
          const project = getProjectById(projectId);
          if (project && project.id !== currentProject?.id) {
            setCurrentProject(project);
            loadedProjectRef.current = projectId;
            setError(null);
          }
        } else {
          setError('Projeto não encontrado');
        }
      } catch (err) {
        console.error('Erro ao carregar projeto:', err);
        setError('Erro ao carregar projeto');
      } finally {
        setLoading(false);
      }
    };

    loadProject();
  }, [projectId, projectExists, getProjectById, setCurrentProject, projects.length, currentProject?.id]);

  // Loading Component otimizado para evitar piscar
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
