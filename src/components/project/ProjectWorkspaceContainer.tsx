
import { AppLayout } from '@/components/layout/AppLayout';
import { ProjectHeader } from '@/components/layout/ProjectHeader';
import { ProjectWorkspaceTabs } from './ProjectWorkspaceTabs';
import { ProjectInfoAlert } from './ProjectInfoAlert';
import { useProjectLoader } from './ProjectWorkspaceLoader';
import { useProjectTabManager } from './ProjectWorkspaceTabManager';
import { ErrorFallback } from '@/components/error/ErrorFallback';

interface ProjectWorkspaceContainerProps {
  children: React.ReactNode;
}

export const ProjectWorkspaceContainer = ({ children }: ProjectWorkspaceContainerProps) => {
  const { loading, error, currentProject } = useProjectLoader();
  const { activeTab, handleTabChange, getSectionTitle } = useProjectTabManager();

  if (error) {
    return (
      <ErrorFallback 
        error={new Error(error)}
        title="Erro ao carregar projeto"
        message="Não foi possível carregar os detalhes do projeto. Verifique se o projeto existe e tente novamente."
      />
    );
  }

  if (loading) {
    return null; // Loading will be handled by parent component
  }

  if (!currentProject) {
    return (
      <ErrorFallback 
        title="Projeto não encontrado"
        message="O projeto que você está tentando acessar não foi encontrado ou você não tem permissão para visualizá-lo."
      />
    );
  }

  return (
    <AppLayout>
      <div className="flex flex-col h-full">
        <ProjectHeader 
          projectName={currentProject.name}
          projectId={currentProject.id}
          currentSection={getSectionTitle(activeTab)}
        />
        
        <div className="flex-1 p-8 bg-gray-50/50">
          <div className="max-w-7xl mx-auto">
            <ProjectWorkspaceTabs 
              activeTab={activeTab} 
              onTabChange={(value) => handleTabChange(value, currentProject)}
            >
              {children}
            </ProjectWorkspaceTabs>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};
