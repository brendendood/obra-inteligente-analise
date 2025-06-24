
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Bot, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AIButtonProps {
  projectData?: any;
  disabled?: boolean;
  onAnalysisComplete?: (result: any) => void;
}

const AIButton: React.FC<AIButtonProps> = ({ 
  projectData, 
  disabled = false, 
  onAnalysisComplete 
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  const handleAIAnalysis = async () => {
    if (!projectData) {
      toast({
        title: "❌ Projeto não encontrado",
        description: "Faça upload de um projeto primeiro.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);

    try {
      console.log('Enviando dados para webhook de IA:', projectData);

      const response = await fetch('https://brendendood.app.n8n.cloud/webhook-test/agente-ia-orcamento', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          project: {
            id: projectData.id,
            name: projectData.name,
            type: projectData.project_type,
            area: projectData.total_area,
            rooms: projectData.analysis_data?.extractedInfo?.roomCount,
            analysisData: projectData.analysis_data
          },
          timestamp: new Date().toISOString()
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Resposta do webhook de IA:', result);

      toast({
        title: "🤖 Análise de IA concluída!",
        description: "Os dados foram processados pela inteligência artificial.",
      });

      if (onAnalysisComplete) {
        onAnalysisComplete(result);
      }

    } catch (error) {
      console.error('Erro na análise de IA:', error);
      
      toast({
        title: "❌ Erro na análise",
        description: "Não foi possível conectar com o serviço de IA. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Button
      onClick={handleAIAnalysis}
      disabled={disabled || isAnalyzing || !projectData}
      className="btn-primary-gradient min-w-[160px]"
      size="lg"
    >
      {isAnalyzing ? (
        <>
          <Loader2 className="h-5 w-5 mr-2 animate-spin" />
          Analisando...
        </>
      ) : (
        <>
          <Bot className="h-5 w-5 mr-2" />
          Analisar com IA
        </>
      )}
    </Button>
  );
};

export default AIButton;
