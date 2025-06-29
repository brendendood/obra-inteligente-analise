
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, TrendingUp, CreditCard, Users } from 'lucide-react';

interface PaymentStats {
  total_revenue: number;
  monthly_revenue: number;
  active_subscriptions: number;
  failed_payments: number;
}

interface PaymentsStatsProps {
  stats: PaymentStats;
}

export const PaymentsStats = ({ stats }: PaymentsStatsProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const statsCards = [
    {
      title: 'Receita Total',
      value: formatCurrency(stats.total_revenue),
      description: 'Faturamento acumulado',
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Receita Mensal',
      value: formatCurrency(stats.monthly_revenue),
      description: 'Faturamento do mês',
      icon: TrendingUp,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Transações Totais',
      value: stats.active_subscriptions.toLocaleString('pt-BR'),
      description: 'Pagamentos processados',
      icon: CreditCard,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Assinaturas Ativas',
      value: stats.active_subscriptions.toLocaleString('pt-BR'),
      description: 'Usuários pagantes',
      icon: Users,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <CardDescription className="text-2xl font-bold text-gray-900 mt-1">
                  {stat.value}
                </CardDescription>
                <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
              </div>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <Icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </CardHeader>
          </Card>
        );
      })}
    </div>
  );
};
