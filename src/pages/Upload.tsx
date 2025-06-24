
import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Upload as UploadIcon, 
  FileText, 
  CheckCircle, 
  Bot,
  Clock,
  BarChart3,
  X,
  Zap
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useProject } from '@/contexts/ProjectContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProcessingProgress from '@/components/common/ProcessingProgress';
import AIButton from '@/components/common/AIButton';
import ProjectSelector from '@/components/common/ProjectSelector';
import { useProcessingSteps } from '@/hooks/useProcessingSteps';

const Upload = () => {
  const { isAuthenticated, user, loading: authLoading } = useAuth();
  const { currentProject, loadUserProjects, projects, setCurrentProject } = useProject();
  const [file, setFile] = useState<File | null>(null);
  const [projectName, setProjectName] = useState('');
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [uploadedProject, setUploadedProject] = useState<any>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Use the processing steps hook
  const { 
    steps, 
    currentStep, 
    isProcessing, 
    progress: processingProgress, 
    startProcessing, 
    stopProcessing 
  } = useProcessingSteps();

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
      // Auto-fill project name with file name (without extension) if empty
      if (!projectName) {
        const nameWithoutExtension = uploadedFile.name.replace(/\.[^/.]+$/, "");
        setProjectName(nameWithoutExtension);
      }
    }
  }, [toast, projectName]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    multiple: false,
    maxSize: 50 * 1024 * 1024
  });

  const handleUpload = async () => {
    if (!file || !user || !projectName.trim()) {
      toast({
        title: "❌ Campos obrigatórios",
        description: "Por favor, selecione um arquivo e informe o nome do projeto.",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    setProgress(0);
    startProcessing();

    try {
      const fileName = `${user.id}/${Date.now()}-${file.name}`;
      
      // Simular progresso de upload
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 80) {
            clearInterval(progressInterval);
            return 80;
          }
          return prev + 10;
        });
      }, 200);

      console.log('Uploading file to storage:', fileName);

      // Upload do arquivo para o storage
      const { error: uploadError } = await supabase.storage
        .from('project-files')
        .upload(fileName, file);

      if (uploadError) {
        console.error('Storage upload error:', uploadError);
        throw new Error(`Erro no upload: ${uploadError.message}`);
      }

      console.log('File uploaded successfully, calling edge function');
      setProgress(90);

      // Chamar edge function para processar metadados
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Sessão não encontrada. Faça login novamente.');
      }

      const { data, error: processError } = await supabase.functions
        .invoke('upload-project', {
          body: {
            fileName,
            originalName: file.name,
            projectName: projectName.trim(),
            fileSize: file.size
          }
        });

      if (processError) {
        console.error('Edge function error:', processError);
        throw new Error(`Erro no processamento: ${processError.message}`);
      }

      if (!data?.success) {
        throw new Error(data?.error || 'Erro no processamento');
      }

      clearInterval(progressInterval);
      setProgress(100);
      setUploadComplete(true);
      setUploadedProject(data.project);
      stopProcessing();
      
      console.log('Upload completed successfully:', data);
      
      toast({
        title: "🎉 Upload concluído!",
        description: data.message || "Seu projeto foi analisado com sucesso.",
      });

      // Recarregar projetos
      loadUserProjects();

    } catch (error) {
      console.error('Upload error:', error);
      stopProcessing();
      
      let errorMessage = "Erro desconhecido";
      
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      
      toast({
        title: "❌ Erro no upload",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleProjectChange = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (project) {
      setCurrentProject(project);
    }
  };

  const resetUpload = () => {
    setFile(null);
    setProjectName('');
    setUploading(false);
    setProgress(0);
    setUploadComplete(false);
    setUploadedProject(null);
  };

  const handleAIAnalysisComplete = (result: any) => {
    console.log('Análise de IA concluída:', result);
    // Aqui você pode redirecionar ou mostrar os resultados
    setTimeout(() => {
      navigate('/painel');
    }, 2000);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="bg-primary p-4 rounded-2xl w-fit mx-auto mb-6 shadow-lg">
            <UploadIcon className="h-10 w-10 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Análise de Projetos
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Faça upload do seu projeto arquitetônico e deixe nossa IA analisar cada detalhe
          </p>
        </div>

        {/* Project Selector */}
        {projects && projects.length > 0 && (
          <div className="mb-8">
            <ProjectSelector
              projects={projects}
              currentProject={currentProject}
              onProjectChange={handleProjectChange}
            />
          </div>
        )}

        {/* Quick Action - Existing Project */}
        {currentProject && (
          <Card className="mb-8 glass-card border-green-500/20 bg-green-50/50 dark:bg-green-900/10">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-green-800 dark:text-green-400 flex items-center">
                <CheckCircle className="h-6 w-6 mr-3" />
                Projeto Ativo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-bold text-foreground mb-1">{currentProject.name}</p>
                  <p className="text-muted-foreground mb-2">
                    {currentProject.total_area ? `${currentProject.total_area}m² • ` : ''}
                    {currentProject.project_type}
                  </p>
                  <div className="flex items-center space-x-2">
                    <Badge className="status-completed border">✅ Processado</Badge>
                    <Badge className="status-in-progress border">🤖 IA Pronta</Badge>
                  </div>
                </div>
                <AIButton 
                  projectData={currentProject}
                  onAnalysisComplete={handleAIAnalysisComplete}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Upload Area */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              {uploading ? 'Processando Projeto' : uploadComplete ? 'Projeto Processado' : 'Novo Projeto'}
            </CardTitle>
            <CardDescription className="text-center text-lg">
              {uploading 
                ? 'Nossa IA está analisando seu projeto...' 
                : uploadComplete
                ? 'Upload concluído com sucesso!'
                : 'Arraste um arquivo PDF ou clique para selecionar'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!uploading && !uploadComplete && (
              <>
                {/* Project Name Field */}
                <div className="mb-6">
                  <Label htmlFor="projectName" className="text-lg font-semibold text-foreground mb-2 block">
                    Nome do Projeto *
                  </Label>
                  <Input
                    id="projectName"
                    type="text"
                    placeholder="Ex: Residência Silva, Apartamento Copacabana..."
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    className="text-lg p-4 border-2 focus:border-primary"
                    disabled={uploading}
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Defina um nome personalizado para identificar seu projeto
                  </p>
                </div>

                {/* Upload Zone */}
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 mb-6 ${
                    isDragActive 
                      ? 'border-primary bg-primary/5' 
                      : file 
                        ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                        : 'border-border hover:border-primary hover:bg-accent'
                  }`}
                >
                  <input {...getInputProps()} />
                  
                  {file ? (
                    <div className="space-y-4">
                      <CheckCircle className="h-16 w-16 text-green-600 mx-auto" />
                      <div>
                        <p className="text-xl font-bold text-green-800 dark:text-green-400 mb-2">Arquivo selecionado!</p>
                        <p className="text-green-700 dark:text-green-500 text-lg">{file.name}</p>
                        <p className="text-green-600 dark:text-green-400 text-sm">
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
                      <FileText className="h-16 w-16 text-muted-foreground mx-auto" />
                      <div>
                        <p className="text-xl font-bold text-foreground mb-2">
                          {isDragActive 
                            ? 'Solte o arquivo aqui...' 
                            : 'Selecione seu projeto PDF'
                          }
                        </p>
                        <p className="text-muted-foreground">
                          Máximo 50MB • Apenas arquivos PDF
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Upload Button */}
                {file && projectName.trim() && (
                  <Button 
                    onClick={handleUpload}
                    className="w-full btn-primary-gradient py-4 text-lg font-semibold"
                    size="lg"
                  >
                    <Zap className="h-5 w-5 mr-2" />
                    Fazer Upload do Projeto
                  </Button>
                )}
              </>
            )}

            {/* Upload Progress */}
            {uploading && (
              <div className="space-y-6">
                <ProcessingProgress 
                  steps={steps}
                  currentStep={currentStep}
                  progress={processingProgress}
                  isProcessing={isProcessing}
                />
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-foreground font-medium">Progresso do upload</span>
                    <span className="text-primary font-bold">{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-3" />
                </div>
                <div className="bg-primary/10 border border-primary/20 rounded-xl p-4">
                  <div className="flex items-center space-x-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                    <span className="text-foreground font-medium">
                      Processando projeto "{projectName}"...
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Success State */}
            {uploadComplete && uploadedProject && (
              <div className="text-center space-y-6">
                <CheckCircle className="h-20 w-20 text-green-600 mx-auto" />
                <div>
                  <h3 className="text-2xl font-bold text-green-800 dark:text-green-400 mb-2">
                    Projeto "{projectName}" Processado!
                  </h3>
                  <p className="text-green-700 dark:text-green-500 text-lg mb-4">
                    Agora você pode analisar com IA para obter insights detalhados.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <AIButton 
                      projectData={uploadedProject}
                      onAnalysisComplete={handleAIAnalysisComplete}
                    />
                    <Button 
                      onClick={() => navigate('/painel')}
                      variant="outline"
                      className="btn-secondary-gradient"
                    >
                      Ir para Painel
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Card className="feature-card card-hover">
            <CardHeader>
              <div className="bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 p-3 rounded-2xl w-fit">
                <Bot className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle className="text-lg">Análise Inteligente</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                IA especializada extrai informações técnicas e identifica padrões arquitetônicos
              </p>
            </CardContent>
          </Card>

          <Card className="feature-card card-hover">
            <CardHeader>
              <div className="bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30 p-3 rounded-2xl w-fit">
                <Clock className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle className="text-lg">Processamento Rápido</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Análise completa em segundos, economizando horas de trabalho manual
              </p>
            </CardContent>
          </Card>

          <Card className="feature-card card-hover">
            <CardHeader>
              <div className="bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30 p-3 rounded-2xl w-fit">
                <BarChart3 className="h-6 w-6 text-purple-600" />
              </div>
              <CardTitle className="text-lg">Relatórios Detalhados</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
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
