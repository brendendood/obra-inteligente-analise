
import { useParams } from 'react-router-dom';
import { ProjectWorkspace } from '@/components/project/ProjectWorkspace';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot } from 'lucide-react';
import { useProject } from '@/contexts/ProjectContext';
import { ProjectAssistantChat } from '@/components/project/ProjectAssistantChat';
import { useProjectNavigation } from '@/hooks/useProjectNavigation';

const ProjectSpecificAssistant = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { currentProject } = useProject();
  const { navigateToProjectSection } = useProjectNavigation();

  const handleGenerateBudget = () => {
    if (projectId) {
      navigateToProjectSection(projectId, 'orcamento');
    }
  };

  const handleGenerateSchedule = () => {
    if (projectId) {
      navigateToProjectSection(projectId, 'cronograma');
    }
  };

  const handleViewDocuments = () => {
    if (projectId) {
      navigateToProjectSection(projectId, 'documentos');
    }
  };

  if (!currentProject) {
    return (
      <ProjectWorkspace>
        <div className="text-center py-16">
          <Bot className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Projeto não encontrado</h3>
          <p className="text-gray-600">Não foi possível carregar os dados do projeto.</p>
        </div>
      </ProjectWorkspace>
    );
  }

  return (
    <ProjectWorkspace>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Assistente IA - {currentProject.name}</h1>
            <p className="text-gray-600">Chat especializado baseado nos dados específicos deste projeto</p>
          </div>
        </div>

        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center">
              <Bot className="h-5 w-5 mr-2 text-purple-600" />
              Chat Especializado do Projeto
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-0">
            <ProjectAssistantChat
              project={currentProject}
              onGenerateBudget={handleGenerateBudget}
              onGenerateSchedule={handleGenerateSchedule}
              onViewDocuments={handleViewDocuments}
            />
          </CardContent>
        </Card>
      </div>
    </ProjectWorkspace>
  );
};

export default ProjectSpecificAssistant;
