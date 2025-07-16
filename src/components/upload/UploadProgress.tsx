
import { Progress } from '@/components/ui/progress';
import ProcessingProgress from '@/components/common/ProcessingProgress';
import { ProcessingStep } from '@/hooks/useProcessingSteps';

interface UploadProgressProps {
  steps: ProcessingStep[];
  currentStep: ProcessingStep | null;
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
      
      {/* Progresso visual apenas - sem notificações sonoras */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-slate-700 font-medium">Progresso do upload</span>
          <span className="text-blue-600 font-bold">{uploadProgress}%</span>
        </div>
        <Progress value={uploadProgress} className="h-3" />
      </div>
      
      {/* Status visual apenas - interface limpa */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-center space-x-3">
          <div className="animate-hammer">
            <Hammer className="h-5 w-5 text-orange-500" />
          </div>
          <span className="text-blue-800 font-medium">
            Processando "{projectName}" com MadenAI...
          </span>
        </div>
        
        {/* Progresso silencioso */}
        <div className="mt-3">
          <div className="text-xs text-blue-600 mb-2">
            {currentStep?.label || 'Inicializando processamento...'}
          </div>
          <div className="w-full bg-blue-100 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${processingProgress}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadProgress;
