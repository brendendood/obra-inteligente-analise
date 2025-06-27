
import { useProjectDetail } from '@/contexts/ProjectDetailContext';
import { ModernAIChat } from '@/components/project/ai/ModernAIChat';
import { Bot, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const ProjectSpecificAssistant = () => {
  const { project } = useProjectDetail();

  if (!project) {
    return (
      <div className="flex items-center justify-center h-96">
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
    );
  }

  const hasAnalysis = project.analysis_data && Object.keys(project.analysis_data).length > 0;

  if (!hasAnalysis) {
    return (
      <div className="flex items-center justify-center h-96">
        <Card className="w-96 border-0 shadow-none">
          <CardContent className="text-center p-8">
            <div className="w-16 h-16 mx-auto bg-amber-500 rounded-full flex items-center justify-center mb-6">
              <Bot className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">IA em Preparação</h3>
            <p className="text-gray-500 mb-6">
              Estamos preparando sua IA especializada para o projeto <strong>{project.name}</strong>.
            </p>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-sm text-amber-800">
                Analisando documentos e especificações técnicas...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <ModernAIChat project={project} />;
};

export default ProjectSpecificAssistant;
