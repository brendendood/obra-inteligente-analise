
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  FolderOpen, 
  FileText, 
  CheckCircle,
  BarChart3
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
      iconColor: "text-blue-600"
    },
    {
      title: "Projetos Processados",
      value: stats.processedProjects,
      description: `${processingRate}% dos projetos`,
      icon: CheckCircle,
      iconColor: "text-green-600"
    },
    {
      title: "Área Total",
      value: `${stats.totalArea.toLocaleString()}m²`,
      description: "Área construída total",
      icon: BarChart3,
      iconColor: "text-purple-600"
    },
    {
      title: "Tipo Mais Comum",
      value: mostCommonType,
      description: `${stats.projectsByType[mostCommonType] || 0} projetos`,
      icon: FileText,
      iconColor: "text-orange-600"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsConfig.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="border border-gray-200 bg-white hover:shadow-md transition-shadow duration-200">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-5 w-5 ${stat.iconColor}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {stat.value}
              </div>
              <p className="text-sm text-gray-500">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
