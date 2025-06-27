
import { useProjectDetail } from '@/contexts/ProjectDetailContext';
import ProjectSpecificDocuments from '@/pages/ProjectSpecificDocuments';

const ProjectSpecificDocumentsPage = () => {
  const { project } = useProjectDetail();

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
