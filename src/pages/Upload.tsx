
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Upload, ArrowLeft, Check, Zap, Brain, FileSearch, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const UploadPage = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const pdfFile = files.find(file => file.type === 'application/pdf');
    
    if (pdfFile) {
      setUploadedFile(pdfFile);
      toast({
        title: "✅ Arquivo carregado com sucesso!",
        description: `${pdfFile.name} está pronto para análise inteligente.`,
      });
    } else {
      toast({
        title: "❌ Erro no upload",
        description: "Por favor, envie apenas arquivos PDF (plantas, memoriais, projetos).",
        variant: "destructive",
      });
    }
  }, [toast]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setUploadedFile(file);
      toast({
        title: "✅ Arquivo carregado com sucesso!",
        description: `${file.name} está pronto para análise inteligente.`,
      });
    }
  };

  const processProject = async () => {
    if (!uploadedFile) return;
    
    setIsProcessing(true);
    
    // Simular processamento do PDF com etapas
    setTimeout(() => {
      setIsProcessing(false);
      toast({
        title: "🎉 Projeto analisado com sucesso!",
        description: "IA extraiu todos os dados técnicos. Explore as funcionalidades disponíveis.",
      });
      // Salvar dados do projeto no localStorage
      localStorage.setItem('currentProject', JSON.stringify({
        name: uploadedFile.name,
        uploadDate: new Date().toISOString(),
        processed: true
      }));
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Modern Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-blue-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/')}
                className="hover:bg-blue-50 transition-colors duration-200"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-xl shadow-lg">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-900 to-indigo-800 bg-clip-text text-transparent">
                  ArqFlow.IA
                </h1>
                <p className="text-sm text-slate-600 font-medium">Upload Inteligente</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Brain className="h-4 w-4" />
            <span>IA Especializada em Engenharia</span>
          </div>
          
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Upload e Leitura Inteligente
          </h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            Envie seu projeto em PDF. A IA vai ler e te ajudar com orçamento, cronograma e dúvidas técnicas.
          </p>
        </div>

        {/* Enhanced Upload Card */}
        <Card className="mb-12 shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-slate-900 flex items-center">
              <Upload className="h-6 w-6 mr-3 text-blue-600" />
              Enviar Projeto
            </CardTitle>
            <CardDescription className="text-lg text-slate-600">
              Aceita plantas baixas, memoriais descritivos, projetos arquitetônicos e estruturais em PDF
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              className={`border-2 border-dashed rounded-2xl p-16 text-center transition-all duration-300 ${
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
                <div className="space-y-6">
                  <div className="flex items-center justify-center">
                    <div className="bg-emerald-100 p-4 rounded-full">
                      <Check className="h-12 w-12 text-emerald-600" />
                    </div>
                  </div>
                  <div>
                    <p className="text-xl font-bold text-emerald-800 mb-2">
                      {uploadedFile.name}
                    </p>
                    <p className="text-emerald-600 font-medium">
                      Arquivo carregado - {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                    <div className="flex items-center justify-center space-x-2 mt-4 text-sm text-emerald-700">
                      <FileSearch className="h-4 w-4" />
                      <span>Pronto para análise inteligente</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center justify-center">
                    <div className="bg-blue-100 p-4 rounded-full">
                      <Upload className="h-12 w-12 text-blue-600" />
                    </div>
                  </div>
                  <div>
                    <p className="text-xl font-bold text-slate-800 mb-2">
                      Arraste seu arquivo PDF aqui
                    </p>
                    <p className="text-slate-600 mb-4">
                      ou clique para selecionar do seu computador
                    </p>
                    <div className="flex items-center justify-center space-x-4 text-sm text-slate-500">
                      <span>• Plantas baixas</span>
                      <span>• Memoriais</span>
                      <span>• Projetos técnicos</span>
                    </div>
                  </div>
                </div>
              )}
              
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileInput}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>

            {uploadedFile && (
              <div className="mt-8 space-y-6">
                <Button
                  onClick={processProject}
                  disabled={isProcessing}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl"
                  size="lg"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      Analisando com IA...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5 mr-3" />
                      Processar e Analisar Projeto
                    </>
                  )}
                </Button>

                {isProcessing && (
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
                    <div className="flex items-start space-x-4">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mt-1"></div>
                      <div className="flex-1">
                        <p className="font-bold text-blue-900 mb-2">IA processando seu projeto...</p>
                        <div className="space-y-2 text-sm text-blue-700">
                          <p>🔍 Extraindo dados técnicos</p>
                          <p>📐 Identificando elementos construtivos</p>
                          <p>📊 Calculando quantitativos</p>
                          <p>💰 Preparando análises de custos</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Enhanced Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Button
            variant="outline"
            className="h-24 flex flex-col space-y-3 hover:shadow-lg hover:scale-105 transition-all duration-300 border-2 bg-white/80 backdrop-blur-sm"
            onClick={() => navigate('/assistant')}
          >
            <Bot className="h-8 w-8 text-purple-600" />
            <span className="font-semibold">Assistente IA</span>
          </Button>
          <Button
            variant="outline"
            className="h-24 flex flex-col space-y-3 hover:shadow-lg hover:scale-105 transition-all duration-300 border-2 bg-white/80 backdrop-blur-sm"
            onClick={() => navigate('/budget')}
          >
            <Calculator className="h-8 w-8 text-orange-600" />
            <span className="font-semibold">Orçamento</span>
          </Button>
          <Button
            variant="outline"
            className="h-24 flex flex-col space-y-3 hover:shadow-lg hover:scale-105 transition-all duration-300 border-2 bg-white/80 backdrop-blur-sm"
            onClick={() => navigate('/schedule')}
          >
            <Zap className="h-8 w-8 text-blue-600" />
            <span className="font-semibold">Cronograma</span>
          </Button>
          <Button
            variant="outline"
            className="h-24 flex flex-col space-y-3 hover:shadow-lg hover:scale-105 transition-all duration-300 border-2 bg-white/80 backdrop-blur-sm"
            onClick={() => navigate('/documents')}
          >
            <FileText className="h-8 w-8 text-red-600" />
            <span className="font-semibold">Documentos</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;
