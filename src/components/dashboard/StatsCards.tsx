
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  FolderOpen, 
  Calculator, 
  CheckCircle,
  DollarSign,
  Clock,
  TrendingUp
} from 'lucide-react';

interface StatsCardsProps {
  stats: {
    totalProjects: number;
    totalArea: number;
    processedProjects: number;
    projectsByType: Record<string, number>;
    recentProjects: number;
    averageArea: number;
    // NOVOS CAMPOS
    totalInvestment: number;
    projectsWithBudget: number;
    projectsWithSchedule: number;
    avgCostPerSqm: number | null;
    avgProjectDuration: number | null;
  };
}

export const StatsCards = ({ stats }: StatsCardsProps) => {
  const processingRate = stats.totalProjects > 0 
    ? Math.round((stats.processedProjects / stats.totalProjects) * 100) 
    : 0;

  const budgetingRate = stats.totalProjects > 0 
    ? Math.round((stats.projectsWithBudget / stats.totalProjects) * 100) 
    : 0;

  const schedulingRate = stats.totalProjects > 0 
    ? Math.round((stats.projectsWithSchedule / stats.totalProjects) * 100) 
    : 0;

  const statsConfig = [
    {
      title: "Total de Projetos",
      value: stats.totalProjects,
      description: "Projetos cadastrados",
      icon: FolderOpen,
      iconColor: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Investimento Total",
      value: stats.totalInvestment > 0 
        ? `R$ ${(stats.totalInvestment / 1000).toFixed(0)}k` 
        : "R$ 0",
      description: `${stats.projectsWithBudget} projetos orçados (${budgetingRate}%)`,
      icon: DollarSign,
      iconColor: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Custo Médio/m²",
      value: stats.avgCostPerSqm 
        ? `R$ ${stats.avgCostPerSqm.toLocaleString()}` 
        : "Sem dados",
      description: stats.avgCostPerSqm 
        ? "Baseado em orçamentos reais" 
        : "Nenhum orçamento salvo",
      icon: Calculator,
      iconColor: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      title: "Prazo Médio",
      value: stats.avgProjectDuration 
        ? `${stats.avgProjectDuration} dias` 
        : "Sem dados",
      description: `${stats.projectsWithSchedule} cronogramas (${schedulingRate}%)`,
      icon: Clock,
      iconColor: "text-orange-600",
      bgColor: "bg-orange-50"
    },
    {
      title: "Projetos Processados",
      value: stats.processedProjects,
      description: `${processingRate}% dos projetos`,
      icon: CheckCircle,
      iconColor: "text-emerald-600",
      bgColor: "bg-emerald-50"
    },
    {
      title: "Área Total",
      value: `${stats.totalArea.toLocaleString()}m²`,
      description: `Média: ${stats.averageArea}m² por projeto`,
      icon: TrendingUp,
      iconColor: "text-indigo-600",
      bgColor: "bg-indigo-50"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {statsConfig.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="border border-gray-200 bg-white hover:shadow-md transition-shadow duration-200 rounded-md">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-md ${stat.bgColor}`}>
                  <Icon className={`h-5 w-5 ${stat.iconColor}`} />
                </div>
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
