
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { InfoTooltip } from '@/components/ui/info-tooltip';
import { DollarSign, TrendingUp, TrendingDown, Target } from 'lucide-react';

interface FinancialInsightsCardProps {
  financial: {
    totalInvestment: number;
    avgCostPerSqm: number | null;
    costVariation: number | null;
    budgetEfficiency: number | null;
    highestCostProject: { name: string; cost: number } | null;
    lowestCostProject: { name: string; cost: number } | null;
  };
}

export const FinancialInsightsCard = ({ financial }: FinancialInsightsCardProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const getCostVariationColor = (variation: number | null) => {
    if (!variation) return 'text-gray-500';
    if (variation <= 20) return 'text-green-600';
    if (variation <= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getEfficiencyColor = (efficiency: number | null) => {
    if (!efficiency) return 'text-gray-500';
    if (efficiency >= 80) return 'text-green-600';
    if (efficiency >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const tooltipContent = `
    **ANÁLISE FINANCEIRA** - Como Interpretar:

    • **INVESTIMENTO TOTAL:** Soma de todos os orçamentos dos seus projetos.

    • **CUSTO MÉDIO/M²:** Valor médio por metro quadrado dos projetos com área definida. Use para comparar eficiência entre projetos similares.

    • **VARIAÇÃO DE CUSTOS:** Diversidade dos custos dos projetos. Até 20% = Consistente | 20-40% = Moderada | +40% = Alta diversidade.

    • **EFICIÊNCIA ORÇAMENTÁRIA:** Qualidade dos orçamentos gerados. +80% = Excelente | 60-80% = Boa | -60% = Melhorar dados de entrada.

    • **PROJETOS DESTAQUE:** Comparação entre maior e menor investimento do portfólio.
  `;

  return (
    <Card className="border border-gray-200 shadow-sm bg-white hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
          <DollarSign className="h-5 w-5 text-green-600" />
          <span>Análise Financeira</span>
          <InfoTooltip content={tooltipContent} />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {/* Investimento Total */}
          <div className="text-center p-3 bg-gray-50 rounded-lg border border-gray-100">
            <div className="text-2xl font-bold text-green-600 mb-2">
              {formatCurrency(financial.totalInvestment)}
            </div>
            <div className="text-sm text-gray-600">Investimento Total</div>
          </div>

          {/* Custo Médio por m² */}
          <div className="text-center p-3 bg-gray-50 rounded-lg border border-gray-100">
            <div className="text-2xl font-bold text-green-600 mb-2">
              {financial.avgCostPerSqm ? formatCurrency(financial.avgCostPerSqm) : 'N/D'}
            </div>
            <div className="text-sm text-gray-600">Custo Médio/m²</div>
          </div>

          {/* Variação de Custos */}
          <div className="text-center p-3 bg-gray-50 rounded-lg border border-gray-100">
            <div className={`text-2xl font-bold ${getCostVariationColor(financial.costVariation)} mb-2`}>
              {financial.costVariation ? `${financial.costVariation}%` : 'N/D'}
            </div>
            <div className="text-sm text-gray-600 flex items-center justify-center space-x-1">
              {financial.costVariation && financial.costVariation > 30 ? (
                <TrendingUp className="h-3 w-3 text-red-500" />
              ) : (
                <TrendingDown className="h-3 w-3 text-green-500" />
              )}
              <span>Variação</span>
            </div>
          </div>

          {/* Eficiência Orçamentária */}
          <div className="text-center p-3 bg-gray-50 rounded-lg border border-gray-100">
            <div className={`text-2xl font-bold ${getEfficiencyColor(financial.budgetEfficiency)} mb-2`}>
              {financial.budgetEfficiency ? `${financial.budgetEfficiency}%` : 'N/D'}
            </div>
            <div className="text-sm text-gray-600 flex items-center justify-center space-x-1">
              <Target className="h-3 w-3 text-blue-500" />
              <span>Eficiência</span>
            </div>
          </div>
        </div>

        {/* Projetos Destaque */}
        {(financial.highestCostProject || financial.lowestCostProject) && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-100">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Projetos Destaque</h4>
            <div className="space-y-2 text-xs">
              {financial.highestCostProject && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 truncate mr-2">Maior investimento:</span>
                  <div className="text-right">
                    <div className="font-medium text-red-600">
                      {formatCurrency(financial.highestCostProject.cost)}
                    </div>
                    <div className="text-gray-500 truncate max-w-[120px]">
                      {financial.highestCostProject.name}
                    </div>
                  </div>
                </div>
              )}
              {financial.lowestCostProject && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 truncate mr-2">Menor investimento:</span>
                  <div className="text-right">
                    <div className="font-medium text-green-600">
                      {formatCurrency(financial.lowestCostProject.cost)}
                    </div>
                    <div className="text-gray-500 truncate max-w-[120px]">
                      {financial.lowestCostProject.name}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
