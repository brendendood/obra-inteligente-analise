
import { useParams } from 'react-router-dom';
import { ProjectWorkspace } from '@/components/project/ProjectWorkspace';
import { Bot } from 'lucide-react';
import { useProject } from '@/contexts/ProjectContext';
import { ProjectAIChat } from '@/components/project/ai/ProjectAIChat';

const ProjectSpecificAssistant = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { currentProject } = useProject();

  if (!currentProject) {
    return (
      <ProjectWorkspace>
        <div className="text-center py-16">
          <Bot className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Carregando assistente...</h3>
          <p className="text-gray-600">Preparando MadenAI para seu projeto.</p>
        </div>
      </ProjectWorkspace>
    );
  }

  return (
    <ProjectWorkspace>
      <div className="h-full">
        <ProjectAIChat project={currentProject} />
      </div>
    </ProjectWorkspace>
  );
};

export default ProjectSpecificAssistant;
