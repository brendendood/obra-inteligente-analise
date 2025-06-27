
import { useProjectDetail } from '@/contexts/ProjectDetailContext';
import { Clock } from 'lucide-react';

const ProjectSpecificSchedule = () => {
  const { project, isLoading, error } = useProjectDetail();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando cronograma...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <Clock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Erro ao carregar projeto</h3>
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-16">
        <Clock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Projeto não encontrado</h3>
        <p className="text-gray-600">Não foi possível carregar os dados do projeto.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
      <div className="text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">📅</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Cronograma - {project.name}</h2>
        <p className="text-gray-600 max-w-md mx-auto">
          Cronogramas automatizados com base na análise técnica do projeto serão implementados em breve.
        </p>
      </div>
    </div>
  );
};

export default ProjectSpecificSchedule;
