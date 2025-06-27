
import { useProjectDetail } from '@/contexts/ProjectDetailContext';
import ProjectSpecificDocuments from '@/pages/ProjectSpecificDocuments';

const ProjectSpecificDocumentsPage = () => {
  const { project, isLoading, error } = useProjectDetail();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando documentos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Erro ao carregar projeto</h3>
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-16">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Projeto não encontrado</h3>
        <p className="text-gray-600">Não foi possível carregar os dados do projeto.</p>
      </div>
    );
  }

  return <ProjectSpecificDocuments />;
};

export default ProjectSpecificDocumentsPage;
