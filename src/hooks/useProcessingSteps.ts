
import { useState, useEffect } from 'react';

export interface ProcessingStep {
  id: string;
  title: string;
  description: string;
  icon: string;
  duration: number;
  completed: boolean;
  active: boolean;
}

const PROCESSING_STEPS: Omit<ProcessingStep, 'completed' | 'active'>[] = [
  {
    id: 'upload',
    title: 'Enviando arquivo',
    description: 'Transferindo PDF para servidor',
    icon: '📤',
    duration: 2000,
  },
  {
    id: 'extract',
    title: 'Extraindo texto',
    description: 'Lendo conteúdo do PDF',
    icon: '📄',
    duration: 3000,
  },
  {
    id: 'analyze',
    title: 'Identificando elementos',
    description: 'Reconhecendo plantas e componentes técnicos',
    icon: '🔍',
    duration: 4000,
  },
  {
    id: 'calculate',
    title: 'Calculando quantitativos',
    description: 'Processando áreas e materiais',
    icon: '📊',
    duration: 3000,
  },
  {
    id: 'contextualize',
    title: 'Contextualizando IA',
    description: 'Preparando assistente especializado',
    icon: '🤖',
    duration: 2000,
  },
];

export const useProcessingSteps = () => {
  const [steps, setSteps] = useState<ProcessingStep[]>(
    PROCESSING_STEPS.map(step => ({
      ...step,
      completed: false,
      active: false,
    }))
  );
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const startProcessing = () => {
    setIsProcessing(true);
    setCurrentStepIndex(0);
    setProgress(0);
    
    // Reset all steps
    setSteps(prevSteps =>
      prevSteps.map(step => ({
        ...step,
        completed: false,
        active: false,
      }))
    );
  };

  const stopProcessing = () => {
    setIsProcessing(false);
    setCurrentStepIndex(-1);
    setProgress(100);
  };

  useEffect(() => {
    if (!isProcessing || currentStepIndex === -1) return;

    if (currentStepIndex >= steps.length) {
      stopProcessing();
      return;
    }

    const currentStep = steps[currentStepIndex];
    
    // Mark current step as active
    setSteps(prevSteps =>
      prevSteps.map((step, index) => ({
        ...step,
        active: index === currentStepIndex,
        completed: index < currentStepIndex,
      }))
    );

    const timer = setTimeout(() => {
      // Mark current step as completed
      setSteps(prevSteps =>
        prevSteps.map((step, index) => ({
          ...step,
          active: false,
          completed: index <= currentStepIndex,
        }))
      );

      const newProgress = ((currentStepIndex + 1) / steps.length) * 100;
      setProgress(newProgress);
      
      setCurrentStepIndex(prev => prev + 1);
    }, currentStep.duration);

    return () => clearTimeout(timer);
  }, [currentStepIndex, isProcessing, steps.length]);

  const currentStep = currentStepIndex >= 0 && currentStepIndex < steps.length 
    ? steps[currentStepIndex] 
    : null;

  return {
    steps,
    currentStep,
    isProcessing,
    progress,
    startProcessing,
    stopProcessing,
  };
};
