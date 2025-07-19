
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, FolderOpen, CreditCard, TrendingUp, UserPlus, Brain, Activity } from 'lucide-react';
import { useAdminStats } from '@/hooks/useAdminStats';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

export const AdminDashboard = () => {
  const { stats, loading } = useAdminStats();

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

  if (!stats) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Erro ao carregar estatísticas do dashboard.</p>
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
      value: stats.total_users,
      description: 'Usuários registrados na plataforma',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      change: '+12%'
    },
    {
      title: 'Total de Projetos',
      value: stats.total_projects,
      description: 'Projetos criados pelos usuários',
      icon: FolderOpen,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      change: '+8%'
    },
    {
      title: 'Assinaturas Ativas',
      value: stats.active_subscriptions,
      description: 'Usuários com planos pagos',
      icon: CreditCard,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      change: '+23%'
    },
    {
      title: 'Receita Mensal',
      value: formatCurrency(Number(stats.monthly_revenue)),
      description: 'Faturamento do mês atual',
      icon: TrendingUp,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      isFormatted: true,
      change: '+15%'
    },
    {
      title: 'Novos Usuários',
      value: stats.new_users_this_month,
      description: 'Cadastros neste mês',
      icon: UserPlus,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      change: '+18%'
    },
    {
      title: 'Uso de IA',
      value: stats.ai_usage_this_month,
      description: 'Interações com IA neste mês',
      icon: Brain,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
      change: '+34%'
    }
  ];

  // Dados fictícios para os gráficos (substituir por dados reais)
  const monthlyData = [
    { month: 'Jan', users: 65, projects: 28, revenue: 15000 },
    { month: 'Fev', users: 75, projects: 35, revenue: 18000 },
    { month: 'Mar', users: 85, projects: 42, revenue: 22000 },
    { month: 'Abr', users: 95, projects: 48, revenue: 25000 },
    { month: 'Mai', users: 110, projects: 55, revenue: 28000 },
    { month: 'Jun', users: 125, projects: 62, revenue: 32000 }
  ];

  const planDistribution = [
    { name: 'Free', value: 65, color: '#64748b' },
    { name: 'Pro', value: 25, color: '#3b82f6' },
    { name: 'Enterprise', value: 10, color: '#8b5cf6' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Administrativo</h1>
        <p className="text-gray-600 mt-2">Visão geral da plataforma MadenAI</p>
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
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold text-gray-900">
                    {stat.isFormatted ? stat.value : Number(stat.value).toLocaleString('pt-BR')}
                  </div>
                  <Badge variant="secondary" className="text-green-700 bg-green-100">
                    {stat.change}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        {/* Monthly Growth Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              Crescimento Mensal
            </CardTitle>
            <CardDescription>Usuários e projetos ao longo do tempo</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={2} />
                <Line type="monotone" dataKey="projects" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Plan Distribution Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-purple-600" />
              Distribuição de Planos
            </CardTitle>
            <CardDescription>Porcentagem de usuários por plano</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={planDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {planDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-emerald-600" />
            Receita Mensal
          </CardTitle>
          <CardDescription>Evolução da receita ao longo dos meses</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Bar dataKey="revenue" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              Métricas de Crescimento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Taxa de Conversão</span>
                <Badge variant="secondary">
                  {stats.active_subscriptions > 0 
                    ? Math.round((stats.active_subscriptions / stats.total_users) * 100)
                    : 0}%
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Projetos por Usuário</span>
                <Badge variant="outline">
                  {stats.total_users > 0 
                    ? (stats.total_projects / stats.total_users).toFixed(1)
                    : 0}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Receita por Usuário (ARR)</span>
                <Badge variant="secondary">
                  {formatCurrency(stats.total_users > 0 ? (stats.monthly_revenue * 12) / stats.total_users : 0)}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-600" />
              Analytics de IA
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Uso Médio por Usuário</span>
                <Badge variant="secondary">
                  {stats.total_users > 0 
                    ? Math.round(stats.ai_usage_this_month / stats.total_users)
                    : 0} calls
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Engagement IA</span>
                <Badge variant={stats.ai_usage_this_month > 100 ? "default" : "outline"}>
                  {stats.ai_usage_this_month > 100 ? "Alto" : "Baixo"}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Crescimento Mensal</span>
                <Badge variant="secondary" className="text-green-700 bg-green-100">
                  +34%
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
