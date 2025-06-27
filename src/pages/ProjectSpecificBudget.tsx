
import { useParams, Navigate } from 'react-router-dom';
import { ProjectWorkspace } from '@/components/project/ProjectWorkspace';
import { ProjectBudgetPlaceholder } from '@/components/project/ProjectBudgetPlaceholder';
import { useProject } from '@/contexts/ProjectContext';
import { useProjectLoader } from '@/components/project/ProjectWorkspaceLoader';

const ProjectSpecificBudget = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { currentProject } = useProject();
  const { loading, error, LoadingComponent } = useProjectLoader();

  if (!projectId) {
    return <Navigate to="/projetos" replace />;
  }

  if (error) {
    return (
      <ProjectWorkspace>
        <div className="flex items-center justify-center h-64 animate-fade-in">
          <div className="text-center">
            <p className="text-red-600 mb-4">❌ {error}</p>
            <p className="text-gray-600">Redirecionando para projetos...</p>
          </div>
        </div>
      </ProjectWorkspace>
    );
  }

  if (loading) {
    return <LoadingComponent />;
  }

  if (!currentProject) {
    return (
      <ProjectWorkspace>
        <div className="flex items-center justify-center h-64 animate-fade-in">
          <div className="text-center">
            <p className="text-gray-600">Projeto não encontrado</p>
          </div>
        </div>
      </ProjectWorkspace>
    );
  }

  return (
    <ProjectWorkspace>
      <div className="animate-fade-in">
        <ProjectBudgetPlaceholder />
      </div>
    </ProjectWorkspace>
  );
};

export default ProjectSpecificBudget;
