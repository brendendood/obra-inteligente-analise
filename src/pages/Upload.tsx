
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Upload, ArrowLeft, Check } from 'lucide-react';
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
        title: "Arquivo carregado com sucesso!",
        description: `${pdfFile.name} está pronto para análise.`,
      });
    } else {
      toast({
        title: "Erro no upload",
        description: "Por favor, envie apenas arquivos PDF.",
        variant: "destructive",
      });
    }
  }, [toast]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setUploadedFile(file);
      toast({
        title: "Arquivo carregado com sucesso!",
        description: `${file.name} está pronto para análise.`,
      });
    }
  };

  const processProject = async () => {
    if (!uploadedFile) return;
    
    setIsProcessing(true);
    
    // Simular processamento do PDF
    setTimeout(() => {
      setIsProcessing(false);
      toast({
        title: "Projeto analisado com sucesso!",
        description: "Seus dados estão prontos. Explore as funcionalidades disponíveis.",
      });
      // Salvar dados do projeto no localStorage para uso nas outras telas
      localStorage.setItem('currentProject', JSON.stringify({
        name: uploadedFile.name,
        uploadDate: new Date().toISOString(),
        processed: true
      }));
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button variant="ghost" onClick={() => navigate('/')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
              <div className="bg-blue-600 p-2 rounded-lg">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">ArqFlow.IA</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Upload e Leitura Inteligente
          </h2>
          <p className="text-lg text-gray-600">
            Faça o upload do seu projeto em PDF. A plataforma vai analisar os dados e te ajudar com orçamentos, cronograma e dúvidas técnicas.
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Enviar Projeto</CardTitle>
            <CardDescription>
              Aceita arquivos PDF com plantas, memoriais descritivos, projetos arquitetônicos e estruturais.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
                isDragOver
                  ? 'border-blue-400 bg-blue-50'
                  : uploadedFile
                  ? 'border-green-400 bg-green-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDrop={handleDrop}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragOver(true);
              }}
              onDragLeave={() => setIsDragOver(false)}
            >
              {uploadedFile ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-center">
                    <Check className="h-12 w-12 text-green-600" />
                  </div>
                  <div>
                    <p className="text-lg font-medium text-green-800">
                      {uploadedFile.name}
                    </p>
                    <p className="text-sm text-green-600">
                      Arquivo carregado - {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto" />
                  <div>
                    <p className="text-lg font-medium text-gray-700">
                      Arraste seu arquivo PDF aqui
                    </p>
                    <p className="text-sm text-gray-500">
                      ou clique para selecionar
                    </p>
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
              <div className="mt-6 space-y-4">
                <Button
                  onClick={processProject}
                  disabled={isProcessing}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  size="lg"
                >
                  {isProcessing ? (
                    <>Analisando projeto...</>
                  ) : (
                    <>Processar e Analisar Projeto</>
                  )}
                </Button>

                {isProcessing && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center space-x-3">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                      <div>
                        <p className="font-medium text-blue-800">Processando seu projeto...</p>
                        <p className="text-sm text-blue-600">
                          Extraindo dados, identificando elementos construtivos e preparando análises.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation to other features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button
            variant="outline"
            className="h-20 flex flex-col space-y-2"
            onClick={() => navigate('/assistant')}
          >
            <FileText className="h-6 w-6" />
            <span>Assistente IA</span>
          </Button>
          <Button
            variant="outline"
            className="h-20 flex flex-col space-y-2"
            onClick={() => navigate('/budget')}
          >
            <FileText className="h-6 w-6" />
            <span>Orçamento</span>
          </Button>
          <Button
            variant="outline"
            className="h-20 flex flex-col space-y-2"
            onClick={() => navigate('/schedule')}
          >
            <FileText className="h-6 w-6" />
            <span>Cronograma</span>
          </Button>
          <Button
            variant="outline"
            className="h-20 flex flex-col space-y-2"
            onClick={() => navigate('/documents')}
          >
            <FileText className="h-6 w-6" />
            <span>Documentos</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;
