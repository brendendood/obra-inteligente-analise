
import { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Users, FolderOpen, CreditCard, TrendingUp, UserPlus, Brain, RefreshCw, AlertCircle } from 'lucide-react';
import { useUnifiedAdmin } from '@/hooks/useUnifiedAdmin';

export const AdminDashboard = () => {
  const { adminStats, loadAdminStats, error, forceRefresh } = useUnifiedAdmin();

  useEffect(() => {
    loadAdminStats();
  }, []);

  if (error) {
    return (
      <div className="space-y-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error}
            <Button onClick={forceRefresh} variant="outline" size="sm" className="ml-4">
              <RefreshCw className="h-4 w-4 mr-2" />
              Tentar Novamente
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!adminStats) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-3">
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-6 bg-gray-200 rounded w-1/3"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-1/4"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const statsCards = [
    {
      title: 'Total de Usuários',
      value: adminStats.total_users,
      description: 'Usuários registrados na plataforma',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Total de Projetos',
      value: adminStats.total_projects,
      description: 'Projetos criados pelos usuários',
      icon: FolderOpen,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Assinaturas Ativas',
      value: adminStats.active_subscriptions,
      description: 'Usuários com planos pagos',
      icon: CreditCard,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Receita Mensal',
      value: formatCurrency(Number(adminStats.monthly_revenue)),
      description: 'Faturamento do mês atual',
      icon: TrendingUp,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      isFormatted: true
    },
    {
      title: 'Novos Usuários',
      value: adminStats.new_users_this_month,
      description: 'Cadastros neste mês',
      icon: UserPlus,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      title: 'Uso de IA',
      value: adminStats.ai_usage_this_month,
      description: 'Interações com IA neste mês',
      icon: Brain,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Administrativo</h1>
          <p className="text-gray-600 mt-2">Visão geral da plataforma MadenAI</p>
        </div>
        <Button onClick={loadAdminStats} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Atualizar Dados
        </Button>
      </div>

      {/* Stats Grid */}
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

      {/* Status Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              Crescimento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Taxa de Conversão</span>
                <Badge variant="secondary">
                  {adminStats.active_subscriptions > 0 
                    ? Math.round((adminStats.active_subscriptions / adminStats.total_users) * 100)
                    : 0}%
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Projetos por Usuário</span>
                <Badge variant="outline">
                  {adminStats.total_users > 0 
                    ? (adminStats.total_projects / adminStats.total_users).toFixed(1)
                    : 0}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-600" />
              IA Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Uso Médio por Usuário</span>
                <Badge variant="secondary">
                  {adminStats.total_users > 0 
                    ? Math.round(adminStats.ai_usage_this_month / adminStats.total_users)
                    : 0} calls
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Engagement IA</span>
                <Badge variant={adminStats.ai_usage_this_month > 100 ? "default" : "outline"}>
                  {adminStats.ai_usage_this_month > 100 ? "Alto" : "Baixo"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
