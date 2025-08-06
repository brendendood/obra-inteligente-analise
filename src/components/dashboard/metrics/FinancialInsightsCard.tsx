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
    <Card className="group relative overflow-hidden bg-gradient-to-br from-white via-green-50/30 to-emerald-50/50 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
      <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <CardHeader className="relative">
        <CardTitle className="text-xl font-bold text-gray-900 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <span>Análise Financeira</span>
          </div>
          <InfoTooltip content={tooltipContent} />
        </CardTitle>
      </CardHeader>
      
      <CardContent className="relative space-y-6">
        <div className="grid grid-cols-2 gap-6">
          {/* Investimento Total */}
          <div className="text-center">
            <div className="relative p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-green-200/60 shadow-sm hover:shadow-md transition-all duration-200">
              <div className="text-3xl font-black text-green-600 mb-2 tracking-tight">
                {formatCurrency(financial.totalInvestment)}
              </div>
              <div className="text-sm font-medium text-gray-600">Investimento Total</div>
            </div>
          </div>

          {/* Custo Médio por m² */}
          <div className="text-center">
            <div className="relative p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-blue-200/60 shadow-sm hover:shadow-md transition-all duration-200">
              <div className="text-3xl font-black text-blue-600 mb-2 tracking-tight">
                {financial.avgCostPerSqm ? formatCurrency(financial.avgCostPerSqm) : 'N/D'}
              </div>
              <div className="text-sm font-medium text-gray-600">Custo Médio/m²</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
