import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload as UploadIcon } from 'lucide-react';
import SlideButton from '@/components/ui/slide-button';
import { AppLayout } from '@/components/layout/AppLayout';
import { EnhancedBreadcrumb } from '@/components/navigation/EnhancedBreadcrumb';
import ProjectNameField from '@/components/upload/ProjectNameField';
import FileDropzone from '@/components/upload/FileDropzone';
import UploadProgress from '@/components/upload/UploadProgress';
import UploadSuccess from '@/components/upload/UploadSuccess';
import { useUploadLogic } from '@/hooks/useUploadLogic';
import UploadProjectDialog from '@/components/upload/UploadProjectDialog';

const Upload = () => {
  const {
    file,
    projectName,
    stateUF,
    cityName,
    uploading,
    progress,
    uploadComplete,
    authLoading,
    isAuthenticated,
    steps,
    currentStep,
    isProcessing,
    processingProgress,
    setFile,
    setProjectName,
    setStateUF,
    setCityName,
    handleUpload,
    resetUpload
  } = useUploadLogic();

  const [dialogOpen, setDialogOpen] = useState(false);

  if (authLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-700 font-medium">Carregando...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <AppLayout>
      <div className="space-y-8">
        <EnhancedBreadcrumb />
        
        {/* Header clean e minimalista */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            {uploading ? 'Processando Projeto' : 'Novo Projeto'}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {uploading 
              ? 'Nossa IA está analisando seu projeto em tempo real' 
              : 'Faça upload do seu projeto em PDF e nossa IA irá analisar automaticamente'
            }
          </p>
        </div>

        {/* Main Upload Area */}
        <div className="max-w-4xl mx-auto">
          <Card className="border border-gray-200 bg-white shadow-sm">
            <CardHeader className="text-center border-b border-gray-100 bg-gray-50/50">
              <div className="w-16 h-16 mx-auto bg-blue-600 rounded-full flex items-center justify-center mb-4">
                <UploadIcon className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl text-gray-900">
                Upload de Projeto
              </CardTitle>
              <CardDescription className="text-base text-gray-600">
                Selecione um arquivo PDF para começar a análise
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              {!uploading && !uploadComplete && (
                <>
                  <div className="flex flex-col items-center justify-center gap-3">
                    <SlideButton onSlideComplete={() => setDialogOpen(true)} />
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Arraste para fazer upload
                    </p>
                  </div>

                  <UploadProjectDialog
                    open={dialogOpen}
                    onOpenChange={setDialogOpen}
                    projectName={projectName}
                    setProjectName={setProjectName}
                    file={file}
                    setFile={setFile}
                    stateUF={stateUF}
                    setStateUF={setStateUF}
                    cityName={cityName}
                    setCityName={setCityName}
                    onSubmit={async () => { await handleUpload(); setDialogOpen(false); }}
                    submitting={uploading}
                  />
                </>
              )}

              {/* Upload Progress */}
              {uploading && (
                <UploadProgress
                  steps={steps}
                  currentStep={currentStep}
                  processingProgress={processingProgress}
                  isProcessing={isProcessing}
                  uploadProgress={progress}
                  projectName={projectName}
                />
              )}

              {/* Success State */}
              {uploadComplete && (
                <UploadSuccess projectName={projectName} />
              )}

              {/* Reset Button */}
              {(uploadComplete || (!uploading && (file || projectName))) && (
                <div className="mt-8 text-center">
                  <Button 
                    variant="outline" 
                    onClick={resetUpload}
                    className="border-gray-300 text-gray-600 hover:border-gray-400 hover:bg-gray-50"
                  >
                    Enviar Outro Projeto
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Features Section Clean */}
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-white border border-gray-200 rounded-xl">
              <div className="w-12 h-12 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl">🤖</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">IA Avançada</h3>
              <p className="text-gray-600">Análise inteligente de documentos técnicos</p>
            </div>
            
            <div className="text-center p-6 bg-white border border-gray-200 rounded-xl">
              <div className="w-12 h-12 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Processamento Rápido</h3>
              <p className="text-gray-600">Resultados em poucos minutos</p>
            </div>
            
            <div className="text-center p-6 bg-white border border-gray-200 rounded-xl">
              <div className="w-12 h-12 mx-auto bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Relatórios Detalhados</h3>
              <p className="text-gray-600">Orçamentos e cronogramas automatizados</p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Upload;
