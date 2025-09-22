import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { InfoTooltip } from '@/components/ui/info-tooltip';
import { MetricTile } from '@/components/ui/metric-tile';
import { DollarSign, Calculator } from 'lucide-react';

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
    <Card className="rounded-2xl border bg-card text-card-foreground shadow-sm">
      <CardHeader>
        <CardTitle className="font-semibold tracking-tight flex items-center space-x-2">
          <DollarSign className="h-5 w-5 text-muted-foreground" />
          <span>Análise Financeira</span>
          <InfoTooltip content={tooltipContent} />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4">
          <MetricTile
            title="Investimento Total"
            value={formatCurrency(financial.totalInvestment)}
            icon={DollarSign}
            className="min-h-[100px]"
          />
          <MetricTile
            title="Custo Médio/m²"
            value={financial.avgCostPerSqm ? formatCurrency(financial.avgCostPerSqm) : 'N/D'}
            icon={Calculator}
            className="min-h-[100px]"
          />
        </div>
      </CardContent>
    </Card>
  );
};
