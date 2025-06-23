
import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Upload as UploadIcon, 
  FileText, 
  CheckCircle, 
  AlertCircle,
  Bot,
  Zap,
  Clock,
  BarChart3,
  X,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useProject } from '@/contexts/ProjectContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProcessingProgress from '@/components/common/ProcessingProgress';

const Upload = () => {
  const { isAuthenticated, user, loading: authLoading } = useAuth();
  const { currentProject, loadUserProjects } = useProject();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadComplete, setUploadComplete] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, authLoading, navigate]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const uploadedFile = acceptedFiles[0];
    if (uploadedFile) {
      if (uploadedFile.type !== 'application/pdf') {
        toast({
          title: "❌ Arquivo inválido",
          description: "Apenas arquivos PDF são aceitos.",
          variant: "destructive",
        });
        return;
      }
      if (uploadedFile.size > 50 * 1024 * 1024) {
        toast({
          title: "❌ Arquivo muito grande",
          description: "O arquivo deve ter no máximo 50MB.",
          variant: "destructive",
        });
        return;
      }
      setFile(uploadedFile);
    }
  }, [toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    multiple: false,
    maxSize: 50 * 1024 * 1024
  });

  const handleUpload = async () => {
    if (!file || !user) return;

    setUploading(true);
    setProgress(0);

    try {
      const fileName = `${user.id}/${Date.now()}-${file.name}`;
      
      // Simular progresso
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Upload do arquivo
      const { error: uploadError } = await supabase.storage
        .from('project-files')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Chamar edge function para processar
      const { data, error: processError } = await supabase.functions
        .invoke('upload-project', {
          body: {
            fileName,
            originalName: file.name,
            fileSize: file.size
          }
        });

      if (processError) throw processError;

      clearInterval(progressInterval);
      setProgress(100);
      setUploadComplete(true);
      
      toast({
        title: "🎉 Upload concluído!",
        description: "Seu projeto foi analisado com sucesso.",
      });

      // Recarregar projetos
      setTimeout(() => {
        loadUserProjects();
        navigate('/painel');
      }, 2000);

    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "❌ Erro no upload",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleAnalyzeExisting = () => {
    if (currentProject) {
      navigate('/assistant');
    } else {
      toast({
        title: "ℹ️ Nenhum projeto encontrado",
        description: "Faça upload de um projeto primeiro.",
        variant: "default",
      });
    }
  };

  const resetUpload = () => {
    setFile(null);
    setUploading(false);
    setProgress(0);
    setUploadComplete(false);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 rounded-2xl w-fit mx-auto mb-6 shadow-lg">
            <UploadIcon className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Análise de Projetos
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Faça upload do seu projeto arquitetônico e deixe nossa IA analisar cada detalhe
          </p>
        </div>

        {/* Quick Action - Existing Project */}
        {currentProject && (
          <Card className="mb-8 shadow-xl border-0 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-green-800 flex items-center">
                <CheckCircle className="h-6 w-6 mr-3 text-green-600" />
                Projeto Ativo Encontrado
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-bold text-green-900 mb-1">{currentProject.name}</p>
                  <p className="text-green-700 mb-2">
                    {currentProject.total_area ? `${currentProject.total_area}m² • ` : ''}
                    {currentProject.project_type}
                  </p>
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-green-100 text-green-800">✅ Processado</Badge>
                    <Badge className="bg-green-100 text-green-800">🤖 IA Pronta</Badge>
                  </div>
                </div>
                <Button 
                  onClick={handleAnalyzeExisting}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-3 text-lg"
                >
                  <Bot className="h-5 w-5 mr-2" />
                  Analisar com IA
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Upload Area */}
        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              {uploading ? 'Processando Projeto' : 'Novo Projeto'}
            </CardTitle>
            <CardDescription className="text-center text-lg">
              {uploading 
                ? 'Nossa IA está analisando seu projeto...' 
                : 'Arraste um arquivo PDF ou clique para selecionar'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!uploading && !uploadComplete && (
              <>
                {/* Upload Zone */}
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 mb-6 ${
                    isDragActive 
                      ? 'border-blue-500 bg-blue-50' 
                      : file 
                        ? 'border-green-500 bg-green-50'
                        : 'border-slate-300 hover:border-blue-400 hover:bg-blue-50'
                  }`}
                >
                  <input {...getInputProps()} />
                  
                  {file ? (
                    <div className="space-y-4">
                      <CheckCircle className="h-16 w-16 text-green-600 mx-auto" />
                      <div>
                        <p className="text-xl font-bold text-green-800 mb-2">Arquivo selecionado!</p>
                        <p className="text-green-700 text-lg">{file.name}</p>
                        <p className="text-green-600 text-sm">
                          {(file.size / (1024 * 1024)).toFixed(1)} MB
                        </p>
                      </div>
                      <Button 
                        onClick={(e) => {
                          e.stopPropagation();
                          resetUpload();
                        }}
                        variant="outline"
                        className="mt-4"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Remover arquivo
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <FileText className="h-16 w-16 text-slate-400 mx-auto" />
                      <div>
                        <p className="text-xl font-bold text-slate-700 mb-2">
                          {isDragActive 
                            ? 'Solte o arquivo aqui...' 
                            : 'Selecione seu projeto PDF'
                          }
                        </p>
                        <p className="text-slate-500">
                          Máximo 50MB • Apenas arquivos PDF
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Button */}
                {file && (
                  <Button 
                    onClick={handleUpload}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-4 text-lg font-semibold"
                    size="lg"
                  >
                    <Zap className="h-5 w-5 mr-2" />
                    Analisar com IA
                  </Button>
                )}
              </>
            )}

            {/* Upload Progress */}
            {uploading && (
              <div className="space-y-6">
                <ProcessingProgress />
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-700 font-medium">Progresso do upload</span>
                    <span className="text-blue-600 font-bold">{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-3" />
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <div className="flex items-center space-x-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                    <span className="text-blue-800 font-medium">
                      Processando projeto com IA...
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Success State */}
            {uploadComplete && (
              <div className="text-center space-y-6">
                <CheckCircle className="h-20 w-20 text-green-600 mx-auto" />
                <div>
                  <h3 className="text-2xl font-bold text-green-800 mb-2">
                    Projeto Analisado com Sucesso!
                  </h3>
                  <p className="text-green-700 text-lg">
                    Redirecionando para o painel...
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Card className="shadow-lg border-0 hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-3 rounded-2xl w-fit">
                <Bot className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle className="text-lg">Análise Inteligente</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">
                IA especializada extrai informações técnicas e identifica padrões arquitetônicos
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <div className="bg-gradient-to-br from-green-100 to-green-200 p-3 rounded-2xl w-fit">
                <Clock className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle className="text-lg">Processamento Rápido</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">
                Análise completa em segundos, economizando horas de trabalho manual
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <div className="bg-gradient-to-br from-purple-100 to-purple-200 p-3 rounded-2xl w-fit">
                <BarChart3 className="h-6 w-6 text-purple-600" />
              </div>
              <CardTitle className="text-lg">Relatórios Detalhados</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">
                Orçamentos automáticos, cronogramas e análises técnicas precisas
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Upload;
