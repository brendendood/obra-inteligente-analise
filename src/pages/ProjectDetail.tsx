import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  ArrowLeft,
  FileText, 
  Calendar, 
  Calculator, 
  Bot,
  AlertCircle,
  RefreshCw,
  Download,
  ExternalLink,
  ClipboardList,
  BarChart3,
  Eye,
  MessageSquare,
  Building,
  Ruler
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { AppLayout } from '@/components/layout/AppLayout';
import { NavigationBreadcrumb } from '@/components/layout/NavigationBreadcrumb';
import GanttChart from '@/components/schedule/GanttChart';
import { generateProjectSchedule } from '@/utils/scheduleGenerator';

interface Project {
  id: string;
  name: string;
  file_path: string;
  file_size?: number;
  extracted_text?: string;
  analysis_data?: any;
  project_type?: string;
  total_area?: number;
  created_at: string;
  updated_at: string;
}

const ProjectDetail = () => {
  const { projectId } = useParams();
  const { isAuthenticated, user, loading: authLoading } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [budgetLoading, setBudgetLoading] = useState(false);
  const [scheduleLoading, setScheduleLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [budgetData, setBudgetData] = useState<any>(null);
  const [scheduleData, setScheduleData] = useState<any>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (projectId && isAuthenticated) {
      loadProject();
    }
  }, [projectId, isAuthenticated, authLoading, navigate]);

  const loadProject = async () => {
    if (!projectId) {
      setError('ID do projeto não fornecido');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const { data, error: fetchError } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .single();

      if (fetchError) {
        if (fetchError.code === 'PGRST116') {
          setError('Projeto não encontrado');
        } else {
          setError(`Erro ao carregar projeto: ${fetchError.message}`);
        }
        return;
      }

      if (!data) {
        setError('Projeto não encontrado');
        return;
      }

      setProject(data);
      console.log('✅ Projeto carregado com sucesso:', data.name);
      
      // Gerar dados específicos deste projeto baseados no analysis_data
      if (data.analysis_data) {
        generateProjectSpecificData(data);
      }
    } catch (error) {
      console.error('Error loading project:', error);
      setError('Erro inesperado ao carregar projeto');
    } finally {
      setLoading(false);
    }
  };

  const generateProjectSpecificData = (projectData: Project) => {
    try {
      // Gerar cronograma específico baseado na área e tipo do projeto
      const baseSchedule = generateProjectSchedule(projectData);
      setScheduleData(baseSchedule);
      console.log('✅ Cronograma base gerado para:', projectData.name);
    } catch (error) {
      console.error('❌ Erro ao gerar dados do projeto:', error);
    }
  };

  const getPdfUrl = () => {
    if (!project?.file_path) return null;
    
    const { data } = supabase.storage
      .from('project-files')
      .getPublicUrl(project.file_path);
    
    return data?.publicUrl || null;
  };

  const handleBudgetGeneration = async () => {
    if (!project) return;
    
    setBudgetLoading(true);
    
    try {
      // Integração com N8N
      const response = await fetch('https://brendendood.app.n8n.cloud/webhook-test/agente-ia-orcamento', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectId: project.id,
          projectName: project.name,
          projectData: project.analysis_data,
          totalArea: project.total_area,
          userId: user?.id
        })
      });

      if (!response.ok) {
        throw new Error('Erro na comunicação com o serviço de orçamento');
      }

      const data = await response.json();
      setBudgetData(data);
      setActiveTab('budget');
      
      toast({
        title: "✅ Orçamento gerado!",
        description: "Orçamento baseado na tabela SINAPI criado com sucesso.",
      });
    } catch (error) {
      console.error('Budget generation error:', error);
      toast({
        title: "❌ Erro no orçamento",
        description: "Não foi possível gerar o orçamento. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setBudgetLoading(false);
    }
  };

  const handleScheduleGeneration = async () => {
    if (!project) return;
    
    setScheduleLoading(true);
    
    try {
      // Usar gerador de cronograma corrigido
      const projectSchedule = generateProjectSchedule(project);
      setScheduleData(projectSchedule);
      setActiveTab('schedule');
      
      toast({
        title: "📅 Cronograma atualizado!",
        description: `Cronograma específico para ${project.name} (${project.total_area}m²) criado com dependências e durações otimizadas.`,
      });
    } catch (error) {
      console.error('Schedule generation error:', error);
      toast({
        title: "❌ Erro no cronograma",
        description: "Não foi possível gerar o cronograma.",
        variant: "destructive",
      });
    } finally {
      setScheduleLoading(false);
    }
  };

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
                onClick={() => navigate('/obras')}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar às Obras
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
        {/* Breadcrumb */}
        <NavigationBreadcrumb projectName={project.name} />

        {/* Project Header */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{project.name}</h1>
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-sm sm:text-base text-gray-600">
              {project.total_area && (
                <div className="flex items-center space-x-1">
                  <Ruler className="h-4 w-4" />
                  <span>Área: {project.total_area}m²</span>
                </div>
              )}
              {project.project_type && (
                <Badge variant="outline" className="flex items-center space-x-1">
                  <Building className="h-3 w-3" />
                  <span>{project.project_type}</span>
                </Badge>
              )}
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>Criado em {new Date(project.created_at).toLocaleDateString('pt-BR')}</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
            <Badge className="bg-green-100 text-green-800 border-green-200">
              ✅ Projeto Processado
            </Badge>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  onClick={() => navigate('/obras')}
                  variant="outline"
                  className="w-full sm:w-auto"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar às Obras
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Retornar à lista de projetos</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* Project Navigation Tabs */}
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
              {/* PDF Viewer */}
              <div className="lg:col-span-2">
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <FileText className="h-5 w-5 mr-2 text-blue-600" />
                      Documento do Projeto
                    </CardTitle>
                    <CardDescription>
                      Visualização do arquivo PDF enviado
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {getPdfUrl() ? (
                      <div className="space-y-4">
                        <div className="border border-gray-200 rounded-lg overflow-hidden">
                          <iframe
                            src={`${getPdfUrl()}#view=FitH`}
                            className="w-full h-64 sm:h-96"
                            title="PDF do Projeto"
                          />
                        </div>
                        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                          <Button
                            onClick={() => window.open(getPdfUrl(), '_blank')}
                            variant="outline"
                            className="flex-1"
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Abrir em Nova Aba
                          </Button>
                          <Button
                            onClick={() => {
                              const link = document.createElement('a');
                              link.href = getPdfUrl() || '';
                              link.download = `${project.name}.pdf`;
                              link.click();
                            }}
                            variant="outline"
                            className="flex-1"
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download PDF
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p>Arquivo PDF não disponível</p>
                        <p className="text-sm mt-1">Verifique se o arquivo foi enviado corretamente</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900">Ferramentas do Projeto</h3>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer" onClick={() => setActiveTab('assistant')}>
                      <CardContent className="p-4 sm:p-6">
                        <div className="flex items-center space-x-3">
                          <div className="p-3 bg-purple-100 rounded-lg">
                            <Bot className="h-6 w-6 text-purple-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">Assistente IA</h4>
                            <p className="text-sm text-gray-600">Chat especializado neste projeto</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Conversar com IA sobre este projeto específico</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer" onClick={handleBudgetGeneration}>
                      <CardContent className="p-4 sm:p-6">
                        <div className="flex items-center space-x-3">
                          <div className="p-3 bg-green-100 rounded-lg">
                            <Calculator className="h-6 w-6 text-green-600" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">Orçamento SINAPI</h4>
                            <p className="text-sm text-gray-600">Gerar orçamento específico</p>
                            {budgetLoading && (
                              <div className="mt-2">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Gerar orçamento baseado na tabela SINAPI</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer" onClick={handleScheduleGeneration}>
                      <CardContent className="p-4 sm:p-6">
                        <div className="flex items-center space-x-3">
                          <div className="p-3 bg-blue-100 rounded-lg">
                            <Calendar className="h-6 w-6 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">Cronograma</h4>
                            <p className="text-sm text-gray-600">Timeline das etapas</p>
                            {scheduleLoading && (
                              <div className="mt-2">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Visualizar cronograma específico do projeto</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer" onClick={() => setActiveTab('documents')}>
                      <CardContent className="p-4 sm:p-6">
                        <div className="flex items-center space-x-3">
                          <div className="p-3 bg-orange-100 rounded-lg">
                            <FileText className="h-6 w-6 text-orange-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">Documentos</h4>
                            <p className="text-sm text-gray-600">Downloads e relatórios</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Acessar documentos e relatórios</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="assistant">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2 text-purple-600" />
                  Assistente IA - {project.name}
                </CardTitle>
                <CardDescription>
                  Chat especializado baseado nos dados específicos deste projeto
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center py-8">
                <Bot className="h-16 w-16 text-purple-400 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-700 mb-2">
                  Assistente IA Especializado
                </h3>
                <p className="text-gray-500 mb-6">
                  Converse com a IA sobre este projeto específico: {project.name}
                </p>
                <Button 
                  onClick={() => navigate('/assistant')}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Abrir Chat Especializado
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="budget">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calculator className="h-5 w-5 mr-2 text-green-600" />
                  Orçamento - {project.name}
                </CardTitle>
                <CardDescription>
                  Orçamento específico baseado na tabela SINAPI para este projeto
                </CardDescription>
              </CardHeader>
              <CardContent>
                {budgetData ? (
                  <div className="prose max-w-none">
                    <pre className="whitespace-pre-wrap text-sm bg-gray-50 p-4 rounded-lg">
                      {budgetData.message || JSON.stringify(budgetData, null, 2)}
                    </pre>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calculator className="h-16 w-16 text-green-400 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-gray-700 mb-2">
                      Gerar Orçamento SINAPI
                    </h3>
                    <p className="text-gray-500 mb-6">
                      Clique no botão para gerar um orçamento específico para {project.name}
                    </p>
                    <Button 
                      onClick={handleBudgetGeneration}
                      disabled={budgetLoading}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {budgetLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Gerando Orçamento...
                        </>
                      ) : (
                        <>
                          <Calculator className="h-4 w-4 mr-2" />
                          Gerar Orçamento
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="schedule">
            {scheduleData ? (
              <GanttChart
                tasks={scheduleData}
                projectName={project.name}
                onExportPDF={() => toast({ title: "📄 Exportando PDF...", description: "Funcionalidade em desenvolvimento" })}
                onExportExcel={() => toast({ title: "📊 Exportando Excel...", description: "Funcionalidade em desenvolvimento" })}
              />
            ) : (
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                    Cronograma - {project.name}
                  </CardTitle>
                  <CardDescription>
                    Timeline específica das etapas para este projeto
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center py-8">
                  <Calendar className="h-16 w-16 text-blue-400 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-gray-700 mb-2">
                    Gerar Cronograma
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Clique para gerar cronograma específico para {project.name} ({project.total_area}m²)
                  </p>
                  <Button 
                    onClick={handleScheduleGeneration}
                    disabled={scheduleLoading}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {scheduleLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Gerando Cronograma...
                      </>
                    ) : (
                      <>
                        <Calendar className="h-4 w-4 mr-2" />
                        Gerar Cronograma
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="documents">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-orange-600" />
                  Documentos - {project.name}
                </CardTitle>
                <CardDescription>
                  Downloads e relatórios específicos deste projeto
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-8 w-8 text-red-500" />
                        <div>
                          <h4 className="font-medium text-gray-900">Projeto Original</h4>
                          <p className="text-sm text-gray-500">{project.name}.pdf</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          onClick={() => window.open(getPdfUrl(), '_blank')}
                          variant="outline" 
                          size="sm"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Ver
                        </Button>
                        <Button 
                          onClick={() => {
                            const link = document.createElement('a');
                            link.href = getPdfUrl() || '';
                            link.download = `${project.name}.pdf`;
                            link.click();
                          }}
                          variant="outline" 
                          size="sm"
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </div>

                  {budgetData && (
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Calculator className="h-8 w-8 text-green-500" />
                          <div>
                            <h4 className="font-medium text-gray-900">Orçamento SINAPI</h4>
                            <p className="text-sm text-gray-500">Orçamento gerado para {project.name}</p>
                          </div>
                        </div>
                        <Button 
                          onClick={() => toast({ title: "📄 Em desenvolvimento", description: "Export de orçamento será implementado" })}
                          variant="outline" 
                          size="sm"
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                  )}

                  {scheduleData && (
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Calendar className="h-8 w-8 text-blue-500" />
                          <div>
                            <h4 className="font-medium text-gray-900">Cronograma</h4>
                            <p className="text-sm text-gray-500">Timeline para {project.name}</p>
                          </div>
                        </div>
                        <Button 
                          onClick={() => toast({ title: "📄 Em desenvolvimento", description: "Export de cronograma será implementado" })}
                          variant="outline" 
                          size="sm"
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default ProjectDetail;
