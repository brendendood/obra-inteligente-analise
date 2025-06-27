
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

  if (!projectId) {
    return <Navigate to="/painel" replace />;
  }

  if (error) {
    return (
      <ErrorFallback 
        error={new Error(error)}
        title="Erro ao carregar projeto"
        message="Não foi possível carregar os detalhes do projeto. Verifique se o projeto existe e tente novamente."
      />
    );
  }

  if (loading) {
    return <LoadingComponent />;
  }

  if (!currentProject) {
    return (
      <ErrorFallback 
        title="Projeto não encontrado"
        message="O projeto que você está tentando acessar não foi encontrado ou você não tem permissão para visualizá-lo."
      />
    );
  }

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
