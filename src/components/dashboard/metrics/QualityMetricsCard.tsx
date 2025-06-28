
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

  const tooltipContent = `
    **QUALIDADE DOS DADOS** - Como Interpretar:

    • **QUALIDADE GERAL:** Média de todas as métricas. Excelente (+90%) | Boa (80-89%) | Regular (60-79%) | Precisa Melhorar (-60%).

    • **COMPLETUDE:** Projetos com análise completa (orçamento + cronograma + documentação).

    • **DADOS:** Qualidade das informações fornecidas. Dados melhores = análises mais precisas.

    • **REVISÕES:** Projetos atualizados após análise inicial. Indica melhoria contínua.

    • **PRECISÃO MÉDIA:** Confiabilidade das estimativas da IA. +80% = Muito confiável.

    • **RECOMENDAÇÃO:** Sugestão automática para melhorar a qualidade geral do portfólio.
  `;

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
        {/* Score Geral */}
        <div className={`p-4 rounded-lg border mb-4 ${getQualityBadgeColor(quality.avgAccuracy)}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-orange-600" />
              <span className="font-medium text-gray-700">Qualidade Geral</span>
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
            <div className={`text-2xl font-bold ${getQualityColor(quality.completionRate)} mb-2`}>
              {quality.completionRate}%
            </div>
            <div className="text-sm text-gray-600 flex items-center justify-center space-x-1">
              <CheckCircle className="h-3 w-3 text-green-500" />
              <span>Completude</span>
            </div>
            <div className="text-xs text-gray-500">projetos analisados</div>
          </div>

          {/* Qualidade dos Dados */}
          <div className="text-center p-3 bg-gray-50 rounded-lg border border-gray-100">
            <div className={`text-2xl font-bold ${getQualityColor(quality.dataQualityScore)} mb-2`}>
              {quality.dataQualityScore}%
            </div>
            <div className="text-sm text-gray-600 flex items-center justify-center space-x-1">
              <Award className="h-3 w-3 text-orange-500" />
              <span>Dados</span>
            </div>
            <div className="text-xs text-gray-500">informações completas</div>
          </div>

          {/* Taxa de Revisão */}
          <div className="text-center p-3 bg-gray-50 rounded-lg border border-gray-100">
            <div className={`text-2xl font-bold ${getQualityColor(quality.revisionRate)} mb-2`}>
              {quality.revisionRate}%
            </div>
            <div className="text-sm text-gray-600 flex items-center justify-center space-x-1">
              <RefreshCw className="h-3 w-3 text-blue-500" />
              <span>Revisões</span>
            </div>
            <div className="text-xs text-gray-500">projetos atualizados</div>
          </div>

          {/* Precisão Média */}
          <div className="text-center p-3 bg-gray-50 rounded-lg border border-gray-100">
            <div className={`text-2xl font-bold ${getQualityColor(quality.avgAccuracy)} mb-2`}>
              {quality.avgAccuracy}%
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
        </div>
      </CardContent>
    </Card>
  );
};
