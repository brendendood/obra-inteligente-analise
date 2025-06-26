
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { BarChart3, Clock, CheckCircle, AlertCircle } from 'lucide-react';

interface ProjectProgressChartProps {
  projects: any[];
}

export const ProjectProgressChart = ({
  projects
}: ProjectProgressChartProps) => {
  const totalProjects = projects.length;
  const processedProjects = projects.filter(p => p.analysis_data).length;
  const recentProjects = projects.filter(p => {
    const createdAt = new Date(p.created_at);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return createdAt >= weekAgo;
  }).length;

  const progressPercentage = totalProjects > 0 ? (processedProjects / totalProjects) * 100 : 0;

  const metrics = [
    {
      label: 'Projetos Processados',
      value: processedProjects,
      total: totalProjects,
      percentage: progressPercentage,
      icon: CheckCircle,
      color: 'bg-green-500'
    },
    {
      label: 'Novos Esta Semana',
      value: recentProjects,
      total: totalProjects,
      percentage: totalProjects > 0 ? (recentProjects / totalProjects) * 100 : 0,
      icon: Clock,
      color: 'bg-blue-500'
    },
    {
      label: 'Pendentes',
      value: totalProjects - processedProjects,
      total: totalProjects,
      percentage: totalProjects > 0 ? ((totalProjects - processedProjects) / totalProjects) * 100 : 0,
      icon: AlertCircle,
      color: 'bg-orange-500'
    }
  ];

  return (
    <Card className="border-0 shadow-lg w-full">
      <CardHeader className="pb-3 sm:pb-4">
        <CardTitle className="flex items-center space-x-2 text-gray-900 text-lg sm:text-xl">
          <BarChart3 className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
          <span>Progresso dos Projetos</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 sm:space-y-6">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <div key={index} className="space-y-2 sm:space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
                  <div className={`p-1.5 sm:p-2 rounded-lg ${metric.color}`}>
                    <Icon className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                  </div>
                  <span className="text-sm sm:text-base font-medium text-gray-700 truncate">
                    {metric.label}
                  </span>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-lg sm:text-xl font-bold text-gray-900">
                    {metric.value}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-500">
                    de {metric.total}
                  </div>
                </div>
              </div>
              <div className="w-full">
                <Progress 
                  value={metric.percentage} 
                  className="h-2 sm:h-3 w-full"
                />
                <div className="text-xs sm:text-sm text-gray-500 mt-1 text-right">
                  {Math.round(metric.percentage)}%
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};
