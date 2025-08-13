
import { useParams, Navigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { ProjectHeader } from '@/components/layout/ProjectHeader';
import { ModernAIChat } from '@/components/project/ai/ModernAIChat';
import { ErrorFallback } from '@/components/error/ErrorFallback';
import { Card, CardContent } from '@/components/ui/card';
import { Bot, AlertCircle } from 'lucide-react';
import { ProjectDetailProvider, useProjectDetail } from '@/contexts/ProjectDetailContext';

const ProjectSpecificAssistantContent = () => {
  const { project: currentProject, isLoading: loading, error } = useProjectDetail();

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
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-screen bg-white">
          <Card className="w-96 border-0 shadow-none">
            <CardContent className="text-center p-8">
              <div className="w-16 h-16 mx-auto bg-gray-900 rounded-full flex items-center justify-center mb-6">
                <Bot className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Carregando MadeAI</h3>
              <p className="text-gray-500 mb-6">
                Preparando sua assistente especializada...
              </p>
              <div className="flex justify-center gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    );
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

const ProjectSpecificAssistant = () => {
  const { projectId } = useParams<{ projectId: string }>();

  if (!projectId) {
    return <Navigate to="/painel" replace />;
  }

  return (
    <ProjectDetailProvider>
      <ProjectSpecificAssistantContent />
    </ProjectDetailProvider>
  );
};

export default ProjectSpecificAssistant;
