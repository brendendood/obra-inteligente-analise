
import { useParams } from 'react-router-dom';
import { ProjectWorkspace } from '@/components/project/ProjectWorkspace';
import { Card, CardContent } from '@/components/ui/card';
import { Bot, FileText, Lightbulb } from 'lucide-react';
import { useProject } from '@/contexts/ProjectContext';
import { ProjectAIChat } from '@/components/project/ai/ProjectAIChat';
import { ProjectAIHeader } from '@/components/project/ai/ProjectAIHeader';
import { ProjectAISidebar } from '@/components/project/ai/ProjectAISidebar';

const ProjectSpecificAssistant = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { currentProject } = useProject();

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
      <div className="h-full flex flex-col">
        <ProjectAIHeader project={currentProject} />
        
        <div className="flex-1 flex gap-6 min-h-0">
          {/* Chat Principal */}
          <div className="flex-1 flex flex-col min-w-0">
            <Card className="flex-1 flex flex-col border-0 shadow-lg">
              <CardContent className="flex-1 flex flex-col p-0">
                <ProjectAIChat project={currentProject} />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="w-80 flex-shrink-0">
            <ProjectAISidebar project={currentProject} />
          </div>
        </div>
      </div>
    </ProjectWorkspace>
  );
};

export default ProjectSpecificAssistant;
