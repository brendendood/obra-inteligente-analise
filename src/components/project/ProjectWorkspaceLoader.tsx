
import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useProject } from '@/contexts/ProjectContext';
import { useProjectSync } from '@/hooks/useProjectSync';
import { EnhancedSkeleton } from '@/components/ui/enhanced-skeleton';
import { AppLayout } from '@/components/layout/AppLayout';

export const useProjectLoader = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { currentProject, setCurrentProject } = useProject();
  const { getProjectById, projectExists, projects, loadProjects } = useProjectSync();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const loadedProjectRef = useRef<string | null>(null);

  useEffect(() => {
    const loadProject = async () => {
      if (!projectId) {
        setLoading(false);
        return;
      }

      console.log('🔄 WORKSPACE_LOADER: Iniciando carregamento do projeto:', projectId);

      // Se já carregamos este projeto e ele está ativo, não recarregar
      if (loadedProjectRef.current === projectId && currentProject?.id === projectId) {
        console.log('✅ WORKSPACE_LOADER: Projeto já carregado e ativo');
        setError(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Forçar recarregamento de projetos para garantir dados atualizados
        console.log('🔄 WORKSPACE_LOADER: Forçando recarregamento de projetos');
        await loadProjects(true);

        // Aguardar um momento para garantir que o estado foi atualizado
        setTimeout(() => {
          console.log('🔍 WORKSPACE_LOADER: Verificando existência do projeto após reload');
          
          if (projectExists(projectId)) {
            const project = getProjectById(projectId);
            if (project) {
              console.log('✅ WORKSPACE_LOADER: Projeto encontrado, definindo como atual:', project.name);
              setCurrentProject(project);
              loadedProjectRef.current = projectId;
              setError(null);
            } else {
              console.error('❌ WORKSPACE_LOADER: getProjectById retornou null');
              setError('Erro interno ao carregar projeto');
            }
          } else {
            console.error('❌ WORKSPACE_LOADER: Projeto não encontrado após reload:', projectId);
            setError('Projeto não encontrado');
          }
          
          setLoading(false);
        }, 500);

      } catch (err) {
        console.error('💥 WORKSPACE_LOADER: Erro ao carregar projeto:', err);
        setError('Erro ao carregar projeto');
        setLoading(false);
      }
    };

    // Reset do estado quando o projectId muda
    if (projectId !== loadedProjectRef.current) {
      loadedProjectRef.current = null;
      setError(null);
    }

    loadProject();
  }, [projectId, projectExists, getProjectById, setCurrentProject, loadProjects]);

  // Loading Component otimizado
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
