
import { Card, CardContent } from '@/components/ui/card';
import { InfoTooltip } from '@/components/ui/info-tooltip';
import { 
  Users, 
  BarChart3, 
  Clock, 
  DollarSign,
  TrendingUp,
  Calendar,
  AlertTriangle
} from 'lucide-react';

interface DashboardStatsGridProps {
  stats: any;
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
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'Alto': return 'text-red-600 bg-red-50';
      case 'Médio': return 'text-yellow-600 bg-yellow-50';
      default: return 'text-green-600 bg-green-50';
    }
  };

  const statsData = [
    {
      title: 'Total de Projetos',
      value: stats.totalProjects,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      tooltip: 'Número total de projetos criados na plataforma'
    },
    {
      title: 'Projetos Analisados',
      value: stats.processedProjects,
      icon: BarChart3,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      tooltip: 'Projetos que foram processados pela IA e têm dados de análise disponíveis'
    },
    {
      title: 'Área Total',
      value: `${stats.totalArea.toLocaleString('pt-BR')} m²`,
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      tooltip: 'Somatória da área de todos os projetos cadastrados'
    },
    {
      title: 'Projetos Recentes',
      value: stats.recentProjects,
      icon: Calendar,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      tooltip: 'Projetos criados nos últimos 7 dias'
    },
    {
      title: 'Custo Médio por m²',
      value: avgCostPerSqm ? formatCurrency(avgCostPerSqm) : 'N/D',
      icon: DollarSign,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      tooltip: avgCostPerSqm 
        ? 'Custo médio por metro quadrado baseado nos projetos com orçamento gerado pela IA'
        : 'Não disponível - nenhum projeto possui orçamento completo para cálculo'
    },
    {
      title: 'Duração Média da Obra',
      value: avgProjectDuration ? `${avgProjectDuration} dias` : 'N/D',
      icon: Clock,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      tooltip: avgProjectDuration
        ? 'Duração média das obras baseada nos cronogramas gerados pela IA'
        : 'Não disponível - nenhum projeto possui cronograma completo para cálculo'
    },
    {
      title: 'Análise de Risco',
      value: riskLevel,
      icon: AlertTriangle,
      color: getRiskColor(riskLevel).split(' ')[0],
      bgColor: getRiskColor(riskLevel).split(' ')[1],
      tooltip: 'Nível de risco baseado em projetos não analisados, orçamentos altos e cronogramas apertados'
    }
  ];

  return (
    <div className="w-full min-w-0">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 px-2 sm:px-0">
        Estatísticas do Dashboard
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 w-full px-2 sm:px-0">
        {statsData.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-shadow w-full min-w-0">
              <CardContent className="p-4 sm:p-6 w-full">
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2 sm:p-3 rounded-xl ${stat.bgColor} flex-shrink-0`}>
                    <Icon className={`h-5 w-5 sm:h-6 sm:w-6 ${stat.color}`} />
                  </div>
                  <InfoTooltip content={stat.tooltip} />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-medium text-gray-600 mb-1 truncate">
                    {stat.title}
                  </h3>
                  <p className={`text-xl sm:text-2xl font-bold ${stat.color} truncate`}>
                    {stat.value}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
