
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import UploadHeader from '@/components/upload/UploadHeader';
import ExistingProjectCard from '@/components/upload/ExistingProjectCard';
import ProjectNameField from '@/components/upload/ProjectNameField';
import FileDropzone from '@/components/upload/FileDropzone';
import UploadProgress from '@/components/upload/UploadProgress';
import UploadSuccess from '@/components/upload/UploadSuccess';
import UploadFeatures from '@/components/upload/UploadFeatures';
import { useUploadLogic } from '@/hooks/useUploadLogic';

const Upload = () => {
  const {
    file,
    projectName,
    uploading,
    progress,
    uploadComplete,
    validatedProject,
    authLoading,
    isAuthenticated,
    steps,
    currentStep,
    isProcessing,
    processingProgress,
    setFile,
    setProjectName,
    handleUpload,
    handleAnalyzeExisting,
    resetUpload
  } = useUploadLogic();

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
        <UploadHeader />

        <ExistingProjectCard 
          project={validatedProject}
          onAnalyze={handleAnalyzeExisting}
        />

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
                <ProjectNameField
                  value={projectName}
                  onChange={setProjectName}
                  disabled={uploading}
                />

                <FileDropzone
                  file={file}
                  onFileSelect={setFile}
                  onProjectNameChange={setProjectName}
                  projectName={projectName}
                />

                {/* Action Button */}
                {file && projectName.trim() && (
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
          </CardContent>
        </Card>

        <UploadFeatures />
      </div>

      <Footer />
    </div>
  );
};

export default Upload;
