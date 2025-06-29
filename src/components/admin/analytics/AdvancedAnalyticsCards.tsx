
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Activity, 
  Brain, 
  DollarSign, 
  TrendingUp, 
  Clock,
  Target,
  Zap
} from 'lucide-react';

interface AdvancedAnalyticsCardsProps {
  analytics: {
    total_users: number;
    active_users_week: number;
    active_users_month: number;
    avg_session_duration: number;
    total_ai_calls: number;
    ai_cost_month: number;
    conversion_rate: number;
    top_features: Array<{ feature: string; count: number }>;
  };
}

export const AdvancedAnalyticsCards = ({ analytics }: AdvancedAnalyticsCardsProps) => {
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}m ${remainingSeconds}s`;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  const statsCards = [
    {
      title: 'Usuários Ativos (Semana)',
      value: analytics.active_users_week,
      description: `${Math.round((analytics.active_users_week / analytics.total_users) * 100)}% do total`,
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Usuários Ativos (Mês)',
      value: analytics.active_users_month,
      description: `${Math.round((analytics.active_users_month / analytics.total_users) * 100)}% do total`,
      icon: Activity,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Sessão Média',
      value: formatDuration(analytics.avg_session_duration),
      description: 'Tempo médio por sessão',
      icon: Clock,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      isFormatted: true
    },
    {
      title: 'Chamadas de IA (Mês)',
      value: analytics.total_ai_calls,
      description: 'Interações com IA este mês',
      icon: Brain,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      title: 'Custo IA (Mês)',
      value: formatCurrency(analytics.ai_cost_month),
      description: 'Gasto em tokens OpenAI',
      icon: DollarSign,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      isFormatted: true
    },
    {
      title: 'Taxa de Conversão',
      value: `${analytics.conversion_rate.toFixed(1)}%`,
      description: 'Free → Paid',
      icon: Target,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      isFormatted: true
    }
  ];

  return (
    <div className="space-y-6">
      {/* Cards principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <div>
                  <CardTitle className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </CardTitle>
                  <CardDescription className="text-xs text-gray-500 mt-1">
                    {stat.description}
                  </CardDescription>
                </div>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  {stat.isFormatted ? stat.value : Number(stat.value).toLocaleString('pt-BR')}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Features mais usadas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-600" />
            Top Features (Últimos 30 dias)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analytics.top_features.map((feature, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-sm font-medium capitalize">
                  {feature.feature.replace('_', ' ')}
                </span>
                <Badge variant="secondary" className="flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  {feature.count.toLocaleString('pt-BR')}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
