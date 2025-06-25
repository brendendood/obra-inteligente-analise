
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  FolderOpen, 
  TrendingUp, 
  Clock,
  BarChart3
} from 'lucide-react';

interface StatsCardsProps {
  stats: {
    totalProjects: number;
    totalArea: number;
    recentProjects: number;
    timeSaved: number;
  };
}

export const StatsCards = ({ stats }: StatsCardsProps) => {
  const statsConfig = [
    {
      title: "Total de Projetos",
      value: stats.totalProjects,
      description: "Projetos cadastrados",
      icon: FolderOpen,
      gradient: "from-blue-50 to-blue-100",
      textColor: "text-blue-800",
      iconColor: "text-blue-600",
      valueColor: "text-blue-900"
    },
    {
      title: "Área Total",
      value: `${stats.totalArea.toLocaleString()}m²`,
      description: "Área construída total",
      icon: BarChart3,
      gradient: "from-green-50 to-green-100",
      textColor: "text-green-800",
      iconColor: "text-green-600",
      valueColor: "text-green-900"
    },
    {
      title: "Últimos 7 dias",
      value: stats.recentProjects,
      description: "Novos projetos",
      icon: TrendingUp,
      gradient: "from-purple-50 to-purple-100",
      textColor: "text-purple-800",
      iconColor: "text-purple-600",
      valueColor: "text-purple-900"
    },
    {
      title: "Tempo Economizado",
      value: `${stats.timeSaved}h`,
      description: "Em análises manuais",
      icon: Clock,
      gradient: "from-orange-50 to-orange-100",
      textColor: "text-orange-800",
      iconColor: "text-orange-600",
      valueColor: "text-orange-900"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsConfig.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className={`border-0 shadow-lg bg-gradient-to-br ${stat.gradient}`}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className={`text-sm font-medium ${stat.textColor}`}>
                  {stat.title}
                </CardTitle>
                <Icon className={`h-5 w-5 ${stat.iconColor}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold ${stat.valueColor} mb-1`}>
                {stat.value}
              </div>
              <p className={`text-xs ${stat.textColor.replace('800', '700')}`}>
                {stat.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
