
import { useParams } from 'react-router-dom';
import { ProjectWorkspace } from '@/components/project/ProjectWorkspace';
import { ProjectSchedulePlaceholder } from '@/components/project/ProjectSchedulePlaceholder';
import { useProject } from '@/contexts/ProjectContext';

const ProjectSpecificSchedule = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { currentProject } = useProject();

  if (!currentProject) {
    return (
      <ProjectWorkspace>
        <div className="flex items-center justify-center h-64 animate-fade-in">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando projeto...</p>
          </div>
        </div>
      </ProjectWorkspace>
    );
  }

  return (
    <ProjectWorkspace>
      <div className="animate-fade-in">
        <ProjectSchedulePlaceholder />
      </div>
    </ProjectWorkspace>
  );
};

export default ProjectSpecificSchedule;
