
import { useParams } from 'react-router-dom';
import { Bot, Sparkles } from 'lucide-react';
import { useProject } from '@/contexts/ProjectContext';
import { ModernProjectAIChat } from '@/components/project/ai/ModernProjectAIChat';

const ProjectSpecificAssistant = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { currentProject } = useProject();

  if (!currentProject) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="text-center space-y-6">
          <div className="w-20 h-20 mx-auto bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
            <Sparkles className="h-10 w-10 text-white animate-pulse" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Carregando MadenAI...</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Preparando sua assistente especializada para este projeto.
            </p>
          </div>
          <div className="flex space-x-2 justify-center">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    );
  }

  return <ModernProjectAIChat project={currentProject} />;
};

export default ProjectSpecificAssistant;
