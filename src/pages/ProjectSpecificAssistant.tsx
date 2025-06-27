
import { useParams, Navigate } from 'react-router-dom';
import { useProject } from '@/contexts/ProjectContext';
import { useProjectLoader } from '@/components/project/ProjectWorkspaceLoader';
import { AppLayout } from '@/components/layout/AppLayout';
import { ProjectHeader } from '@/components/layout/ProjectHeader';
import { ModernAIChat } from '@/components/project/ai/ModernAIChat';
import { ErrorFallback } from '@/components/error/ErrorFallback';
import { Card, CardContent } from '@/components/ui/card';
import { Bot, AlertCircle } from 'lucide-react';

const ProjectSpecificAssistant = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { currentProject } = useProject();
  const { loading, error, LoadingComponent } = useProjectLoader();

  if (!projectId) {
    return <Navigate to="/projetos" replace />;
  }

  if (error) {
    return (
      <ErrorFallback 
        error={new Error(error)}
        title="Erro ao carregar projeto"
        message="Não foi possível carregar os detalhes do projeto para o assistente IA."
      />
    );
  }

  if (loading) {
    return <LoadingComponent />;
  }

  if (!currentProject) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-screen bg-white">
          <Card className="w-96 border-0 shadow-none">
            <CardContent className="text-center p-8">
              <div className="w-16 h-16 mx-auto bg-red-500 rounded-full flex items-center justify-center mb-6">
                <AlertCircle className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Projeto não encontrado</h3>
              <p className="text-gray-500">
                O projeto que você está tentando acessar não foi encontrado.
              </p>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    );
  }

  const hasAnalysis = currentProject.analysis_data && Object.keys(currentProject.analysis_data).length > 0;

  if (!hasAnalysis) {
    return (
      <AppLayout>
        <div className="flex flex-col h-full">
          <ProjectHeader 
            projectName={currentProject.name}
            projectId={currentProject.id}
            currentSection="Assistente IA"
          />
          
          <div className="flex-1 flex items-center justify-center bg-white">
            <Card className="w-96 border-0 shadow-none">
              <CardContent className="text-center p-8">
                <div className="w-16 h-16 mx-auto bg-amber-500 rounded-full flex items-center justify-center mb-6">
                  <Bot className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">IA em Preparação</h3>
                <p className="text-gray-500 mb-6">
                  Estamos preparando sua IA especializada para o projeto <strong>{currentProject.name}</strong>.
                </p>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <p className="text-sm text-amber-800">
                    Analisando documentos e especificações técnicas...
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="flex flex-col h-full">
        <ProjectHeader 
          projectName={currentProject.name}
          projectId={currentProject.id}
          currentSection="Assistente IA"
        />
        
        <div className="flex-1">
          <ModernAIChat project={currentProject} />
        </div>
      </div>
    </AppLayout>
  );
};

export default ProjectSpecificAssistant;
