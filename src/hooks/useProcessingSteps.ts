
import { useState } from 'react';

export interface ProcessingStep {
  id: string;
  name: string;
  label: string;
  title: string;
  completed: boolean;
  active: boolean;
  description?: string;
  icon?: string;
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
      title: 'Upload dos Documentos',
      completed: false,
      active: false,
      description: 'Fazendo upload dos documentos do projeto',
      icon: '📁'
    },
    {
      id: '2',
      name: 'extract',
      label: 'Extraindo texto e dados...',
      title: 'Extração de Dados',
      completed: false,
      active: false,
      description: 'Analisando plantas e documentos técnicos',
      icon: '🔍'
    },
    {
      id: '3',
      name: 'analyze',
      label: 'Analisando com IA...',
      title: 'Análise Inteligente',
      completed: false,
      active: false,
      description: 'Processamento inteligente dos dados do projeto',
      icon: '🤖'
    },
    {
      id: '4',
      name: 'generate',
      label: 'Gerando relatórios...',
      title: 'Geração de Relatórios',
      completed: false,
      active: false,
      description: 'Criando análises técnicas e quantitativos',
      icon: '📊'
    },
    {
      id: '5',
      name: 'complete',
      label: 'Finalizando processamento...',
      title: 'Finalização',
      completed: false,
      active: false,
      description: 'Preparando dados para visualização',
      icon: '✅'
    }
  ];

  // Atualizar steps com estado ativo baseado no currentStepIndex
  const updatedSteps = steps.map((step, index) => ({
    ...step,
    completed: index < currentStepIndex,
    active: index === currentStepIndex
  }));

  const currentStep = updatedSteps[currentStepIndex] || null;

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
    steps: updatedSteps,
    currentStep,
    isProcessing,
    progress,
    startProcessing,
    nextStep,
    stopProcessing
  };
};
