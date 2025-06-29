
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { RefreshCw } from 'lucide-react';

interface ScheduleGenerationProgressProps {
  progress: number;
  projectArea: number;
}

export const ScheduleGenerationProgress = ({ progress, projectArea }: ScheduleGenerationProgressProps) => {
  return (
    <Card className="bg-white/80 backdrop-blur-sm border border-blue-200/50">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <RefreshCw className="h-5 w-5 animate-spin text-blue-600" />
            <span className="font-medium text-blue-900">
              Processando cronograma com IA baseada na lógica temporal consensual...
            </span>
          </div>
          <Progress value={progress} className="h-3 bg-blue-100" />
          <p className="text-sm text-blue-700">
            Analisando projeto de {projectArea}m² seguindo as 10 fases da construção civil
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
