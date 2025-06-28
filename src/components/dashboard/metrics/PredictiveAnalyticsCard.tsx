
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { InfoTooltip } from '@/components/ui/info-tooltip';
import { Brain, AlertCircle, Calendar, Shield } from 'lucide-react';

interface PredictiveAnalyticsCardProps {
  predictive: {
    riskLevel: 'Baixo' | 'Médio' | 'Alto';
    riskFactors: string[];
    upcomingDeadlines: number;
    budgetAlerts: number;
    qualityScore: number;
  };
}

export const PredictiveAnalyticsCard = ({ predictive }: PredictiveAnalyticsCardProps) => {
  const getRiskColor = (level: string) => {
    switch (level) {
      case 'Alto': return 'text-red-600 bg-red-50 border-red-200';
      case 'Médio': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-green-600 bg-green-50 border-green-200';
    }
  };

  const getQualityColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getAlertColor = (count: number) => {
    if (count === 0) return 'text-green-600';
    if (count <= 2) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Card className="border border-gray-200 shadow-sm bg-white hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
          <Brain className="h-5 w-5 text-purple-600" />
          <span>Análise Preditiva</span>
          <InfoTooltip content="Insights inteligentes e alertas baseados em padrões identificados nos seus projetos pela IA" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Nível de Risco Geral */}
        <div className={`p-4 rounded-lg border mb-4 ${getRiskColor(predictive.riskLevel)}`}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <div className="flex items-center space-x-1">
                <span className="font-medium">Nível de Risco Geral</span>
                <InfoTooltip content="Avaliação geral do risco baseada em fatores como complexidade dos projetos, variação de custos e prazo de execução." />
              </div>
            </div>
            <span className="text-xl font-bold">{predictive.riskLevel}</span>
          </div>
          
          {predictive.riskFactors.length > 0 && (
            <div className="space-y-1">
              <div className="text-sm font-medium mb-1">Fatores identificados:</div>
              {predictive.riskFactors.slice(0, 2).map((factor, index) => (
                <div key={index} className="text-xs flex items-start space-x-2">
                  <div className="w-1 h-1 bg-current rounded-full mt-2 flex-shrink-0"></div>
                  <span className="leading-tight">{factor}</span>
                </div>
              ))}
              {predictive.riskFactors.length > 2 && (
                <div className="text-xs opacity-75">
                  +{predictive.riskFactors.length - 2} outros fatores
                </div>
              )}
            </div>
          )}
        </div>

        <div className="grid grid-cols-3 gap-3">
          {/* Prazos Próximos */}
          <div className="text-center p-3 bg-gray-50 rounded-lg border border-gray-100">
            <div className="flex items-center justify-center space-x-1 mb-2">
              <div className={`text-xl font-bold ${getAlertColor(predictive.upcomingDeadlines)}`}>
                {predictive.upcomingDeadlines}
              </div>
              <InfoTooltip content="Número de projetos com prazos críticos nos próximos 30 dias que precisam de atenção especial." />
            </div>
            <div className="text-xs text-gray-600 flex items-center justify-center space-x-1">
              <Calendar className="h-3 w-3" />
              <span>Prazos 30d</span>
            </div>
          </div>

          {/* Alertas Orçamentários */}
          <div className="text-center p-3 bg-gray-50 rounded-lg border border-gray-100">
            <div className="flex items-center justify-center space-x-1 mb-2">
              <div className={`text-xl font-bold ${getAlertColor(predictive.budgetAlerts)}`}>
                {predictive.budgetAlerts}
              </div>
              <InfoTooltip content="Projetos com custos acima do padrão que podem indicar necessidade de revisão orçamentária." />
            </div>
            <div className="text-xs text-gray-600 flex items-center justify-center space-x-1">
              <AlertCircle className="h-3 w-3" />
              <span>Custos Alto</span>
            </div>
          </div>

          {/* Score de Qualidade */}
          <div className="text-center p-3 bg-gray-50 rounded-lg border border-gray-100">
            <div className="flex items-center justify-center space-x-1 mb-2">
              <div className={`text-xl font-bold ${getQualityColor(predictive.qualityScore)}`}>
                {predictive.qualityScore}%
              </div>
              <InfoTooltip content="Pontuação geral da qualidade dos dados e análises dos seus projetos. Acima de 80% indica excelente qualidade." />
            </div>
            <div className="text-xs text-gray-600">
              Qualidade
            </div>
          </div>
        </div>

        {/* Resumo Inteligente */}
        <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-100">
          <div className="flex items-start space-x-2">
            <div className="text-sm text-gray-700">
              <span className="font-medium">Resumo IA:</span> 
              {predictive.riskLevel === 'Baixo' && predictive.qualityScore >= 80 ? (
                <span className="text-green-600 ml-1">
                  Portfólio bem estruturado, continue assim!
                </span>
              ) : predictive.riskLevel === 'Alto' || predictive.budgetAlerts > 2 ? (
                <span className="text-red-600 ml-1">
                  Atenção necessária - revise projetos em risco.
                </span>
              ) : (
                <span className="text-yellow-600 ml-1">
                  Desempenho moderado, há espaço para melhorias.
                </span>
              )}
            </div>
            <InfoTooltip content="Resumo automático gerado pela IA com base na análise completa do seu portfólio de projetos." />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
