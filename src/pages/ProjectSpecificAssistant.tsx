
import { useParams, Navigate } from 'react-router-dom';
import { useProject } from '@/contexts/ProjectContext';
import { useProjectLoader } from '@/components/project/ProjectWorkspaceLoader';
import { AppLayout } from '@/components/layout/AppLayout';
import { ProjectHeader } from '@/components/layout/ProjectHeader';
import { ModernAIChat } from '@/components/project/ai/ModernAIChat';
import { ErrorFallback } from '@/components/error/ErrorFallback';
import { Card, CardContent } from '@/components/ui/card';
import { Bot, Sparkles, AlertCircle } from 'lucide-react';

const ProjectSpecificAssistant = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { currentProject } = useProject();
  const { loading, error } = useProjectLoader();

  // Redirecionar se não há projectId
  if (!projectId) {
    return <Navigate to="/painel" replace />;
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
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
          <Card className="w-96 shadow-xl border-0 bg-white/90 backdrop-blur-sm">
            <CardContent className="text-center p-8">
              <div className="w-20 h-20 mx-auto bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mb-6">
                <Sparkles className="h-10 w-10 text-white animate-pulse" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Carregando MadenAI</h3>
              <p className="text-gray-600 mb-6">
                Preparando sua assistente especializada para este projeto...
              </p>
              <div className="flex space-x-2 justify-center">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
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
        <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
          <Card className="w-96 shadow-xl border-0 bg-white/90 backdrop-blur-sm">
            <CardContent className="text-center p-8">
              <div className="w-20 h-20 mx-auto bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center mb-6">
                <AlertCircle className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Projeto não encontrado</h3>
              <p className="text-gray-600 mb-6">
                O projeto que você está tentando acessar não foi encontrado ou você não tem permissão para visualizá-lo.
              </p>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    );
  }

  // Verificar se o projeto tem análise (IA treinada)
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
          
          <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            <Card className="w-96 shadow-xl border-0 bg-white/90 backdrop-blur-sm">
              <CardContent className="text-center p-8">
                <div className="w-20 h-20 mx-auto bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center mb-6">
                  <Bot className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">IA em Preparação</h3>
                <p className="text-gray-600 mb-6">
                  Estamos preparando sua IA especializada para o projeto <strong>{currentProject.name}</strong>.
                  Você será notificado assim que estiver pronta.
                </p>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <p className="text-sm text-amber-800">
                    <strong>Processo em andamento:</strong> Analisando documentos e especificações técnicas...
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
