
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { RefreshCw } from 'lucide-react';

interface BudgetGenerationProgressProps {
  progress: number;
  projectArea: number;
}

export const BudgetGenerationProgress = ({ progress, projectArea }: BudgetGenerationProgressProps) => {
  return (
    <Card className="bg-blue-50/80 backdrop-blur-sm border border-blue-200/50">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <RefreshCw className="h-5 w-5 animate-spin text-blue-600" />
            <span className="font-medium text-blue-900">
              Gerando orçamento automaticamente com MadenAI...
            </span>
          </div>
          <Progress value={progress} className="h-3 bg-blue-100" />
          <p className="text-sm text-blue-700">
            Analisando {projectArea}m² e consultando base SINAPI atualizada
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
