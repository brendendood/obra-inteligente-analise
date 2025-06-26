
import { useParams } from 'react-router-dom';
import { ProjectWorkspace } from '@/components/project/ProjectWorkspace';
import { useProject } from '@/contexts/ProjectContext';
import { ProjectOverview } from '@/components/project/ProjectOverview';
import { ProjectAIChat } from '@/components/project/ai/ProjectAIChat';
import { ProjectAIHeader } from '@/components/project/ai/ProjectAIHeader';
import { ProjectAISidebar } from '@/components/project/ai/ProjectAISidebar';
import { Card, CardContent } from '@/components/ui/card';

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

const ProjectAssistant = () => {
  const { currentProject } = useProject();
  
  if (!currentProject) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🤖</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Assistente IA</h2>
          <p className="text-gray-600 max-w-md mx-auto">
            Carregando projeto...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-12rem)] flex flex-col -mx-3 md:-mx-6 -my-3 md:-my-6">
      <ProjectAIHeader project={currentProject} />
      
      <div className="flex-1 flex flex-col md:flex-row gap-0 md:gap-4 min-h-0 px-3 md:px-6">
        {/* Chat Principal */}
        <div className="flex-1 flex flex-col min-w-0">
          <Card className="flex-1 flex flex-col border-0 shadow-lg">
            <CardContent className="flex-1 flex flex-col p-0">
              <ProjectAIChat project={currentProject} />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Hidden on mobile, shown as drawer */}
        <div className="hidden md:block">
          <ProjectAISidebar project={currentProject} />
        </div>
        
        {/* Mobile Sidebar as Drawer */}
        <div className="md:hidden">
          <ProjectAISidebar project={currentProject} />
        </div>
      </div>
    </div>
  );
};

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
