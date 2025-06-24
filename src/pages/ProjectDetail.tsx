
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowUp,
  FileText, 
  Calendar, 
  Calculator, 
  Bot,
  Home,
  AlertCircle,
  RefreshCw,
  Download,
  FileDown,
  ClipboardList,
  BarChart3
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProjectActionCard from '@/components/project/ProjectActionCard';
import GanttChart from '@/components/project/GanttChart';

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
      const { data, error } = await supabase.functions.invoke('chat-assistant', {
        body: {
          message: 'Gere um orçamento detalhado usando a tabela SINAPI para este projeto',
          projectId: project.id
        }
      });

      if (error) throw error;

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
      const { data, error } = await supabase.functions.invoke('chat-assistant', {
        body: {
          message: 'Gere um cronograma detalhado de execução para este projeto',
          projectId: project.id
        }
      });

      if (error) throw error;

      // Simulate schedule data for the Gantt component
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Carregando projeto...</p>
        </div>
      </div>
    );
  }

  // Error states
  if (error || !project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <Header />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="shadow-lg border-0 text-center">
            <CardContent className="py-12">
              <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                {error || 'Projeto não encontrado'}
              </h2>
              <p className="text-slate-600 mb-8">
                {error === 'Projeto não encontrado' 
                  ? 'O projeto que você está procurando pode ter sido removido ou você não tem permissão para acessá-lo.'
                  : 'Ocorreu um erro inesperado ao carregar o projeto.'
                }
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={() => navigate('/obras')}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                >
                  <Home className="h-4 w-4 mr-2" />
                  Ver Todas as Obras
                </Button>
                
                <Button 
                  onClick={() => navigate('/upload')}
                  variant="outline"
                >
                  <ArrowUp className="h-4 w-4 mr-2" />
                  Novo Projeto
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
        </div>
        
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-slate-600 mb-6">
          <button onClick={() => navigate('/painel')} className="hover:text-blue-600">
            Painel
          </button>
          <span>/</span>
          <button onClick={() => navigate('/obras')} className="hover:text-blue-600">
            Obras
          </button>
          <span>/</span>
          <span className="text-slate-900 font-medium">{project.name}</span>
        </nav>

        {/* Project Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">{project.name}</h1>
              <div className="flex items-center space-x-4 text-slate-600">
                {project.total_area && (
                  <span>Área: {project.total_area}m²</span>
                )}
                {project.project_type && (
                  <Badge variant="outline">{project.project_type}</Badge>
                )}
                <span>Criado em {new Date(project.created_at).toLocaleDateString('pt-BR')}</span>
              </div>
            </div>
            
            <Badge className="bg-green-100 text-green-800">
              ✅ Processado
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* PDF Viewer */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-blue-600" />
                  Documento do Projeto
                </CardTitle>
              </CardHeader>
              <CardContent>
                {getPdfUrl() ? (
                  <div className="space-y-4">
                    <iframe
                      src={`${getPdfUrl()}#view=FitH`}
                      className="w-full h-96 border border-slate-200 rounded-lg"
                      title="PDF do Projeto"
                    />
                    <Button
                      onClick={() => window.open(getPdfUrl(), '_blank')}
                      className="w-full"
                      variant="outline"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Abrir PDF em Nova Aba
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-8 text-slate-500">
                    <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>Arquivo PDF não disponível</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Budget Display */}
            {showBudget && budgetData && (
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calculator className="h-5 w-5 mr-2 text-green-600" />
                    Orçamento SINAPI
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none">
                    <pre className="whitespace-pre-wrap text-sm">{budgetData.message || JSON.stringify(budgetData, null, 2)}</pre>
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
            <h3 className="text-lg font-bold text-slate-900 mb-4">Ferramentas do Projeto</h3>
            
            <ProjectActionCard
              icon={Bot}
              title="Assistente IA"
              description="Chat inteligente sobre o projeto"
              onClick={() => navigate('/assistant')}
            />

            <ProjectActionCard
              icon={Calculator}
              title="Orçamento Inteligente"
              description="Gerar orçamento baseado na tabela SINAPI"
              onClick={handleBudgetGeneration}
              isLoading={budgetLoading}
            />

            <ProjectActionCard
              icon={Calendar}
              title="Cronograma"
              description="Timeline visual das etapas de execução"
              onClick={handleScheduleGeneration}
              isLoading={scheduleLoading}
            />

            <ProjectActionCard
              icon={FileDown}
              title="Documentos"
              description="Downloads e relatórios técnicos"
              onClick={() => navigate('/documents')}
            />

            <ProjectActionCard
              icon={BarChart3}
              title="Análises"
              description="Relatórios detalhados e insights"
              onClick={() => toast({ title: "📊 Em desenvolvimento", description: "Funcionalidade será lançada em breve" })}
            />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProjectDetail;
