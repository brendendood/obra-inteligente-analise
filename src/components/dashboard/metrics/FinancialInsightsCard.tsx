import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { InfoTooltip } from '@/components/ui/info-tooltip';
import { DollarSign } from 'lucide-react';

interface FinancialInsightsCardProps {
  financial: {
    totalInvestment: number;
    avgCostPerSqm: number | null;
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


  const tooltipContent = (
    <div className="space-y-3">
      <div>
        <strong className="text-gray-800 block mb-1">ANÁLISE FINANCEIRA</strong>
        <span className="text-sm">Como Interpretar:</span>
      </div>
      
      <div className="space-y-2 text-sm">
        <div>
          <strong className="text-gray-800">• INVESTIMENTO TOTAL:</strong>
          <span className="ml-1">Soma de todos os orçamentos dos seus projetos.</span>
        </div>
        
        <div>
          <strong className="text-gray-800">• CUSTO MÉDIO/M²:</strong>
          <span className="ml-1">Valor médio por metro quadrado dos projetos com área definida. Use para comparar eficiência entre projetos similares.</span>
        </div>
      </div>
    </div>
  );

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
        <div className="grid grid-cols-1 gap-4">
          {/* Investimento Total */}
          <div className="text-center p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border border-green-200">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {formatCurrency(financial.totalInvestment)}
            </div>
            <div className="text-sm text-gray-600">Investimento Total</div>
          </div>

          {/* Custo Médio por m² */}
          <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {financial.avgCostPerSqm ? formatCurrency(financial.avgCostPerSqm) : 'N/D'}
            </div>
            <div className="text-sm text-gray-600">Custo Médio/m²</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
