import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { InfoTooltip } from '@/components/ui/info-tooltip';
import { Award, CheckCircle, Target } from 'lucide-react';

interface QualityMetricsCardProps {
  quality: {
    completionRate: number;
    dataQualityScore: number;
    avgAccuracy: number;
  };
}

export const QualityMetricsCard = ({ quality }: QualityMetricsCardProps) => {
  const getQualityColor = (value: number) => {
    if (value >= 80) return 'text-green-600';
    if (value >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getQualityBadgeColor = (value: number) => {
    if (value >= 80) return 'bg-green-50 border-green-200';
    if (value >= 60) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };


  const tooltipContent = (
    <div className="space-y-3">
      <div>
        <strong className="text-gray-800 block mb-1">QUALIDADE DOS DADOS</strong>
        <span className="text-sm">Como Interpretar:</span>
      </div>
      
      <div className="space-y-2 text-sm">
        <div>
          <strong className="text-gray-800">• COMPLETUDE:</strong>
          <span className="ml-1">Projetos com análise completa (orçamento + cronograma + documentação).</span>
        </div>
        
        <div>
          <strong className="text-gray-800">• QUALIDADE DOS DADOS:</strong>
          <span className="ml-1">Qualidade das informações fornecidas. Dados melhores = análises mais precisas.</span>
        </div>
        
        <div>
          <strong className="text-gray-800">• PRECISÃO MÉDIA:</strong>
          <span className="ml-1">Confiabilidade das estimativas da IA. +80% = Muito confiável.</span>
        </div>
      </div>
    </div>
  );

  return (
    <Card className="border border-gray-200 shadow-sm bg-white hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
          <Award className="h-5 w-5 text-orange-600" />
          <span>Qualidade dos Dados</span>
          <InfoTooltip content={tooltipContent} />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4">
          {/* Taxa de Completude */}
          <div className="text-center p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border border-green-200">
            <div className={`text-3xl font-bold ${getQualityColor(quality.completionRate)} mb-2`}>
              {quality.completionRate}%
            </div>
            <div className="text-sm text-gray-600 flex items-center justify-center space-x-1">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Taxa de Completude</span>
            </div>
          </div>

          {/* Qualidade dos Dados */}
          <div className="text-center p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg border border-orange-200">
            <div className={`text-3xl font-bold ${getQualityColor(quality.dataQualityScore)} mb-2`}>
              {quality.dataQualityScore}%
            </div>
            <div className="text-sm text-gray-600 flex items-center justify-center space-x-1">
              <Award className="h-4 w-4 text-orange-500" />
              <span>Qualidade dos Dados</span>
            </div>
          </div>

          {/* Precisão Média */}
          <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg border border-purple-200">
            <div className={`text-3xl font-bold ${getQualityColor(quality.avgAccuracy)} mb-2`}>
              {quality.avgAccuracy}%
            </div>
            <div className="text-sm text-gray-600 flex items-center justify-center space-x-1">
              <Target className="h-4 w-4 text-purple-500" />
              <span>Precisão Média</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
