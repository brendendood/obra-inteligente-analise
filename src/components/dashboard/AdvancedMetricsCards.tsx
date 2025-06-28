
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, Clock, Shield, TrendingUp } from 'lucide-react';
import { useAdvancedDashboardMetrics } from '@/hooks/useAdvancedDashboardMetrics';
import { Project } from '@/types/project';
import { MetricsInfoTooltip } from './MetricsInfoTooltip';
import { NotAvailableInfo } from './NotAvailableInfo';

interface AdvancedMetricsCardsProps {
  projects: Project[];
}

export const AdvancedMetricsCards = ({ projects }: AdvancedMetricsCardsProps) => {
  const metrics = useAdvancedDashboardMetrics(projects);

  const formatCurrency = (value: number | null) => {
    if (value === null) return null;
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Alto': return 'text-red-600 bg-red-50 border-red-200';
      case 'Médio': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'Baixo': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Custo Médio por m² */}
      <Card className="border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-gray-600 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-green-600" />
              <span>Custo Médio por m²</span>
            </div>
            <MetricsInfoTooltip
              title="Custo Médio por m²"
              description="Valor médio em reais por metro quadrado baseado nos projetos com orçamento gerado pela IA."
              requirement="Necessário: projetos com orçamento processado"
            />
          </CardTitle>
        </CardHeader>
        <CardContent>
          {metrics.avgCostPerSqm !== null ? (
            <div className="text-2xl font-bold text-gray-900">
              {formatCurrency(metrics.avgCostPerSqm)}/m²
            </div>
          ) : (
            <NotAvailableInfo message="Nenhum projeto com orçamento gerado ainda" />
          )}
        </CardContent>
      </Card>

      {/* Duração Média da Obra */}
      <Card className="border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-gray-600 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-blue-600" />
              <span>Duração Média</span>
            </div>
            <MetricsInfoTooltip
              title="Duração Média da Obra"
              description="Tempo médio em dias para conclusão das obras baseado nos cronogramas gerados pela IA."
              requirement="Necessário: projetos com cronograma processado"
            />
          </CardTitle>
        </CardHeader>
        <CardContent>
          {metrics.avgProjectDuration !== null ? (
            <div className="text-2xl font-bold text-gray-900">
              {metrics.avgProjectDuration} dias
            </div>
          ) : (
            <NotAvailableInfo message="Nenhum projeto com cronograma gerado ainda" />
          )}
        </CardContent>
      </Card>

      {/* Análise de Risco */}
      <Card className="border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-gray-600 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4 text-orange-600" />
              <span>Análise de Risco</span>
            </div>
            <MetricsInfoTooltip
              title="Análise de Risco"
              description="Nível de risco agregado baseado em: projetos não analisados há mais de 7 dias, orçamentos acima de R$ 500k e cronogramas menores que 90 dias."
              requirement="Calculado automaticamente com base em todos os projetos"
            />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getRiskColor(metrics.riskLevel)}`}>
            {metrics.riskLevel === 'Alto' && '🔴'}
            {metrics.riskLevel === 'Médio' && '🟡'}
            {metrics.riskLevel === 'Baixo' && '🟢'}
            <span className="ml-2">{metrics.riskLevel}</span>
          </div>
        </CardContent>
      </Card>

      {/* Produtividade Mensal */}
      <Card className="border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-gray-600 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-purple-600" />
              <span>Projetos Este Mês</span>
            </div>
            <MetricsInfoTooltip
              title="Produtividade Mensal"
              description="Número de projetos criados no mês atual comparado com os processados."
              requirement="Baseado na data de criação dos projetos"
            />
          </CardTitle>
        </CardHeader>
        <CardContent>
          {projects.length > 0 ? (
            <div className="text-2xl font-bold text-gray-900">
              {metrics.monthlyProductivity[metrics.monthlyProductivity.length - 1]?.started || 0}
            </div>
          ) : (
            <NotAvailableInfo message="Nenhum projeto criado ainda" />
          )}
        </CardContent>
      </Card>
    </div>
  );
};
