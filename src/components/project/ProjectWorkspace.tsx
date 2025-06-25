
import { ProjectWorkspaceLoading } from './ProjectWorkspaceLoading';
import { ProjectWorkspaceContainer } from './ProjectWorkspaceContainer';
import { useAuth } from '@/hooks/useAuth';
import { useProjectsConsistency } from '@/hooks/useProjectsConsistency';

interface ProjectWorkspaceProps {
  children: React.ReactNode;
}

export const ProjectWorkspace = ({ children }: ProjectWorkspaceProps) => {
  const { isAuthenticated } = useAuth();
  const { isLoading } = useProjectsConsistency();

  if (!isAuthenticated || isLoading) {
    return <ProjectWorkspaceLoading />;
  }

  return (
    <ProjectWorkspaceContainer>
      {children}
    </ProjectWorkspaceContainer>
  );
};
