
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
  BarChart3
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { AppLayout } from '@/components/layout/AppLayout';
import GanttChart from '@/components/schedule/GanttChart';

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
  const [showBudget, setShowBudget] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);
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
    } catch (error) {
      console.error('Error loading project:', error);
      setError('Erro inesperado ao carregar projeto');
    } finally {
      setLoading(false);
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
    setShowBudget(false);
    
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
          userId: user?.id
        })
      });

      if (!response.ok) {
        throw new Error('Erro na comunicação com o serviço de orçamento');
      }

      const data = await response.json();
      setBudgetData(data);
      setShowBudget(true);
      
      toast({
        title: "✅ Orçamento gerado!",
        description: "Orçamento baseado na tabela SINAPI criado com sucesso.",
      });
    } catch (error) {
      console.error('Budget generation error:', error);
      toast({
        title: "❌ Erro no orçamento",
        description: "Não foi possível gerar o orçamento.",
        variant: "destructive",
      });
    } finally {
      setBudgetLoading(false);
    }
  };

  const handleScheduleGeneration = async () => {
    if (!project) return;
    
    setScheduleLoading(true);
    setShowSchedule(false);
    
    try {
      const mockScheduleData = [
        {
          id: '1',
          name: 'Fundação e Estrutura',
          startDate: '2024-01-01',
          endDate: '2024-01-21',
          duration: 21,
          color: 'bg-blue-500',
          category: 'estrutura'
        },
        {
          id: '2',
          name: 'Alvenaria e Vedação',
          startDate: '2024-01-22',
          endDate: '2024-02-11',
          duration: 21,
          color: 'bg-orange-500',
          category: 'alvenaria'
        },
        {
          id: '3',
          name: 'Instalações',
          startDate: '2024-02-12',
          endDate: '2024-03-04',
          duration: 21,
          color: 'bg-purple-500',
          category: 'instalacoes'
        },
        {
          id: '4',
          name: 'Acabamentos',
          startDate: '2024-03-05',
          endDate: '2024-03-25',
          duration: 21,
          color: 'bg-green-500',
          category: 'acabamentos'
        }
      ];

      setScheduleData(mockScheduleData);
      setShowSchedule(true);
      
      toast({
        title: "📅 Cronograma gerado!",
        description: "Cronograma detalhado criado com sucesso.",
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
      <div className="space-y-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600">
          <button onClick={() => navigate('/painel')} className="hover:text-blue-600">
            Painel
          </button>
          <span>/</span>
          <button onClick={() => navigate('/obras')} className="hover:text-blue-600">
            Obras
          </button>
          <span>/</span>
          <span className="text-gray-900 font-medium">{project.name}</span>
        </nav>

        {/* Project Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{project.name}</h1>
            <div className="flex items-center space-x-4 text-gray-600">
              {project.total_area && (
                <span>Área: {project.total_area}m²</span>
              )}
              {project.project_type && (
                <Badge variant="outline">{project.project_type}</Badge>
              )}
              <span>Criado em {new Date(project.created_at).toLocaleDateString('pt-BR')}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Badge className="bg-green-100 text-green-800 border-green-200">
              ✅ Processado
            </Badge>
            <Button 
              onClick={() => navigate('/obras')}
              variant="outline"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* PDF Viewer */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-blue-600" />
                  Documento do Projeto
                </CardTitle>
              </CardHeader>
              <CardContent>
                {getPdfUrl() ? (
                  <div className="space-y-4">
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      <iframe
                        src={`${getPdfUrl()}#view=FitH`}
                        className="w-full h-96"
                        title="PDF do Projeto"
                      />
                    </div>
                    <div className="flex space-x-3">
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
                        Download
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>Arquivo PDF não disponível</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Budget Display */}
            {showBudget && budgetData && (
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calculator className="h-5 w-5 mr-2 text-green-600" />
                    Orçamento SINAPI
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none">
                    <pre className="whitespace-pre-wrap text-sm bg-gray-50 p-4 rounded-lg">
                      {budgetData.message || JSON.stringify(budgetData, null, 2)}
                    </pre>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Schedule Display */}
            {showSchedule && scheduleData && (
              <GanttChart
                tasks={scheduleData}
                projectName={project.name}
                onExportPDF={() => toast({ title: "📄 Exportando PDF...", description: "Funcionalidade em desenvolvimento" })}
                onExportExcel={() => toast({ title: "📊 Exportando Excel...", description: "Funcionalidade em desenvolvimento" })}
              />
            )}
          </div>

          {/* Actions Sidebar */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900">Ferramentas do Projeto</h3>
            
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer" onClick={() => navigate('/assistant')}>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <Bot className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Assistente IA</h4>
                    <p className="text-sm text-gray-600">Chat inteligente sobre o projeto</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer" onClick={handleBudgetGeneration}>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <Calculator className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">Orçamento Inteligente</h4>
                    <p className="text-sm text-gray-600">Gerar orçamento baseado na tabela SINAPI</p>
                    {budgetLoading && (
                      <div className="mt-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer" onClick={handleScheduleGeneration}>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Calendar className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">Cronograma</h4>
                    <p className="text-sm text-gray-600">Timeline visual das etapas</p>
                    {scheduleLoading && (
                      <div className="mt-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer" onClick={() => navigate('/documents')}>
              <CardContent className="p-6">
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

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer" onClick={() => toast({ title: "📊 Em desenvolvimento", description: "Funcionalidade será lançada em breve" })}>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-indigo-100 rounded-lg">
                    <BarChart3 className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Análises</h4>
                    <p className="text-sm text-gray-600">Relatórios detalhados</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default ProjectDetail;
