import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { InfoTooltip } from '@/components/ui/info-tooltip';
import { Zap } from 'lucide-react';
interface PerformanceMetricsCardProps {
  performance: {
    avgProcessingTime: number | null;
    processingEfficiency: number;
    avgProjectDuration: number | null;
  };
}
export const PerformanceMetricsCard = ({
  performance
}: PerformanceMetricsCardProps) => {
  const getEfficiencyColor = (value: number) => {
    if (value >= 80) return 'text-green-600';
    if (value >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };
  const tooltipContent = <div className="space-y-3">
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
      </div>
    </div>;
  return <Card className="border border-gray-200 shadow-sm bg-white hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
          <Zap className="h-5 w-5 text-blue-600" />
          <span>Performance</span>
          <InfoTooltip content={tooltipContent} />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4">
          {/* Tempo Médio de Processamento */}
          <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {performance.avgProcessingTime ? `${performance.avgProcessingTime}h` : 'N/D'}
            </div>
            <div className="text-sm text-gray-600">Tempo Médio de Processamento</div>
          </div>

          {/* Eficiência de Processamento */}
          <div className="text-center p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border border-green-200">
            <div className={`text-3xl font-bold ${getEfficiencyColor(performance.processingEfficiency)} mb-2`}>
              {performance.processingEfficiency}%
            </div>
            <div className="text-sm text-gray-600">Eficiência de Análise</div>
          </div>

          {/* Duração Média de Obra */}
          <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg border border-purple-200">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {performance.avgProjectDuration ? `${performance.avgProjectDuration}d` : 'N/D'}
            </div>
            <div className="text-sm text-gray-600">Duração Média das Obras</div>
          </div>
        </div>
      </CardContent>
    </Card>;
};