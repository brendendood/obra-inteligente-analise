
import { useParams } from 'react-router-dom';
import { ProjectWorkspace } from '@/components/project/ProjectWorkspace';
import { useProject } from '@/contexts/ProjectContext';

// Componentes para cada seção
const ProjectOverview = () => {
  const { currentProject } = useProject();
  
  if (!currentProject) return null;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Informações do Projeto</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-1 font-medium">Nome do Projeto</p>
            <p className="text-gray-900 font-semibold text-lg">{currentProject.name}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-1 font-medium">Criado em</p>
            <p className="text-gray-900 font-semibold">
              {new Date(currentProject.created_at).toLocaleDateString('pt-BR')}
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-1 font-medium">Caminho do Arquivo</p>
            <p className="text-gray-900 font-medium text-sm break-all">{currentProject.file_path}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-1 font-medium">Status</p>
            <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
              currentProject.analysis_data 
                ? 'bg-green-100 text-green-800 border border-green-200' 
                : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
            }`}>
              {currentProject.analysis_data ? 'Analisado' : 'Processando'}
            </span>
          </div>
        </div>
      </div>

      {currentProject.analysis_data && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Análise do Projeto</h3>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-800 font-medium">
              ✅ Análise técnica concluída com sucesso!
            </p>
            <p className="text-blue-700 mt-2">
              Use as abas acima para acessar orçamento, cronograma, assistente IA e documentos específicos deste projeto.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

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
