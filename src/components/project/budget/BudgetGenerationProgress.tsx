
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { InlineUnifiedLoading } from '@/components/ui/unified-loading';

interface BudgetGenerationProgressProps {
  progress: number;
  projectArea: number;
}

export const BudgetGenerationProgress = ({ progress, projectArea }: BudgetGenerationProgressProps) => {
  return (
    <Card className="bg-blue-50/80 backdrop-blur-sm border border-blue-200/50">
      <CardContent className="p-6">
        <div className="space-y-4">
          <InlineUnifiedLoading text="Gerando orçamento..." />
          <Progress value={progress} className="h-3 bg-blue-100" />
          <p className="text-sm text-blue-700 text-center">
            Analisando {projectArea}m² com base SINAPI
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
