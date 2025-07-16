
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { RefreshCw, Hammer } from 'lucide-react';

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
            <div className="animate-hammer">
              <Hammer className="h-5 w-5 text-orange-500" />
            </div>
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
