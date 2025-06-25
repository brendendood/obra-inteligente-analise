
import { Progress } from '@/components/ui/progress';
import ProcessingProgress from '@/components/common/ProcessingProgress';

interface ProcessingStep {
  id: number;
  title: string;
  description: string;
  status: 'pending' | 'active' | 'completed';
}

interface UploadProgressProps {
  steps: ProcessingStep[];
  currentStep: number;
  processingProgress: number;
  isProcessing: boolean;
  uploadProgress: number;
  projectName: string;
}

const UploadProgress = ({ 
  steps, 
  currentStep, 
  processingProgress, 
  isProcessing, 
  uploadProgress, 
  projectName 
}: UploadProgressProps) => {
  return (
    <div className="space-y-6">
      <ProcessingProgress 
        steps={steps}
        currentStep={currentStep}
        progress={processingProgress}
        isProcessing={isProcessing}
      />
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-slate-700 font-medium">Progresso do upload</span>
          <span className="text-blue-600 font-bold">{uploadProgress}%</span>
        </div>
        <Progress value={uploadProgress} className="h-3" />
      </div>
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
          <span className="text-blue-800 font-medium">
            Processando projeto "{projectName}" com IA...
          </span>
        </div>
      </div>
    </div>
  );
};

export default UploadProgress;
