
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw, ArrowLeft, Eye, Bot, Calculator, Calendar, FileText } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { NavigationBreadcrumb } from '@/components/layout/NavigationBreadcrumb';
import { ProjectDetailHeader } from '@/components/project/ProjectDetailHeader';
import { ProjectPDFViewer } from '@/components/project/ProjectPDFViewer';
import { ProjectQuickActions } from '@/components/project/ProjectQuickActions';
import { ProjectTabContent } from '@/components/project/ProjectTabContent';
import { useProjectDetailLogic } from '@/hooks/useProjectDetailLogic';

const ProjectDetail = () => {
  const {
    project,
    loading,
    error,
    authLoading,
    isAuthenticated,
    budgetLoading,
    scheduleLoading,
    activeTab,
    budgetData,
    scheduleData,
    setActiveTab,
    loadProject,
    getPdfUrl,
    handleBudgetGeneration,
    handleScheduleGeneration,
    navigate,
    toast,
  } = useProjectDetailLogic();

  // Loading state
  if (authLoading || loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando projeto...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  // Error states
  if (error || !project) {
    return (
      <AppLayout>
        <NavigationBreadcrumb />
        <Card className="border-0 shadow-lg text-center">
          <CardContent className="py-12">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {error || 'Projeto não encontrado'}
            </h2>
            <p className="text-gray-600 mb-8">
              {error === 'Projeto não encontrado' 
                ? 'O projeto que você está procurando pode ter sido removido ou você não tem permissão para acessá-lo.'
                : 'Ocorreu um erro inesperado ao carregar o projeto.'
              }
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => navigate('/projetos')}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar aos Projetos
              </Button>
              
              <Button 
                onClick={loadProject}
                variant="outline"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Tentar Novamente
              </Button>
            </div>
          </CardContent>
        </Card>
      </AppLayout>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <NavigationBreadcrumb projectName={project.name} />

        <ProjectDetailHeader 
          project={project}
          onBackClick={() => navigate('/projetos')}
        />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-5 h-auto p-1">
            <TabsTrigger value="overview" className="flex items-center space-x-2 py-2">
              <Eye className="h-4 w-4" />
              <span className="hidden sm:inline">Visão Geral</span>
              <span className="sm:hidden">Geral</span>
            </TabsTrigger>
            <TabsTrigger value="assistant" className="flex items-center space-x-2 py-2">
              <Bot className="h-4 w-4" />
              <span className="hidden sm:inline">Assistente IA</span>
              <span className="sm:hidden">IA</span>
            </TabsTrigger>
            <TabsTrigger value="budget" className="flex items-center space-x-2 py-2">
              <Calculator className="h-4 w-4" />
              <span className="hidden sm:inline">Orçamento</span>
              <span className="sm:hidden">Orç.</span>
            </TabsTrigger>
            <TabsTrigger value="schedule" className="flex items-center space-x-2 py-2">
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">Cronograma</span>
              <span className="sm:hidden">Cron.</span>
            </TabsTrigger>
            <TabsTrigger value="documents" className="flex items-center space-x-2 py-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Documentos</span>
              <span className="sm:hidden">Docs</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <ProjectPDFViewer 
                  projectName={project.name}
                  pdfUrl={getPdfUrl()}
                />
              </div>

              <ProjectQuickActions
                onAssistantClick={() => setActiveTab('assistant')}
                onBudgetClick={handleBudgetGeneration}
                onScheduleClick={handleScheduleGeneration}
                onDocumentsClick={() => setActiveTab('documents')}
                budgetLoading={budgetLoading}
                scheduleLoading={scheduleLoading}
              />
            </div>
          </TabsContent>

          <ProjectTabContent
            project={project}
            budgetData={budgetData}
            scheduleData={scheduleData}
            budgetLoading={budgetLoading}
            scheduleLoading={scheduleLoading}
            onBudgetGeneration={handleBudgetGeneration}
            onScheduleGeneration={handleScheduleGeneration}
            onNavigateToAssistant={() => navigate('/assistant')}
            onToast={toast}
            getPdfUrl={getPdfUrl}
          />
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default ProjectDetail;
