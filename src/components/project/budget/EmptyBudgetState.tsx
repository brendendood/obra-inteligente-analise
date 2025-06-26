
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calculator } from 'lucide-react';

interface EmptyBudgetStateProps {
  projectName: string;
  projectArea: number;
  onGenerateBudget: () => void;
}

export const EmptyBudgetState = ({ 
  projectName, 
  projectArea, 
  onGenerateBudget 
}: EmptyBudgetStateProps) => {
  return (
    <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/50">
      <CardContent className="text-center py-16">
        <Calculator className="h-16 w-16 text-blue-400 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-700 mb-2">
          Orçamento Inteligente para {projectName}
        </h3>
        <p className="text-gray-500 mb-6 max-w-md mx-auto">
          Gere um orçamento detalhado e editável baseado na análise automatizada 
          do seu projeto de {projectArea}m² com preços SINAPI atualizados.
        </p>
        <Button 
          onClick={onGenerateBudget}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Calculator className="h-4 w-4 mr-2" />
          Gerar Orçamento Automático
        </Button>
      </CardContent>
    </Card>
  );
};
