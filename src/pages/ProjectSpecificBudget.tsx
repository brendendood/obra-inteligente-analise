
import { useParams } from 'react-router-dom';
import { ProjectWorkspace } from '@/components/project/ProjectWorkspace';
import { Calculator } from 'lucide-react';
import { useProject } from '@/contexts/ProjectContext';
import { ProjectBudgetGenerator } from '@/components/project/ProjectBudgetGenerator';

const ProjectSpecificBudget = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { currentProject } = useProject();

  if (!currentProject) {
    return (
      <ProjectWorkspace>
        <div className="text-center py-16">
          <Calculator className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Projeto não encontrado</h3>
          <p className="text-gray-600">Não foi possível carregar os dados do projeto.</p>
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
