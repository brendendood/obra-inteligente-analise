
import { useProjectDetail } from '@/contexts/ProjectDetailContext';
import { ProjectBudgetGenerator } from '@/components/project/ProjectBudgetGenerator';
import { Calculator } from 'lucide-react';

const ProjectSpecificBudget = () => {
  const { project } = useProjectDetail();

  if (!project) {
    return (
      <div className="text-center py-16">
        <Calculator className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Projeto não encontrado</h3>
        <p className="text-gray-600">Não foi possível carregar os dados do projeto.</p>
      </div>
    );
  }

  return <ProjectBudgetGenerator project={project} />;
};

export default ProjectSpecificBudget;
