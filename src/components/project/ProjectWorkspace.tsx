
import { ProjectWorkspaceContainer } from './ProjectWorkspaceContainer';

interface ProjectWorkspaceProps {
  children: React.ReactNode;
}

export const ProjectWorkspace = ({ children }: ProjectWorkspaceProps) => {
  return (
    <ProjectWorkspaceContainer>
      {children}
    </ProjectWorkspaceContainer>
  );
};
