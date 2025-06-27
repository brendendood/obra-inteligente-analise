
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  FolderOpen, 
  FileText, 
  CheckCircle,
  BarChart3,
  Calculator, 
  Clock, 
  AlertTriangle
} from 'lucide-react';

interface DashboardStatsGridProps {
  stats: {
    totalProjects: number;
    totalArea: number;
    processedProjects: number;
    projectsByType: Record<string, number>;
    recentProjects: number;
    averageArea: number;
  };
  avgCostPerSqm: number | null;
  avgProjectDuration: number | null;
  riskLevel: 'Baixo' | 'Médio' | 'Alto';
}

export const DashboardStatsGrid = ({ 
  stats, 
  avgCostPerSqm, 
  avgProjectDuration, 
  riskLevel 
}: DashboardStatsGridProps) => {
  const getRiskColor = (level: string) => {
    switch (level) {
      case 'Alto': return 'text-red-600';
      case 'Médio': return 'text-yellow-600';
      case 'Baixo': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getRiskBgColor = (level: string) => {
    switch (level) {
      case 'Alto': return 'bg-red-100';
      case 'Médio': return 'bg-yellow-100';
      case 'Baixo': return 'bg-green-100';
      default: return 'bg-gray-100';
    }
  };

  const mostCommonType = Object.entries(stats.projectsByType || {})
    .sort(([,a], [,b]) => b - a)[0]?.[0] || 'Residencial';

  const processingRate = stats.totalProjects > 0 
    ? Math.round((stats.processedProjects / stats.totalProjects) * 100) 
    : 0;

  // Configuração unificada de todos os 7 cards
  const allStatsConfig = [
    {
      title: "Total de Projetos",
      value: stats.totalProjects,
      description: "Projetos cadastrados",
      icon: FolderOpen,
      iconColor: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      title: "Projetos Processados",
      value: stats.processedProjects,
      description: `${processingRate}% dos projetos`,
      icon: CheckCircle,
      iconColor: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      title: "Área Total",
      value: `${stats.totalArea.toLocaleString()}m²`,
      description: "Área construída total",
      icon: BarChart3,
      iconColor: "text-purple-600",
      bgColor: "bg-purple-100"
    },
    {
      title: "Tipo Mais Comum",
      value: mostCommonType,
      description: `${stats.projectsByType[mostCommonType] || 0} projetos`,
      icon: FileText,
      iconColor: "text-orange-600",
      bgColor: "bg-orange-100"
    },
    {
      title: "Custo Médio por m²",
      value: avgCostPerSqm ? `R$ ${avgCostPerSqm.toLocaleString('pt-BR')}` : "N/D",
      description: avgCostPerSqm ? "Baseado em projetos com orçamento" : "Nenhum projeto orçado",
      icon: Calculator,
      iconColor: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      title: "Duração Média da Obra",
      value: avgProjectDuration ? `${avgProjectDuration} dias` : "N/D",
      description: avgProjectDuration ? "Tempo médio dos cronogramas" : "Nenhum cronograma disponível",
      icon: Clock,
      iconColor: "text-indigo-600",
      bgColor: "bg-indigo-100"
    },
    {
      title: "Análise de Risco",
      value: riskLevel,
      description: "Nível de risco agregado",
      icon: AlertTriangle,
      iconColor: getRiskColor(riskLevel),
      bgColor: getRiskBgColor(riskLevel)
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {allStatsConfig.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="border border-gray-200 bg-white hover:shadow-md transition-shadow duration-200 min-h-[140px]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 leading-none">
                {stat.title}
              </CardTitle>
              <div className={`w-10 h-10 flex items-center justify-center rounded-lg ${stat.bgColor} flex-shrink-0`}>
                <Icon className={`h-5 w-5 ${stat.iconColor}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 mb-2 leading-none h-8 flex items-center">
                {stat.value}
              </div>
              <p className="text-xs text-muted-foreground leading-tight">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
