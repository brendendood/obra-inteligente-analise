
import { Outlet, useParams, useNavigate, useLocation } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { ProjectHeader } from '@/components/layout/ProjectHeader';
import { ProjectDetailProvider, useProjectDetail } from '@/contexts/ProjectDetailContext';
import { ErrorFallback } from '@/components/error/ErrorFallback';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Calculator, Clock, Bot, FileText, Eye } from 'lucide-react';

const ProjectSpecificLayoutContent = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { project, isLoading, error } = useProjectDetail();
  const navigate = useNavigate();
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

  const handleTabChange = (value: string) => {
    if (!projectId) return;
    
    const basePath = `/projeto/${projectId}`;
    const newPath = value === 'visao-geral' ? basePath : `${basePath}/${value}`;
    navigate(newPath);
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
        
        <div className="flex-1 p-8 bg-apple-gray-50">
          <div className="max-w-7xl mx-auto">
            <Tabs value={getCurrentTab()} onValueChange={handleTabChange} className="w-full" aria-label="Selecionar seção do projeto">
              {/* Sticky segmented control */}
              <div className="sticky top-0 z-20 -mx-2 sm:mx-0 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border mb-4 sm:mb-6">
                <div className="px-2 sm:px-0 max-w-5xl mx-auto">
                  <TabsList className="w-full grid grid-cols-2 sm:grid-cols-5 gap-2 p-2 rounded-2xl bg-muted text-muted-foreground shadow-sm">
                    <TabsTrigger 
                      value="visao-geral" 
                      className="w-full inline-flex items-center justify-center gap-2 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm transition-all duration-200 font-medium py-3 px-3 text-xs sm:text-sm"
                    >
                      <Eye className="h-4 w-4 flex-shrink-0" />
                      <span className="truncate">Visão Geral</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="orcamento" 
                      className="w-full inline-flex items-center justify-center gap-2 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm transition-all duration-200 font-medium py-3 px-3 text-xs sm:text-sm"
                    >
                      <Calculator className="h-4 w-4 flex-shrink-0" />
                      <span className="truncate">Orçamento</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="cronograma" 
                      className="w-full inline-flex items-center justify-center gap-2 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm transition-all duration-200 font-medium py-3 px-3 text-xs sm:text-sm"
                    >
                      <Clock className="h-4 w-4 flex-shrink-0" />
                      <span className="truncate">Cronograma</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="assistente" 
                      className="w-full inline-flex items-center justify-center gap-2 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm transition-all duration-200 font-medium py-3 px-3 text-xs sm:text-sm"
                    >
                      <Bot className="h-4 w-4 flex-shrink-0" />
                      <span className="truncate">Assistente</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="documentos" 
                      className="w-full inline-flex items-center justify-center gap-2 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm transition-all duration-200 font-medium py-3 px-3 text-xs sm:text-sm"
                    >
                      <FileText className="h-4 w-4 flex-shrink-0" />
                      <span className="truncate">Documentos</span>
                    </TabsTrigger>
                  </TabsList>
                </div>
              </div>

              <TabsContent value={getCurrentTab()} className="mt-0">
                <Outlet />
              </TabsContent>
            </Tabs>
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
