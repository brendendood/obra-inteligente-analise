
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  ArrowLeft,
  FileText,
  Calculator,
  Calendar,
  MessageSquare,
  Download,
  Loader2,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const ProjectDetail = () => {
  const { projectId } = useParams();
  const { isAuthenticated, user, loading } = useAuth();
  const [project, setProject] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [budgetLoading, setBudgetLoading] = useState(false);
  const [budgetResult, setBudgetResult] = useState<any>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, loading, navigate]);

  useEffect(() => {
    if (isAuthenticated && projectId) {
      loadProject();
    }
  }, [isAuthenticated, projectId]);

  const loadProject = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .eq('user_id', user?.id)
        .single();

      if (error) throw error;
      setProject(data);
    } catch (error) {
      console.error('Erro ao carregar projeto:', error);
      toast({
        title: "❌ Erro",
        description: "Não foi possível carregar o projeto.",
        variant: "destructive",
      });
      navigate('/obras');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBudgetGeneration = async () => {
    if (!project?.extracted_text) {
      toast({
        title: "❌ Erro",
        description: "Texto do projeto não encontrado. Reenvie o arquivo.",
        variant: "destructive",
      });
      return;
    }

    setBudgetLoading(true);
    try {
      const response = await fetch('https://brendendood.app.n8n.cloud/webhook-test/agente-ia-orcamento', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          texto_projeto: project.extracted_text,
          nome_projeto: project.name,
          usuario_id: user?.id,
          projeto_id: project.id
        }),
      });

      if (!response.ok) {
        throw new Error('Erro na requisição para o agente de orçamento');
      }

      const result = await response.json();
      setBudgetResult(result);
      
      toast({
        title: "🎉 Orçamento gerado!",
        description: "O orçamento inteligente foi gerado com sucesso.",
      });
    } catch (error) {
      console.error('Erro ao gerar orçamento:', error);
      toast({
        title: "❌ Erro",
        description: "Não foi possível gerar o orçamento. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setBudgetLoading(false);
    }
  };

  const getPdfUrl = () => {
    if (!project?.file_path) return null;
    return supabase.storage.from('project-files').getPublicUrl(project.file_path).data.publicUrl;
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Carregando projeto...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !project) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Button
              variant="outline"
              onClick={() => navigate('/obras')}
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-1">
                {project.name}
              </h1>
              <div className="flex items-center space-x-3">
                {project.analysis_data ? (
                  <Badge className="bg-green-100 text-green-800">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Concluído
                  </Badge>
                ) : (
                  <Badge className="bg-orange-100 text-orange-800">
                    <Clock className="h-3 w-3 mr-1" />
                    Em análise
                  </Badge>
                )}
                {project.project_type && (
                  <Badge variant="outline">{project.project_type}</Badge>
                )}
                {project.total_area && (
                  <span className="text-slate-600">{project.total_area}m²</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content - Two Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - PDF Viewer */}
          <Card className="shadow-xl border-0">
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2 text-blue-600" />
                Visualização do Projeto
              </CardTitle>
            </CardHeader>
            <CardContent>
              {getPdfUrl() ? (
                <div className="aspect-[3/4] w-full">
                  <iframe
                    src={`${getPdfUrl()}#toolbar=1&navpanes=1&scrollbar=1`}
                    className="w-full h-full border rounded-lg"
                    title="Visualização do PDF"
                  />
                </div>
              ) : (
                <div className="aspect-[3/4] w-full border-2 border-dashed border-slate-300 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <AlertCircle className="h-12 w-12 text-slate-400 mx-auto mb-2" />
                    <p className="text-slate-500">PDF não disponível</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Right Column - Actions */}
          <div className="space-y-6">
            {/* Project Actions */}
            <Card className="shadow-xl border-0">
              <CardHeader>
                <CardTitle>Ferramentas de Análise</CardTitle>
                <CardDescription>
                  Utilize as ferramentas de IA para analisar seu projeto
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Budget Button */}
                <Button
                  onClick={handleBudgetGeneration}
                  disabled={budgetLoading}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 h-14"
                >
                  {budgetLoading ? (
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  ) : (
                    <Calculator className="h-5 w-5 mr-2" />
                  )}
                  Orçamento Inteligente
                  {budgetResult && <CheckCircle className="h-4 w-4 ml-2 text-green-200" />}
                </Button>

                {/* Schedule Button */}
                <Button
                  onClick={() => navigate(`/schedule?project=${project.id}`)}
                  variant="outline"
                  className="w-full h-14"
                >
                  <Calendar className="h-5 w-5 mr-2" />
                  Gerar Cronograma
                </Button>

                {/* Documents Button */}
                <Button
                  onClick={() => navigate(`/documents?project=${project.id}`)}
                  variant="outline"
                  className="w-full h-14"
                >
                  <FileText className="h-5 w-5 mr-2" />
                  Documentos Técnicos
                </Button>

                {/* AI Chat Button */}
                <Button
                  onClick={() => navigate(`/assistant?project=${project.id}`)}
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 h-14"
                >
                  <MessageSquare className="h-5 w-5 mr-2" />
                  Chat com IA Técnica
                </Button>
              </CardContent>
            </Card>

            {/* Budget Result */}
            {budgetResult && (
              <Card className="shadow-xl border-0 bg-gradient-to-r from-green-50 to-emerald-50">
                <CardHeader>
                  <CardTitle className="text-green-800 flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Orçamento Gerado
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-white p-4 rounded-lg">
                      <pre className="text-sm text-slate-700 whitespace-pre-wrap">
                        {typeof budgetResult === 'string' 
                          ? budgetResult 
                          : JSON.stringify(budgetResult, null, 2)
                        }
                      </pre>
                    </div>
                    <Button
                      onClick={() => {
                        const blob = new Blob([JSON.stringify(budgetResult, null, 2)], {
                          type: 'application/json'
                        });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `orcamento-${project.name}.json`;
                        a.click();
                      }}
                      variant="outline"
                      className="w-full"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Exportar Orçamento
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Project Info */}
            <Card className="shadow-xl border-0">
              <CardHeader>
                <CardTitle>Informações do Projeto</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="font-medium text-slate-700">Data de envio:</span>
                    <p className="text-slate-600">
                      {new Date(project.created_at).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  {project.file_size && (
                    <div>
                      <span className="font-medium text-slate-700">Tamanho do arquivo:</span>
                      <p className="text-slate-600">
                        {(project.file_size / (1024 * 1024)).toFixed(1)} MB
                      </p>
                    </div>
                  )}
                  {project.total_area && (
                    <div>
                      <span className="font-medium text-slate-700">Área total:</span>
                      <p className="text-slate-600">{project.total_area}m²</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProjectDetail;
