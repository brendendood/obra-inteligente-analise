
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  FolderOpen, 
  FileText, 
  CheckCircle,
  BarChart3,
  Calendar,
  Zap
} from 'lucide-react';

interface StatsCardsProps {
  stats: {
    totalProjects: number;
    totalArea: number;
    processedProjects: number;
    projectsByType: Record<string, number>;
    recentProjects: number;
    averageArea: number;
  };
}

export const StatsCards = ({ stats }: StatsCardsProps) => {
  const mostCommonType = Object.entries(stats.projectsByType || {})
    .sort(([,a], [,b]) => b - a)[0]?.[0] || 'Residencial';

  const processingRate = stats.totalProjects > 0 
    ? Math.round((stats.processedProjects / stats.totalProjects) * 100) 
    : 0;

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
      title: "Projetos Processados",
      value: stats.processedProjects,
      description: `${processingRate}% dos projetos`,
      icon: CheckCircle,
      gradient: "from-green-50 to-green-100",
      textColor: "text-green-800",
      iconColor: "text-green-600",
      valueColor: "text-green-900"
    },
    {
      title: "Área Total Analisada",
      value: `${stats.totalArea.toLocaleString()}m²`,
      description: "Área construída total",
      icon: BarChart3,
      gradient: "from-purple-50 to-purple-100",
      textColor: "text-purple-800",
      iconColor: "text-purple-600",
      valueColor: "text-purple-900"
    },
    {
      title: "Tipo Mais Comum",
      value: mostCommonType,
      description: `${stats.projectsByType[mostCommonType] || 0} projetos`,
      icon: FileText,
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
          <Card key={index} className={`border-0 shadow-lg bg-gradient-to-br ${stat.gradient} hover:shadow-xl transition-all duration-300`}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className={`text-sm font-medium ${stat.textColor}`}>
                  {stat.title}
                </CardTitle>
                <Icon className={`h-5 w-5 ${stat.iconColor}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl lg:text-3xl font-bold ${stat.valueColor} mb-1`}>
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
