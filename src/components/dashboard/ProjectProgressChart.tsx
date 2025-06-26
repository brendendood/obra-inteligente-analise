
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { BarChart3, Clock, CheckCircle, AlertCircle } from 'lucide-react';

interface ProjectProgressChartProps {
  projects: any[];
}

export const ProjectProgressChart = ({ projects }: ProjectProgressChartProps) => {
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
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-gray-900">
          <BarChart3 className="h-5 w-5 text-blue-600" />
          <span>Progresso dos Projetos</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Icon className="h-4 w-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">{metric.label}</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {metric.value} de {metric.total}
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Progress value={metric.percentage} className="flex-1 h-2" />
                  <span className="text-sm font-medium text-gray-900 min-w-[50px]">
                    {Math.round(metric.percentage)}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
