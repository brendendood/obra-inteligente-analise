
import { useProjectDetail } from '@/contexts/ProjectDetailContext';
import { ProjectOverview } from '@/components/project/ProjectOverview';

const ProjectSpecificOverview = () => {
  const { project } = useProjectDetail();

  if (!project) {
    return (
      <div className="text-center py-16">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Projeto não encontrado</h3>
        <p className="text-gray-600">Não foi possível carregar os dados do projeto.</p>
      </div>
    );
  }

  return <ProjectOverview />;
};

export default ProjectSpecificOverview;
