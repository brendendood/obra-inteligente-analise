
import { Card, CardContent } from '@/components/ui/card';
import { Clock, Calculator, TrendingUp, Calendar } from 'lucide-react';
import { ScheduleData } from '@/types/project';
import { AutoAbbrevNumber } from '@/components/ui/AutoAbbrevNumber';
interface ScheduleStatsCardsProps {
  scheduleData: ScheduleData;
}

export const ScheduleStatsCards = ({ scheduleData }: ScheduleStatsCardsProps) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      <Card className="overflow-hidden">
        <CardContent className="p-3 sm:p-4">
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm text-gray-600 truncate">Duração</p>
              <p className="text-lg sm:text-xl font-bold text-gray-900 truncate">
                {scheduleData.totalDuration}d
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="overflow-hidden">
        <CardContent className="p-3 sm:p-4">
          <div className="flex items-center space-x-2">
            <Calculator className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm text-gray-600 truncate">Custo</p>
              <p className="text-sm sm:text-lg font-bold text-gray-900 truncate">
                R$ <AutoAbbrevNumber value={scheduleData.totalCost} />
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="overflow-hidden">
        <CardContent className="p-3 sm:p-4">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm text-gray-600 truncate">Etapas</p>
              <p className="text-lg sm:text-xl font-bold text-gray-900">
                {scheduleData.tasks.length}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="overflow-hidden">
        <CardContent className="p-3 sm:p-4">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm text-gray-600 truncate">Status</p>
              <p className="text-sm sm:text-lg font-bold text-gray-900 truncate">
                Ativo
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
