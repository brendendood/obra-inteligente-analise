
import { useParams, Navigate } from 'react-router-dom';
import { useProject } from '@/contexts/ProjectContext';
import { useProjectLoader } from '@/components/project/ProjectWorkspaceLoader';
import { AppLayout } from '@/components/layout/AppLayout';
import { ProjectHeader } from '@/components/layout/ProjectHeader';
import { ProjectOverview } from '@/components/project/ProjectOverview';
import { ErrorFallback } from '@/components/error/ErrorFallback';

const ProjectDetail = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { currentProject } = useProject();
  const { loading, error, LoadingComponent } = useProjectLoader();

  console.log('🔍 PROJECT_DETAIL: Renderizando', { 
    projectId, 
    currentProject: currentProject?.id,
    loading,
    error
  });

  if (!projectId) {
    console.log('❌ PROJECT_DETAIL: ProjectId não fornecido, redirecionando');
    return <Navigate to="/painel" replace />;
  }

  if (loading) {
    console.log('⏳ PROJECT_DETAIL: Carregando projeto...');
    return <LoadingComponent />;
  }

  if (error) {
    console.log('❌ PROJECT_DETAIL: Erro detectado:', error);
    return (
      <ErrorFallback 
        title="Erro ao carregar projeto"
        message={error === 'Projeto não encontrado' 
          ? "O projeto que você está tentando acessar não foi encontrado. Ele pode ter sido excluído ou você não tem permissão para visualizá-lo."
          : "Não foi possível carregar os detalhes do projeto. Tente novamente em alguns instantes."
        }
      />
    );
  }

  if (!currentProject || currentProject.id !== projectId) {
    console.log('❌ PROJECT_DETAIL: Projeto não encontrado no estado');
    return (
      <ErrorFallback 
        title="Projeto não encontrado"
        message="O projeto que você está tentando acessar não foi encontrado. Verifique se o projeto existe e tente novamente."
      />
    );
  }

  console.log('✅ PROJECT_DETAIL: Renderizando projeto:', currentProject.name);

  return (
    <AppLayout>
      <div className="flex flex-col h-full">
        <ProjectHeader 
          projectName={currentProject.name}
          projectId={currentProject.id}
          currentSection="Visão Geral"
        />
        
        <div className="flex-1 p-8 bg-gray-50/50">
          <div className="max-w-7xl mx-auto">
            <ProjectOverview />
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default ProjectDetail;
