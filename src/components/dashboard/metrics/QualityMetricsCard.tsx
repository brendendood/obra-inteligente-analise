
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { InfoTooltip } from '@/components/ui/info-tooltip';
import { Award, CheckCircle, RefreshCw, Target } from 'lucide-react';

interface QualityMetricsCardProps {
  quality: {
    completionRate: number;
    dataQualityScore: number;
    revisionRate: number;
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

  const getQualityLevel = (score: number) => {
    if (score >= 90) return 'Excelente';
    if (score >= 80) return 'Boa';
    if (score >= 60) return 'Regular';
    return 'Precisa Melhorar';
  };

  return (
    <Card className="border border-gray-200 shadow-sm bg-white hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
          <Award className="h-5 w-5 text-orange-600" />
          <span>Qualidade dos Dados</span>
          <InfoTooltip content="Métricas de qualidade e completude dos dados dos seus projetos para avaliar a confiabilidade das análises" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Score Geral */}
        <div className={`p-4 rounded-lg border mb-4 ${getQualityBadgeColor(quality.avgAccuracy)}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-orange-600" />
              <div className="flex items-center space-x-1">
                <span className="font-medium text-gray-700">Qualidade Geral</span>
                <InfoTooltip content="Avaliação geral baseada na completude, precisão e consistência dos dados em todos os seus projetos." />
              </div>
            </div>
            <div className="text-right">
              <div className={`text-2xl font-bold ${getQualityColor(quality.avgAccuracy)}`}>
                {quality.avgAccuracy}%
              </div>
              <div className="text-sm text-gray-600">
                {getQualityLevel(quality.avgAccuracy)}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Taxa de Completude */}
          <div className="text-center p-3 bg-gray-50 rounded-lg border border-gray-100">
            <div className="flex items-center justify-center space-x-1 mb-2">
              <div className={`text-2xl font-bold ${getQualityColor(quality.completionRate)}`}>
                {quality.completionRate}%
              </div>
              <InfoTooltip content="Percentual de projetos com análise completa (orçamento, cronograma e documentação). Indica a maturidade do seu portfólio." />
            </div>
            <div className="text-sm text-gray-600 flex items-center justify-center space-x-1">
              <CheckCircle className="h-3 w-3 text-green-500" />
              <span>Completude</span>
            </div>
            <div className="text-xs text-gray-500">projetos analisados</div>
          </div>

          {/* Qualidade dos Dados */}
          <div className="text-center p-3 bg-gray-50 rounded-lg border border-gray-100">
            <div className="flex items-center justify-center space-x-1 mb-2">
              <div className={`text-2xl font-bold ${getQualityColor(quality.dataQualityScore)}`}>
                {quality.dataQualityScore}%
              </div>
              <InfoTooltip content="Avalia a qualidade das informações fornecidas (plantas, documentos, especificações). Dados de alta qualidade geram análises mais precisas." />
            </div>
            <div className="text-sm text-gray-600 flex items-center justify-center space-x-1">
              <Award className="h-3 w-3 text-orange-500" />
              <span>Dados</span>
            </div>
            <div className="text-xs text-gray-500">informações completas</div>
          </div>

          {/* Taxa de Revisão */}
          <div className="text-center p-3 bg-gray-50 rounded-lg border border-gray-100">
            <div className="flex items-center justify-center space-x-1 mb-2">
              <div className={`text-2xl font-bold ${getQualityColor(quality.revisionRate)}`}>
                {quality.revisionRate}%
              </div>
              <InfoTooltip content="Percentual de projetos que foram revisados ou atualizados após a análise inicial. Indica melhoria contínua dos processos." />
            </div>
            <div className="text-sm text-gray-600 flex items-center justify-center space-x-1">
              <RefreshCw className="h-3 w-3 text-blue-500" />
              <span>Revisões</span>
            </div>
            <div className="text-xs text-gray-500">projetos atualizados</div>
          </div>

          {/* Precisão Média */}
          <div className="text-center p-3 bg-gray-50 rounded-lg border border-gray-100">
            <div className="flex items-center justify-center space-x-1 mb-2">
              <div className={`text-2xl font-bold ${getQualityColor(quality.avgAccuracy)}`}>
                {quality.avgAccuracy}%
              </div>
              <InfoTooltip content="Precisão média das estimativas da IA comparada com valores reais ou revisões posteriores. Indica confiabilidade do sistema." />
            </div>
            <div className="text-sm text-gray-600 flex items-center justify-center space-x-1">
              <Target className="h-3 w-3 text-purple-500" />
              <span>Precisão</span>
            </div>
            <div className="text-xs text-gray-500">média geral</div>
          </div>
        </div>

        {/* Recomendações */}
        <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-100">
          <div className="flex items-start space-x-2">
            <div className="text-sm text-gray-700">
              <span className="font-medium">Recomendação:</span>
              {quality.avgAccuracy >= 80 ? (
                <span className="text-green-600 ml-1">
                  Excelente qualidade! Mantenha o padrão.
                </span>
              ) : quality.completionRate < 50 ? (
                <span className="text-red-600 ml-1">
                  Foque em completar mais análises de projetos.
                </span>
              ) : quality.dataQualityScore < 60 ? (
                <span className="text-yellow-600 ml-1">
                  Melhore o preenchimento de dados dos projetos.
                </span>
              ) : (
                <span className="text-blue-600 ml-1">
                  Continue aprimorando a qualidade dos dados.
                </span>
              )}
            </div>
            <InfoTooltip content="Sugestão automática da IA para melhorar a qualidade geral do seu portfólio de projetos." />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
