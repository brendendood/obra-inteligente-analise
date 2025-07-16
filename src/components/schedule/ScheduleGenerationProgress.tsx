
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { RefreshCw, Hammer } from 'lucide-react';

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
            <div className="animate-hammer">
              <Hammer className="h-5 w-5 text-orange-500" />
            </div>
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
