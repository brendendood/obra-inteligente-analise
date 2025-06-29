
import { Card, CardContent } from '@/components/ui/card';
import { Clock, Calculator, TrendingUp, Calendar } from 'lucide-react';
import { ScheduleData } from '@/types/project';

interface ScheduleStatsCardsProps {
  scheduleData: ScheduleData;
}

export const ScheduleStatsCards = ({ scheduleData }: ScheduleStatsCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">Duração Total</p>
              <p className="text-xl font-bold text-gray-900">{scheduleData.totalDuration} dias</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <Calculator className="h-5 w-5 text-green-600" />
            <div>
              <p className="text-sm text-gray-600">Custo Total</p>
              <p className="text-xl font-bold text-gray-900">
                R$ {scheduleData.totalCost.toLocaleString('pt-BR')}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-purple-600" />
            <div>
              <p className="text-sm text-gray-600">Etapas</p>
              <p className="text-xl font-bold text-gray-900">{scheduleData.tasks.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-orange-600" />
            <div>
              <p className="text-sm text-gray-600">Status</p>
              <p className="text-xl font-bold text-gray-900">Inteligente</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
