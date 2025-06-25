
import { useParams } from 'react-router-dom';
import { ProjectWorkspace } from '@/components/project/ProjectWorkspace';
import { useProject } from '@/contexts/ProjectContext';
import { ProjectOverview } from '@/components/project/ProjectOverview';

// Componentes para cada seção
const ProjectBudget = () => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
    <div className="text-center">
      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <span className="text-2xl">💰</span>
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Orçamento do Projeto</h2>
      <p className="text-gray-600 max-w-md mx-auto">
        Em breve você poderá gerar orçamentos detalhados baseados na análise do seu projeto com integração SINAPI.
      </p>
    </div>
  </div>
);

const ProjectSchedule = () => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
    <div className="text-center">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <span className="text-2xl">📅</span>
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Cronograma do Projeto</h2>
      <p className="text-gray-600 max-w-md mx-auto">
        Cronogramas automatizados com base na análise técnica do projeto serão implementados em breve.
      </p>
    </div>
  </div>
);

const ProjectAssistant = () => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
    <div className="text-center">
      <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <span className="text-2xl">🤖</span>
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Assistente IA</h2>
      <p className="text-gray-600 max-w-md mx-auto">
        Chat inteligente personalizado para este projeto específico será disponibilizado em breve.
      </p>
    </div>
  </div>
);

const ProjectDocuments = () => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
    <div className="text-center">
      <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <span className="text-2xl">📄</span>
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Documentos do Projeto</h2>
      <p className="text-gray-600 max-w-md mx-auto">
        Relatórios técnicos, plantas processadas e documentos gerados automaticamente ficarão disponíveis aqui.
      </p>
    </div>
  </div>
);

const ProjectWorkspacePage = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const currentPath = window.location.pathname;

  const renderContent = () => {
    if (currentPath.includes('/orcamento')) return <ProjectBudget />;
    if (currentPath.includes('/cronograma')) return <ProjectSchedule />;
    if (currentPath.includes('/assistente')) return <ProjectAssistant />;
    if (currentPath.includes('/documentos')) return <ProjectDocuments />;
    return <ProjectOverview />;
  };

  return (
    <ProjectWorkspace>
      {renderContent()}
    </ProjectWorkspace>
  );
};

export default ProjectWorkspacePage;
