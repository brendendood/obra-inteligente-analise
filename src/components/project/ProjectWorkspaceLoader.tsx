
import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();

  useEffect(() => {
    const loadProject = async () => {
      if (!projectId) {
        console.log('❌ PROJECT LOADER: Sem ID do projeto');
        setLoading(false);
        setError('ID do projeto não fornecido');
        return;
      }

      console.log('🔄 PROJECT LOADER: Carregando projeto:', projectId);

      // Se já carregamos este projeto, não recarregar
      if (loadedProjectRef.current === projectId && 
          currentProject?.id === projectId) {
        console.log('✅ PROJECT LOADER: Projeto já carregado');
        setLoading(false);
        return;
      }

      try {
        // Se não temos projetos carregados, carregar primeiro
        if (projects.length === 0) {
          console.log('📥 PROJECT LOADER: Carregando lista de projetos primeiro');
          await loadProjects(true);
          
          // Aguardar um pouco para garantir que os projetos foram carregados
          await new Promise(resolve => setTimeout(resolve, 500));
        }

        // Verificar se o projeto existe
        if (projectExists(projectId)) {
          const project = getProjectById(projectId);
          if (project) {
            console.log('✅ PROJECT LOADER: Projeto encontrado:', project.name);
            
            // Só atualizar se for diferente do atual
            if (project.id !== currentProject?.id) {
              setCurrentProject(project);
            }
            
            loadedProjectRef.current = projectId;
            setError(null);
          } else {
            console.error('❌ PROJECT LOADER: Projeto não encontrado no getProjectById');
            setError('Projeto não encontrado');
          }
        } else {
          console.error('❌ PROJECT LOADER: Projeto não existe:', projectId);
          setError('Projeto não encontrado');
          
          // Redirecionar para lista de projetos após um delay
          setTimeout(() => {
            navigate('/projetos', { replace: true });
          }, 2000);
        }
      } catch (err) {
        console.error('💥 PROJECT LOADER: Erro ao carregar projeto:', err);
        setError('Erro ao carregar projeto');
      } finally {
        setLoading(false);
      }
    };

    loadProject();
  }, [projectId, projectExists, getProjectById, setCurrentProject, projects.length, currentProject?.id, loadProjects, navigate]);

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
