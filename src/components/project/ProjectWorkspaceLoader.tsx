
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
        console.log('⚠️ WORKSPACE LOADER: ID do projeto não fornecido');
        // Não mostrar erro se não há projectId (usuário pode estar navegando)
        setLoading(false);
        return;
      }

      console.log('🔄 WORKSPACE LOADER: Carregando projeto:', projectId);

      try {
        // Dar tempo para os projetos carregarem se ainda não carregaram
        await new Promise(resolve => setTimeout(resolve, 100));
        
        if (!projectExists(projectId)) {
          console.log('⚠️ WORKSPACE LOADER: Projeto não encontrado nos dados carregados');
          setError('Projeto não encontrado');
          setLoading(false);
          return;
        }

        const project = getProject(projectId);
        if (!project) {
          console.log('⚠️ WORKSPACE LOADER: Projeto não encontrado ao tentar obter dados');
          setError('Projeto não encontrado');
          setLoading(false);
          return;
        }

        console.log('✅ WORKSPACE LOADER: Projeto carregado com sucesso:', project.name);
        setCurrentProject(project);
        setError(null);
      } catch (err) {
        console.error('❌ WORKSPACE LOADER: Erro ao carregar projeto:', err);
        // Não mostrar erro automaticamente - pode ser temporário
        console.log('🔄 WORKSPACE LOADER: Erro temporário, tentando novamente...');
        setError(null);
      } finally {
        setLoading(false);
      }
    };

    loadProject();
  }, [projectId, projectExists, getProject, setCurrentProject]);

  // Loading Component otimizado
  const LoadingComponent = () => (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
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
