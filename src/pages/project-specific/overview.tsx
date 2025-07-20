
import { useProjectDetail } from '@/contexts/ProjectDetailContext';
import { ProjectOverview } from '@/components/project/ProjectOverview';
import { InlineUnifiedLoading } from '@/components/ui/unified-loading';

const ProjectSpecificOverview = () => {
  const { project, isLoading, error } = useProjectDetail();

  console.log('ProjectSpecificOverview renderizado. Estado:', {
    hasProject: !!project,
    isLoading,
    error,
    projectName: project?.name
  });

  if (isLoading) {
    console.log('Exibindo estado de carregamento');
    return <InlineUnifiedLoading />;
  }

  if (error) {
    console.log('Exibindo estado de erro:', error);
    return (
      <div className="text-center py-16">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Erro ao carregar projeto</h3>
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  if (!project) {
    console.log('Exibindo estado de projeto não encontrado');
    return (
      <div className="text-center py-16">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Projeto não encontrado</h3>
        <p className="text-gray-600">Não foi possível carregar os dados do projeto.</p>
      </div>
    );
  }

  console.log('Renderizando ProjectOverview com dados do projeto:', project.name);
  return <ProjectOverview />;
};

export default ProjectSpecificOverview;
