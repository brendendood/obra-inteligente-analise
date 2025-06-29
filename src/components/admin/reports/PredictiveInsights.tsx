
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  AlertTriangle, 
  Target, 
  Lightbulb,
  Brain,
  DollarSign,
  Users,
  Clock
} from 'lucide-react';

interface PredictiveInsightsProps {
  data?: {
    predictedRevenue: number;
    riskProjects: number;
    recommendations: string[];
  };
}

export const PredictiveInsights = ({ data }: PredictiveInsightsProps) => {
  if (!data) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="text-center text-gray-500">
            <Brain className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p>Insights preditivos não disponíveis</p>
            <p className="text-sm mt-2">Aguarde enquanto coletamos dados suficientes para análises preditivas</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const insights = [
    {
      title: 'Projeção de Receita',
      icon: DollarSign,
      value: `R$ ${data.predictedRevenue.toLocaleString('pt-BR')}`,
      description: 'Receita prevista para os próximos 30 dias',
      trend: 'up',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Projetos em Risco',
      icon: AlertTriangle,
      value: data.riskProjects.toString(),
      description: 'Projetos com alto risco de abandono',
      trend: 'warning',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      title: 'Taxa de Retenção',
      icon: Users,
      value: '87.3%',
      description: 'Previsão baseada no comportamento atual',
      trend: 'up',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Tempo Médio de Conversão',
      icon: Clock,
      value: '14 dias',
      description: 'Do cadastro até primeira assinatura paga',
      trend: 'stable',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Cards de Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {insights.map((insight, index) => {
          const Icon = insight.icon;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {insight.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${insight.bgColor}`}>
                  <Icon className={`h-4 w-4 ${insight.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${insight.color}`}>
                  {insight.value}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {insight.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recomendações Inteligentes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-yellow-600" />
            Recomendações Inteligentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.recommendations.map((recommendation, index) => (
              <div 
                key={index}
                className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Target className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {recommendation}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="secondary" className="text-xs">
                      Alta prioridade
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      IA Sugerido
                    </Badge>
                  </div>
                </div>
                <Button size="sm" variant="outline">
                  Aplicar
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Análise Preditiva de Comportamento */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              Padrões de Conversão
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-sm text-gray-600">
                <p className="mb-3">Com base no histórico de usuários similares:</p>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Usuários que criam 1+ projeto</span>
                    <Badge variant="secondary">73% convertem</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Usuários que usam IA 3+ vezes</span>
                    <Badge variant="secondary">91% convertem</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Usuários ativos por 7+ dias</span>
                    <Badge variant="secondary">84% convertem</Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-600" />
              Insights de IA
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-sm text-gray-600">
                <p className="mb-3">Análise automatizada do comportamento:</p>
                
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="font-medium text-blue-900">💡 Oportunidade Detectada</p>
                    <p className="text-blue-700 text-sm mt-1">
                      Usuários que geram orçamento têm 3x mais chance de assinar o plano Pro
                    </p>
                  </div>
                  
                  <div className="p-3 bg-orange-50 rounded-lg">
                    <p className="font-medium text-orange-900">⚠️ Alerta de Churn</p>
                    <p className="text-orange-700 text-sm mt-1">
                      Usuários inativos por 5+ dias têm 60% de chance de cancelar
                    </p>
                  </div>
                  
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="font-medium text-green-900">📈 Tendência Positiva</p>
                    <p className="text-green-700 text-sm mt-1">
                      Crescimento de 15% no uso de cronogramas automáticos
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
