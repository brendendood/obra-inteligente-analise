
import { Outlet, useLocation } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { ProjectHeader } from '@/components/layout/ProjectHeader';
import { ProjectDetailProvider, useProjectDetail } from '@/contexts/ProjectDetailContext';
import { ErrorFallback } from '@/components/error/ErrorFallback';
import { ProjectSectionSwitcher } from '@/components/project/navigation/ProjectSectionSwitcher';

const ProjectSpecificLayoutContent = () => {
  
  const { project, isLoading, error } = useProjectDetail();
  
  const location = useLocation();

  // Determinar aba ativa baseada na URL
  const getCurrentTab = () => {
    const path = location.pathname;
    if (path.includes('/orcamento')) return 'orcamento';
    if (path.includes('/cronograma')) return 'cronograma';
    if (path.includes('/assistente')) return 'assistente';
    if (path.includes('/documentos')) return 'documentos';
    return 'visao-geral';
  };


  if (error) {
    return (
      <ErrorFallback 
        error={new Error(error)}
        title="Erro ao carregar projeto"
        message="Não foi possível carregar os detalhes do projeto."
      />
    );
  }

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando projeto...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (!project) {
    return (
      <ErrorFallback 
        title="Projeto não encontrado"
        message="O projeto que você está tentando acessar não foi encontrado."
      />
    );
  }

  const getSectionTitle = (tab: string) => {
    switch (tab) {
      case 'orcamento': return 'Orçamento';
      case 'cronograma': return 'Cronograma';
      case 'assistente': return 'Assistente IA';
      case 'documentos': return 'Documentos';
      default: return 'Visão Geral';
    }
  };

  return (
    <AppLayout>
      <div className="flex flex-col h-full">
        <ProjectHeader 
          projectName={project.name}
          projectId={project.id}
          currentSection={getSectionTitle(getCurrentTab())}
        />
        
        <div className="flex-1 p-6 sm:p-8 bg-apple-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="space-y-4">
              <div className="w-full">
                <ProjectSectionSwitcher />
              </div>
              <section className="min-w-0">
                <Outlet />
              </section>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

const ProjectSpecificLayout = () => {
  return (
    <ProjectDetailProvider>
      <ProjectSpecificLayoutContent />
    </ProjectDetailProvider>
  );
};

export default ProjectSpecificLayout;
