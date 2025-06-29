
import { Card, CardContent } from '@/components/ui/card';
import { Calendar } from 'lucide-react';

interface ScheduleEmptyStateProps {
  projectName: string;
}

export const ScheduleEmptyState = ({ projectName }: ScheduleEmptyStateProps) => {
  return (
    <Card>
      <CardContent className="text-center py-16">
        <Calendar className="h-16 w-16 text-blue-400 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-700 mb-2">
          Cronograma Inteligente com IA
        </h3>
        <p className="text-gray-500 mb-6 max-w-md mx-auto">
          Gere um cronograma detalhado baseado na lógica temporal consensual da construção civil, 
          com recálculo automático de datas e validação técnica para {projectName}.
        </p>
      </CardContent>
    </Card>
  );
};
