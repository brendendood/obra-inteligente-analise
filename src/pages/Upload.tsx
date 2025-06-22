import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Upload, Check, Brain, FileSearch, Sparkles, Bot, Calculator, Calendar, FileCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useProject } from '@/contexts/ProjectContext';
import { useProcessingSteps } from '@/hooks/useProcessingSteps';
import { useAuth } from '@/hooks/useAuth';
import PremiumHeader from '@/components/common/PremiumHeader';
import ActionButton from '@/components/common/ActionButton';
import ProcessingProgress from '@/components/common/ProcessingProgress';
import AuthComponent from '@/components/auth/AuthComponent';

const UploadPage = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { uploadProject, isLoading, currentProject, loadUserProjects, requiresAuth } = useProject();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const { 
    steps, 
    currentStep, 
    progress, 
    isProcessing, 
    startProcessing, 
    stopProcessing 
  } = useProcessingSteps();

  // Carregar projetos do usuário quando autenticado
  useEffect(() => {
    if (isAuthenticated) {
      loadUserProjects();
    }
  }, [isAuthenticated, loadUserProjects]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (!isAuthenticated) {
      toast({
        title: "🔐 Login necessário",
        description: "Faça login para enviar arquivos.",
        variant: "destructive",
      });
      return;
    }
    
    const files = Array.from(e.dataTransfer.files);
    const pdfFile = files.find(file => file.type === 'application/pdf');
    
    if (pdfFile) {
      setUploadedFile(pdfFile);
      toast({
        title: "✅ Arquivo carregado!",
        description: `${pdfFile.name} pronto para análise.`,
      });
    } else {
      toast({
        title: "❌ Formato inválido",
        description: "Envie apenas arquivos PDF.",
        variant: "destructive",
      });
    }
  }, [toast, isAuthenticated]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isAuthenticated) {
      toast({
        title: "🔐 Login necessário",
        description: "Faça login para enviar arquivos.",
        variant: "destructive",
      });
      return;
    }

    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setUploadedFile(file);
      toast({
        title: "✅ Arquivo carregado!",
        description: `${file.name} pronto para análise.`,
      });
    }
  };

  const processProject = async () => {
    if (!uploadedFile || !isAuthenticated) return;
    
    // Iniciar feedback visual de processamento
    startProcessing();
    
    try {
      const success = await uploadProject(uploadedFile);
      
      if (success) {
        // Aguardar animação de processamento completar
        setTimeout(() => {
          stopProcessing();
          setUploadedFile(null);
          
          // Mostrar mensagem de sucesso e redirecionar
          toast({
            title: "🎉 Análise concluída!",
            description: "A IA está pronta para ajudar. Redirecionando...",
          });
          
          setTimeout(() => {
            navigate('/assistant');
          }, 1500);
        }, 1000);
      } else {
        stopProcessing();
      }
    } catch (error) {
      stopProcessing();
      console.error('Processing error:', error);
    }
  };

  const navigationItems = [
    { 
      icon: <Bot className="h-6 w-6 text-purple-600" />, 
      label: "Assistente IA", 
      path: "/assistant",
      requiresProject: false
    },
    { 
      icon: <Calculator className="h-6 w-6 text-orange-600" />, 
      label: "Orçamento", 
      path: "/budget",
      requiresProject: true
    },
    { 
      icon: <Calendar className="h-6 w-6 text-blue-600" />, 
      label: "Cronograma", 
      path: "/schedule",
      requiresProject: true
    },
    { 
      icon: <FileCheck className="h-6 w-6 text-red-600" />, 
      label: "Documentos", 
      path: "/documents",
      requiresProject: true
    }
  ];

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <PremiumHeader
        title="ArqFlow.IA"
        subtitle="Upload Inteligente"
        icon={<FileText className="h-6 w-6 text-white" />}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Hero Section */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Brain className="h-4 w-4" />
            <span>IA Especializada em Engenharia</span>
          </div>
          
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
            Upload e Análise Inteligente
          </h2>
          <p className="text-base sm:text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Envie qualquer PDF. A IA analisará e ajudará com questões técnicas, orçamentos e cronogramas.
          </p>
        </div>

        {/* Authentication Section */}
        {!isAuthenticated && (
          <div className="mb-8 sm:mb-12">
            <AuthComponent onAuthSuccess={() => {
              toast({
                title: "🎉 Login realizado!",
                description: "Agora você pode enviar seus projetos.",
              });
            }} />
          </div>
        )}

        {/* Current Project Status */}
        {currentProject && isAuthenticated && (
          <Card className="mb-8 sm:mb-12 shadow-2xl border-0 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-green-800 flex items-center">
                <Check className="h-6 w-6 mr-3 text-green-600" />
                Projeto Ativo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-lg font-bold text-green-900">{currentProject.name}</p>
                  <p className="text-green-700">
                    {currentProject.total_area ? `Área: ${currentProject.total_area}m² • ` : ''}
                    Tipo: {currentProject.project_type}
                  </p>
                  <p className="text-sm text-green-600">
                    Analisado em {new Date(currentProject.created_at).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                    ✅ Processado
                  </span>
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                    📊 Analisado
                  </span>
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                    🤖 IA contextualizada
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Upload Card */}
        {isAuthenticated && (
          <Card className="mb-8 sm:mb-12 shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center">
                <Upload className="h-6 w-6 mr-3 text-blue-600" />
                Enviar Novo Projeto
              </CardTitle>
              <CardDescription className="text-base sm:text-lg text-slate-600">
                Qualquer PDF é aceito - projetos técnicos terão análise detalhada
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className={`border-2 border-dashed rounded-2xl p-8 sm:p-16 text-center transition-all duration-300 ${
                  isDragOver
                    ? 'border-blue-400 bg-blue-50 scale-105'
                    : uploadedFile
                    ? 'border-emerald-400 bg-emerald-50'
                    : 'border-slate-300 hover:border-blue-400 hover:bg-blue-50'
                }`}
                onDrop={handleDrop}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragOver(true);
                }}
                onDragLeave={() => setIsDragOver(false)}
              >
                {uploadedFile ? (
                  <div className="space-y-4 sm:space-y-6">
                    <div className="flex items-center justify-center">
                      <div className="bg-emerald-100 p-4 rounded-full">
                        <Check className="h-8 sm:h-12 w-8 sm:w-12 text-emerald-600" />
                      </div>
                    </div>
                    <div>
                      <p className="text-lg sm:text-xl font-bold text-emerald-800 mb-2 break-words">
                        {uploadedFile.name}
                      </p>
                      <p className="text-emerald-600 font-medium">
                        {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                      <div className="flex items-center justify-center space-x-2 mt-4 text-sm text-emerald-700">
                        <FileSearch className="h-4 w-4" />
                        <span>Pronto para análise com IA</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 sm:space-y-6">
                    <div className="flex items-center justify-center">
                      <div className="bg-blue-100 p-4 rounded-full">
                        <Upload className="h-8 sm:h-12 w-8 sm:w-12 text-blue-600" />
                      </div>
                    </div>
                    <div>
                      <p className="text-lg sm:text-xl font-bold text-slate-800 mb-2">
                        Arraste seu PDF aqui
                      </p>
                      <p className="text-slate-600 mb-4">
                        ou clique para selecionar
                      </p>
                      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs sm:text-sm text-slate-500">
                        <span>• Aceita qualquer PDF</span>
                        <span>• Projetos técnicos têm análise completa</span>
                        <span>• IA sempre disponível</span>
                      </div>
                    </div>
                  </div>
                )}
                
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileInput}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={isLoading || isProcessing}
                />
              </div>

              {uploadedFile && (
                <div className="mt-6 sm:mt-8 space-y-6">
                  <ActionButton
                    size="lg"
                    onClick={processProject}
                    isLoading={isProcessing}
                    disabled={isProcessing}
                    className="w-full"
                    icon={!isProcessing ? <Sparkles className="h-5 w-5" /> : undefined}
                  >
                    {isProcessing ? "IA Analisando..." : "🤖 Analisar com IA Especializada"}
                  </ActionButton>

                  <ProcessingProgress
                    steps={steps}
                    currentStep={currentStep}
                    progress={progress}
                    isProcessing={isProcessing}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Navigation Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {navigationItems.map((item, index) => {
            const isDisabled = !isAuthenticated || (item.requiresProject && !currentProject);
            
            return (
              <ActionButton
                key={index}
                variant="outline"
                onClick={() => navigate(item.path)}
                className={`h-20 sm:h-24 flex flex-col space-y-2 sm:space-y-3 hover:shadow-lg hover:scale-105 transition-all duration-300 ${
                  isDisabled ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={isDisabled}
              >
                {item.icon}
                <span className="font-semibold text-xs sm:text-sm">{item.label}</span>
                {!isAuthenticated && (
                  <span className="text-xs text-slate-400">Requer login</span>
                )}
                {isAuthenticated && item.requiresProject && !currentProject && (
                  <span className="text-xs text-slate-400">Requer projeto</span>
                )}
              </ActionButton>
            );
          })}
        </div>

        {/* Informational Note */}
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800 text-center">
            💡 <strong>Nova funcionalidade:</strong> Agora aceitamos qualquer PDF! 
            Projetos técnicos terão análise detalhada, mas a IA sempre pode ajudar com questões gerais.
            {!isAuthenticated && " Faça login para começar."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;
