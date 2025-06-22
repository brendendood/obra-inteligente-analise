
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Upload, Check, Brain, FileSearch, Sparkles, Bot, Calculator, Calendar, FileCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useProject } from '@/contexts/ProjectContext';
import PremiumHeader from '@/components/common/PremiumHeader';
import ActionButton from '@/components/common/ActionButton';

const UploadPage = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { uploadProject, isLoading, currentProject } = useProject();

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    
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
  }, [toast]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    if (!uploadedFile) return;
    
    const success = await uploadProject(uploadedFile);
    if (success) {
      // Clear uploaded file after successful processing
      setUploadedFile(null);
    }
  };

  const navigationItems = [
    { icon: <Bot className="h-6 w-6 text-purple-600" />, label: "Assistente IA", path: "/assistant" },
    { icon: <Calculator className="h-6 w-6 text-orange-600" />, label: "Orçamento", path: "/budget" },
    { icon: <Calendar className="h-6 w-6 text-blue-600" />, label: "Cronograma", path: "/schedule" },
    { icon: <FileCheck className="h-6 w-6 text-red-600" />, label: "Documentos", path: "/documents" }
  ];

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
            Envie seu projeto PDF. A IA lerá e ajudará com orçamentos, cronogramas e questões técnicas.
          </p>
        </div>

        {/* Current Project Status */}
        {currentProject && (
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
                    Área: {currentProject.total_area}m² • Tipo: {currentProject.project_type}
                  </p>
                  <p className="text-sm text-green-600">
                    Analisado em {new Date(currentProject.created_at).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                    ✅ Texto extraído
                  </span>
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                    📊 Análise completa
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
        <Card className="mb-8 sm:mb-12 shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center">
              <Upload className="h-6 w-6 mr-3 text-blue-600" />
              Enviar Novo Projeto
            </CardTitle>
            <CardDescription className="text-base sm:text-lg text-slate-600">
              Plantas, memoriais, projetos arquitetônicos e estruturais em PDF
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
                      <span>Pronto para análise</span>
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
                      <span>• Plantas</span>
                      <span>• Memoriais</span>
                      <span>• Projetos</span>
                    </div>
                  </div>
                </div>
              )}
              
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileInput}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={isLoading}
              />
            </div>

            {uploadedFile && (
              <div className="mt-6 sm:mt-8 space-y-6">
                <ActionButton
                  size="lg"
                  onClick={processProject}
                  isLoading={isLoading}
                  disabled={isLoading}
                  className="w-full"
                  icon={!isLoading ? <Sparkles className="h-5 w-5" /> : undefined}
                >
                  {isLoading ? "Processando com IA Real..." : "Analisar com IA Especializada"}
                </ActionButton>

                {isLoading && (
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 sm:p-6">
                    <div className="flex items-start space-x-4">
                      <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-blue-600 mt-1"></div>
                      <div className="flex-1">
                        <p className="font-bold text-blue-900 mb-2">IA processando projeto real...</p>
                        <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-blue-700">
                          <p>📤 Enviando arquivo para servidor</p>
                          <p>🔍 Extraindo texto do PDF</p>
                          <p>📐 Identificando elementos técnicos</p>
                          <p>📊 Calculando quantitativos</p>
                          <p>🎯 Contextualizando IA especializada</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {navigationItems.map((item, index) => (
            <ActionButton
              key={index}
              variant="outline"
              onClick={() => navigate(item.path)}
              className="h-20 sm:h-24 flex flex-col space-y-2 sm:space-y-3 hover:shadow-lg hover:scale-105 transition-all duration-300"
              disabled={!currentProject && item.path !== '/assistant'}
            >
              {item.icon}
              <span className="font-semibold text-xs sm:text-sm">{item.label}</span>
              {!currentProject && item.path !== '/assistant' && (
                <span className="text-xs text-slate-400">Requer projeto</span>
              )}
            </ActionButton>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UploadPage;
