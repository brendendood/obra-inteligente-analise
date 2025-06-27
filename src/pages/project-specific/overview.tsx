
import { useProjectDetail } from '@/contexts/ProjectDetailContext';
import { ProjectOverview } from '@/components/project/ProjectOverview';

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
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando projeto...</p>
        </div>
      </div>
    );
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
