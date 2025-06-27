
import { useParams } from 'react-router-dom';
import { ProjectWorkspace } from '@/components/project/ProjectWorkspace';
import { Calculator } from 'lucide-react';
import { useProjectStateManager } from '@/hooks/useProjectStateManager';
import { ProjectBudgetGenerator } from '@/components/project/ProjectBudgetGenerator';

const ProjectSpecificBudget = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { currentProject, isProjectLoaded } = useProjectStateManager();

  if (!isProjectLoaded || !currentProject) {
    return (
      <ProjectWorkspace>
        <div className="text-center py-16">
          <Calculator className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Carregando projeto...</h3>
          <p className="text-gray-600">Aguarde enquanto carregamos os dados do projeto.</p>
        </div>
      </ProjectWorkspace>
    );
  }

  return (
    <ProjectWorkspace>
      <ProjectBudgetGenerator project={currentProject} />
    </ProjectWorkspace>
  );
};

export default ProjectSpecificBudget;
