
import { AppLayout } from '@/components/layout/AppLayout';
import { ProjectHeader } from '@/components/layout/ProjectHeader';
import { ProjectWorkspaceAccordion } from './ProjectWorkspaceAccordion';
import { ProjectInfoAlert } from './ProjectInfoAlert';
import { useProjectAccordionManager } from './ProjectWorkspaceTabManager';
import { ErrorFallback } from '@/components/error/ErrorFallback';
import { useProjectDetail } from '@/contexts/ProjectDetailContext';

interface ProjectWorkspaceContainerProps {
  children: React.ReactNode;
}

export const ProjectWorkspaceContainer = ({ children }: ProjectWorkspaceContainerProps) => {
  const { project: currentProject, isLoading: loading, error } = useProjectDetail();
  const { activeSection, handleSectionChange, getSectionTitle } = useProjectAccordionManager();

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
          currentSection={getSectionTitle(activeSection)}
        />
        
        <div className="flex-1 p-6 bg-gray-50/50">
          <div className="max-w-7xl mx-auto">
            <ProjectWorkspaceAccordion 
              activeSection={activeSection} 
              onSectionChange={(value) => handleSectionChange(value, currentProject)}
            >
              {children}
            </ProjectWorkspaceAccordion>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};
