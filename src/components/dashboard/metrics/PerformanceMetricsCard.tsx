
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { InfoTooltip } from '@/components/ui/info-tooltip';
import { Clock, Zap, CheckCircle, AlertTriangle } from 'lucide-react';

interface PerformanceMetricsCardProps {
  performance: {
    avgProcessingTime: number | null;
    processingEfficiency: number;
    avgProjectDuration: number | null;
    onTimeDeliveryRate: number;
    bottleneckPhase: string | null;
  };
}

export const PerformanceMetricsCard = ({ performance }: PerformanceMetricsCardProps) => {
  const getEfficiencyColor = (value: number) => {
    if (value >= 80) return 'text-green-600';
    if (value >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getBottleneckColor = (bottleneck: string | null) => {
    if (!bottleneck) return 'text-green-600';
    return bottleneck === 'Análise Inicial' ? 'text-red-600' : 'text-yellow-600';
  };

  return (
    <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
          <Zap className="h-5 w-5 text-blue-600" />
          <span>Performance & Eficiência</span>
          <InfoTooltip content="Métricas de desempenho temporal e eficiência operacional" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {/* Tempo Médio de Processamento */}
          <div className="text-center p-3 bg-white rounded-lg border border-blue-100">
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {performance.avgProcessingTime ? `${performance.avgProcessingTime}h` : 'N/D'}
            </div>
            <div className="text-sm text-gray-600">Tempo Médio</div>
            <div className="text-xs text-gray-500">de processamento</div>
          </div>

          {/* Eficiência de Processamento */}
          <div className="text-center p-3 bg-white rounded-lg border border-blue-100">
            <div className={`text-2xl font-bold mb-1 ${getEfficiencyColor(performance.processingEfficiency)}`}>
              {performance.processingEfficiency}%
            </div>
            <div className="text-sm text-gray-600">Eficiência</div>
            <div className="text-xs text-gray-500">de análise</div>
          </div>

          {/* Duração Média de Obra */}
          <div className="text-center p-3 bg-white rounded-lg border border-blue-100">
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {performance.avgProjectDuration ? `${performance.avgProjectDuration}d` : 'N/D'}
            </div>
            <div className="text-sm text-gray-600">Duração Média</div>
            <div className="text-xs text-gray-500">das obras</div>
          </div>

          {/* Taxa de Entrega no Prazo */}
          <div className="text-center p-3 bg-white rounded-lg border border-blue-100">
            <div className={`text-2xl font-bold mb-1 ${getEfficiencyColor(performance.onTimeDeliveryRate)}`}>
              {performance.onTimeDeliveryRate}%
            </div>
            <div className="text-sm text-gray-600">No Prazo</div>
            <div className="text-xs text-gray-500">entregues</div>
          </div>
        </div>

        {/* Indicador de Gargalo */}
        <div className="mt-4 p-3 bg-white rounded-lg border border-blue-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {performance.bottleneckPhase ? (
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
              ) : (
                <CheckCircle className="h-4 w-4 text-green-500" />
              )}
              <span className="text-sm font-medium text-gray-700">
                Status do Fluxo
              </span>
            </div>
            <div className="text-right">
              <div className={`text-sm font-medium ${getBottleneckColor(performance.bottleneckPhase)}`}>
                {performance.bottleneckPhase || 'Fluindo bem'}
              </div>
              <div className="text-xs text-gray-500">
                {performance.bottleneckPhase ? 'Gargalo identificado' : 'Sem gargalos'}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
