
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Loader2 } from 'lucide-react';
import { ProcessingStep } from '@/hooks/useProcessingSteps';

interface ProcessingProgressProps {
  steps: ProcessingStep[];
  currentStep: ProcessingStep | null;
  progress: number;
  isProcessing: boolean;
}

const ProcessingProgress = ({ 
  steps, 
  currentStep, 
  progress, 
  isProcessing 
}: ProcessingProgressProps) => {
  if (!isProcessing && progress === 0) return null;

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {isProcessing ? (
            <Loader2 className="h-6 w-6 text-blue-600 animate-spin" />
          ) : (
            <CheckCircle className="h-6 w-6 text-green-600" />
          )}
          <div>
            <h3 className="font-bold text-blue-900">
              {isProcessing ? 'IA processando projeto...' : 'Análise concluída!'}
            </h3>
            {currentStep && (
              <p className="text-sm text-blue-700">
                {currentStep.title} - {currentStep.description}
              </p>
            )}
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-blue-800">{Math.round(progress)}%</div>
          <div className="text-xs text-blue-600">progresso</div>
        </div>
      </div>

      {/* Progress Bar */}
      <Progress value={progress} className="h-3" />

      {/* Steps List */}
      <div className="space-y-3">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={`flex items-center space-x-3 transition-all duration-300 ${
              step.active
                ? 'text-blue-800 font-medium'
                : step.completed
                ? 'text-green-700'
                : 'text-slate-500'
            }`}
          >
            <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm">
              {step.completed ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : step.active ? (
                <div className="animate-pulse text-lg">{step.icon}</div>
              ) : (
                <div className="text-lg opacity-50">{step.icon}</div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <span className="font-medium">{step.title}</span>
                {step.active && (
                  <div className="flex space-x-1">
                    <div className="w-1 h-1 bg-blue-600 rounded-full animate-ping"></div>
                    <div className="w-1 h-1 bg-blue-600 rounded-full animate-ping" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-1 h-1 bg-blue-600 rounded-full animate-ping" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                )}
              </div>
              <div className="text-sm opacity-80">{step.description}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Completion Message */}
      {!isProcessing && progress === 100 && (
        <div className="bg-green-100 border border-green-200 rounded-lg p-4 text-center">
          <div className="text-green-800 font-medium mb-1">
            🎉 Projeto analisado com sucesso!
          </div>
          <div className="text-sm text-green-700">
            A IA está pronta para responder suas perguntas técnicas
          </div>
        </div>
      )}
    </div>
  );
};

export default ProcessingProgress;
