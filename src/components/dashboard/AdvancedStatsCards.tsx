
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Calculator, 
  Clock, 
  AlertTriangle
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
      case 'Alto': return 'bg-red-100';
      case 'Médio': return 'bg-yellow-100';
      case 'Baixo': return 'bg-green-100';
      default: return 'bg-gray-100';
    }
  };

  const advancedStats = [
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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {advancedStats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="border border-gray-200 bg-white hover:shadow-md transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <Icon className={`h-4 w-4 ${stat.iconColor}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {stat.value}
              </div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
