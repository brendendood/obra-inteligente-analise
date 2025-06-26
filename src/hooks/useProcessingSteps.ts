
export interface ProcessingStep {
  id: string;
  name: string;
  label: string;
  completed: boolean;
  description?: string;
}

export const useProcessingSteps = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const steps: ProcessingStep[] = [
    {
      id: '1',
      name: 'upload',
      label: 'Enviando arquivos...',
      completed: false,
      description: 'Fazendo upload dos documentos do projeto'
    },
    {
      id: '2',
      name: 'extract',
      label: 'Extraindo texto e dados...',
      completed: false,
      description: 'Analisando plantas e documentos técnicos'
    },
    {
      id: '3',
      name: 'analyze',
      label: 'Analisando com IA...',
      completed: false,
      description: 'Processamento inteligente dos dados do projeto'
    },
    {
      id: '4',
      name: 'generate',
      label: 'Gerando relatórios...',
      completed: false,
      description: 'Criando análises técnicas e quantitativos'
    },
    {
      id: '5',
      name: 'complete',
      label: 'Finalizando processamento...',
      completed: false,
      description: 'Preparando dados para visualização'
    }
  ];

  const currentStep = steps[currentStepIndex] || null;

  const startProcessing = () => {
    setIsProcessing(true);
    setCurrentStepIndex(0);
    setProgress(0);
  };

  const nextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
      setProgress((currentStepIndex + 1) * 20);
    }
  };

  const stopProcessing = () => {
    setIsProcessing(false);
    setProgress(100);
  };

  return {
    steps,
    currentStep,
    isProcessing,
    progress,
    startProcessing,
    nextStep,
    stopProcessing
  };
};

const { useState } = require('react');
