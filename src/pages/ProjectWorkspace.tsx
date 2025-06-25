
import { useParams } from 'react-router-dom';
import { ProjectWorkspace } from '@/components/project/ProjectWorkspace';
import { useProject } from '@/contexts/ProjectContext';

// Componentes para cada seção
const ProjectOverview = () => {
  const { currentProject } = useProject();
  
  if (!currentProject) return null;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Informações do Projeto</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Nome do Projeto</p>
            <p className="font-medium">{currentProject.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Criado em</p>
            <p className="font-medium">
              {new Date(currentProject.created_at).toLocaleDateString('pt-BR')}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Arquivo Original</p>
            <p className="font-medium">{currentProject.original_filename}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Status</p>
            <p className="font-medium text-green-600">
              {currentProject.analysis_data ? 'Analisado' : 'Processando'}
            </p>
          </div>
        </div>
      </div>

      {currentProject.analysis_data && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Análise do Projeto</h3>
          <div className="prose max-w-none">
            <p className="text-gray-600">
              Análise técnica disponível. Use as abas acima para acessar orçamento, 
              cronograma, assistente IA e documentos.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

const ProjectBudget = () => (
  <div className="bg-white rounded-lg shadow p-6">
    <h2 className="text-2xl font-bold text-gray-900 mb-4">Orçamento do Projeto</h2>
    <p className="text-gray-600">Funcionalidade de orçamento será implementada aqui.</p>
  </div>
);

const ProjectSchedule = () => (
  <div className="bg-white rounded-lg shadow p-6">
    <h2 className="text-2xl font-bold text-gray-900 mb-4">Cronograma do Projeto</h2>
    <p className="text-gray-600">Funcionalidade de cronograma será implementada aqui.</p>
  </div>
);

const ProjectAssistant = () => (
  <div className="bg-white rounded-lg shadow p-6">
    <h2 className="text-2xl font-bold text-gray-900 mb-4">Assistente IA</h2>
    <p className="text-gray-600">Chat com assistente IA será implementado aqui.</p>
  </div>
);

const ProjectDocuments = () => (
  <div className="bg-white rounded-lg shadow p-6">
    <h2 className="text-2xl font-bold text-gray-900 mb-4">Documentos do Projeto</h2>
    <p className="text-gray-600">Documentos e relatórios serão listados aqui.</p>
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
