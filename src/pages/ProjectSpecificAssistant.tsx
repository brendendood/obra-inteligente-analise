
import { useParams } from 'react-router-dom';
import { Bot } from 'lucide-react';
import { useProject } from '@/contexts/ProjectContext';
import { ModernProjectAIChat } from '@/components/project/ai/ModernProjectAIChat';

const ProjectSpecificAssistant = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { currentProject } = useProject();

  if (!currentProject) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="text-center">
          <Bot className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Carregando assistente...</h3>
          <p className="text-gray-600">Preparando MadenAI para seu projeto.</p>
        </div>
      </div>
    );
  }

  return <ModernProjectAIChat project={currentProject} />;
};

export default ProjectSpecificAssistant;
