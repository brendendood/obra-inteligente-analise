
import { ProjectWorkspaceContainer } from './ProjectWorkspaceContainer';
import { ProjectDetailProvider } from '@/contexts/ProjectDetailContext';

interface ProjectWorkspaceProps {
  children: React.ReactNode;
}

export const ProjectWorkspace = ({ children }: ProjectWorkspaceProps) => {
  return (
    <ProjectDetailProvider>
      <ProjectWorkspaceContainer>
        {children}
      </ProjectWorkspaceContainer>
    </ProjectDetailProvider>
  );
};
