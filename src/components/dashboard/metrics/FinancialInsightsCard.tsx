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
    <Card className="group relative overflow-hidden bg-gradient-to-br from-white via-green-50/30 to-emerald-50/50 border-0 shadow-lg hover:shadow-xl transition-all duration-300 h-48 sm:h-52">
      <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <CardHeader className="relative pb-3 sm:pb-4">
        <CardTitle className="text-sm sm:text-base md:text-lg font-bold text-gray-900 flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
            <div className="p-1.5 sm:p-2 bg-green-100 rounded-lg flex-shrink-0">
              <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-green-600" />
            </div>
            <span className="truncate">Financeiro</span>
          </div>
          <InfoTooltip content={tooltipContent} />
        </CardTitle>
      </CardHeader>
      
      <CardContent className="relative space-y-3 sm:space-y-4 pt-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {/* Investimento Total */}
          <div className="text-center">
            <div className="relative p-3 sm:p-4 md:p-5 bg-white/80 backdrop-blur-sm rounded-xl border border-green-200/60 shadow-sm hover:shadow-md transition-all duration-200">
              <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-black text-green-600 mb-1 sm:mb-2 tracking-tight leading-tight">
                {formatCurrency(financial.totalInvestment)}
              </div>
              <div className="text-xs sm:text-sm font-medium text-gray-600 leading-tight">Investimento Total</div>
            </div>
          </div>

          {/* Custo Médio por m² */}
          <div className="text-center">
            <div className="relative p-3 sm:p-4 md:p-5 bg-white/80 backdrop-blur-sm rounded-xl border border-blue-200/60 shadow-sm hover:shadow-md transition-all duration-200">
              <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-black text-blue-600 mb-1 sm:mb-2 tracking-tight leading-tight">
                {financial.avgCostPerSqm ? formatCurrency(financial.avgCostPerSqm) : 'N/D'}
              </div>
              <div className="text-xs sm:text-sm font-medium text-gray-600 leading-tight">Custo Médio/m²</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
