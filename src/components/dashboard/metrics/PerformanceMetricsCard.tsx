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

  const tooltipContent = (
    <div className="space-y-3">
      <div>
        <strong className="text-gray-800 block mb-1">PERFORMANCE & EFICIÊNCIA</strong>
        <span className="text-sm">Como Interpretar:</span>
      </div>
      
      <div className="space-y-2 text-sm">
        <div>
          <strong className="text-gray-800">• TEMPO MÉDIO:</strong>
          <span className="ml-1">Quanto tempo a IA leva para processar um projeto completo. Valores menores = melhor performance.</span>
        </div>
        
        <div>
          <strong className="text-gray-800">• EFICIÊNCIA DE ANÁLISE:</strong>
          <span className="ml-1">Taxa de sucesso na primeira tentativa. +80% = Excelente | 60-80% = Boa | -60% = Melhorar qualidade dos dados.</span>
        </div>
        
        <div>
          <strong className="text-gray-800">• DURAÇÃO MÉDIA DAS OBRAS:</strong>
          <span className="ml-1">Tempo previsto nos cronogramas gerados. Útil para planejar recursos.</span>
        </div>
        
        <div>
          <strong className="text-gray-800">• NO PRAZO ENTREGUES:</strong>
          <span className="ml-1">Projetos processados dentro do tempo esperado. Indica confiabilidade do sistema.</span>
        </div>
        
        <div>
          <strong className="text-gray-800">• STATUS DO FLUXO:</strong>
          <span className="ml-1">"Fluindo bem" = sem problemas | Nome da fase = gargalo identificado.</span>
        </div>
      </div>
    </div>
  );

  return (
    <Card className="border border-gray-200 shadow-sm bg-white hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
          <Zap className="h-5 w-5 text-blue-600" />
          <span>Performance & Eficiência</span>
          <InfoTooltip content={tooltipContent} />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {/* Tempo Médio de Processamento */}
          <div className="text-center p-3 bg-gray-50 rounded-lg border border-gray-100">
            <div className="text-2xl font-bold text-blue-600 mb-2">
              {performance.avgProcessingTime ? `${performance.avgProcessingTime}h` : 'N/D'}
            </div>
            <div className="text-sm text-gray-600">Tempo Médio</div>
            <div className="text-xs text-gray-500">de processamento</div>
          </div>

          {/* Eficiência de Processamento */}
          <div className="text-center p-3 bg-gray-50 rounded-lg border border-gray-100">
            <div className={`text-2xl font-bold ${getEfficiencyColor(performance.processingEfficiency)} mb-2`}>
              {performance.processingEfficiency}%
            </div>
            <div className="text-sm text-gray-600">Eficiência</div>
            <div className="text-xs text-gray-500">de análise</div>
          </div>

          {/* Duração Média de Obra */}
          <div className="text-center p-3 bg-gray-50 rounded-lg border border-gray-100">
            <div className="text-2xl font-bold text-blue-600 mb-2">
              {performance.avgProjectDuration ? `${performance.avgProjectDuration}d` : 'N/D'}
            </div>
            <div className="text-sm text-gray-600">Duração Média</div>
            <div className="text-xs text-gray-500">das obras</div>
          </div>

          {/* Taxa de Entrega no Prazo */}
          <div className="text-center p-3 bg-gray-50 rounded-lg border border-gray-100">
            <div className={`text-2xl font-bold ${getEfficiencyColor(performance.onTimeDeliveryRate)} mb-2`}>
              {performance.onTimeDeliveryRate}%
            </div>
            <div className="text-sm text-gray-600">No Prazo</div>
            <div className="text-xs text-gray-500">entregues</div>
          </div>
        </div>

        {/* Indicador de Gargalo */}
        <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-100">
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
