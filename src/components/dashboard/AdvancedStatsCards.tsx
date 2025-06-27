
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Calculator, 
  Clock, 
  AlertTriangle,
  TrendingUp
} from 'lucide-react';

interface AdvancedStatsCardsProps {
  avgCostPerSqm: number | null;
  avgProjectDuration: number | null;
  riskLevel: 'Baixo' | 'Médio' | 'Alto';
}

export const AdvancedStatsCards = ({ 
  avgCostPerSqm, 
  avgProjectDuration, 
  riskLevel 
}: AdvancedStatsCardsProps) => {
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
      case 'Alto': return 'bg-red-50';
      case 'Médio': return 'bg-yellow-50';
      case 'Baixo': return 'bg-green-50';
      default: return 'bg-gray-50';
    }
  };

  const advancedStats = [
    {
      title: "Custo Médio por m²",
      value: avgCostPerSqm ? `R$ ${avgCostPerSqm.toLocaleString('pt-BR')}` : "N/D",
      description: avgCostPerSqm ? "Baseado em projetos com orçamento" : "Nenhum projeto orçado",
      icon: Calculator,
      iconColor: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Duração Média da Obra",
      value: avgProjectDuration ? `${avgProjectDuration} dias` : "N/D",
      description: avgProjectDuration ? "Tempo médio dos cronogramas" : "Nenhum cronograma disponível",
      icon: Clock,
      iconColor: "text-indigo-600",
      bgColor: "bg-indigo-50"
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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {advancedStats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="border border-gray-200 bg-white hover:shadow-md transition-shadow duration-200">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-5 w-5 ${stat.iconColor}`} />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
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
