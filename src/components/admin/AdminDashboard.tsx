
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Users, 
  UserCheck, 
  Calendar, 
  TrendingUp,
  RefreshCw,
  AlertCircle
} from 'lucide-react';

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  lastRegistration: string | null;
  planDistribution: {
    free: number;
    pro: number;
    enterprise: number;
  };
}

export const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const loadDashboardStats = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('📊 DASHBOARD: Carregando estatísticas reais...');

      // Carregar usuários totais
      const { data: allUsers, error: usersError } = await supabase
        .from('user_profiles')
        .select('user_id, created_at');

      if (usersError) throw usersError;

      // Carregar distribuição de planos
      const { data: subscriptions, error: subsError } = await supabase
        .from('user_subscriptions')
        .select('plan');

      if (subsError) throw subsError;

      // Calcular estatísticas
      const totalUsers = allUsers?.length || 0;
      
      // Usuários ativos (com perfil criado nos últimos 30 dias)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const activeUsers = allUsers?.filter(user => 
        new Date(user.created_at) > thirtyDaysAgo
      ).length || 0;

      // Último registro
      const lastRegistration = allUsers && allUsers.length > 0 
        ? allUsers.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0].created_at
        : null;

      // Distribuição de planos
      const planDistribution = {
        free: subscriptions?.filter(s => s.plan === 'free').length || 0,
        pro: subscriptions?.filter(s => s.plan === 'pro').length || 0,
        enterprise: subscriptions?.filter(s => s.plan === 'enterprise').length || 0,
      };

      const dashboardStats: DashboardStats = {
        totalUsers,
        activeUsers,
        lastRegistration,
        planDistribution
      };

      setStats(dashboardStats);
      console.log('✅ DASHBOARD: Estatísticas carregadas:', dashboardStats);

    } catch (error) {
      console.error('❌ DASHBOARD: Erro ao carregar estatísticas:', error);
      setError(error instanceof Error ? error.message : 'Erro desconhecido');
      toast({
        title: "Erro ao carregar dados",
        description: "Não foi possível carregar as estatísticas do dashboard",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardStats();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Dashboard Admin</h2>
            <p className="text-gray-600">Visão geral da plataforma com dados reais</p>
          </div>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-lg animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Dashboard Admin</h2>
            <p className="text-gray-600">Erro ao carregar dados</p>
          </div>
          <Button onClick={loadDashboardStats} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Tentar Novamente
          </Button>
        </div>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Erro ao carregar dashboard</h3>
              <p className="text-gray-500 mb-4">{error}</p>
              <Button onClick={loadDashboardStats}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Tentar Novamente
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Nenhum dado disponível</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Dashboard Admin</h2>
          <p className="text-gray-600">Visão geral da plataforma com dados reais</p>
        </div>
        <Button onClick={loadDashboardStats} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Atualizar
        </Button>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total de Usuários
            </CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-gray-500 mt-1">
              Usuários registrados na plataforma
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Usuários Ativos (30d)
            </CardTitle>
            <UserCheck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeUsers}</div>
            <p className="text-xs text-gray-500 mt-1">
              Registrados nos últimos 30 dias
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Último Registro
            </CardTitle>
            <Calendar className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-bold">
              {stats.lastRegistration 
                ? new Date(stats.lastRegistration).toLocaleDateString('pt-BR')
                : 'Nenhum'
              }
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Data do último cadastro
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Taxa de Conversão
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalUsers > 0 
                ? ((stats.planDistribution.pro + stats.planDistribution.enterprise) / stats.totalUsers * 100).toFixed(1)
                : '0.0'
              }%
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Free → Paid
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Distribuição de Planos */}
      <Card>
        <CardHeader>
          <CardTitle>Distribuição de Planos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Free</span>
              <div className="flex items-center gap-2">
                <Badge variant="outline">{stats.planDistribution.free} usuários</Badge>
                <span className="text-sm text-gray-500">
                  {stats.totalUsers > 0 
                    ? (stats.planDistribution.free / stats.totalUsers * 100).toFixed(1)
                    : '0'
                  }%
                </span>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Pro</span>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="border-blue-200 text-blue-700">
                  {stats.planDistribution.pro} usuários
                </Badge>
                <span className="text-sm text-gray-500">
                  {stats.totalUsers > 0 
                    ? (stats.planDistribution.pro / stats.totalUsers * 100).toFixed(1)
                    : '0'
                  }%
                </span>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Enterprise</span>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="border-purple-200 text-purple-700">
                  {stats.planDistribution.enterprise} usuários
                </Badge>
                <span className="text-sm text-gray-500">
                  {stats.totalUsers > 0 
                    ? (stats.planDistribution.enterprise / stats.totalUsers * 100).toFixed(1)
                    : '0'
                  }%
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Informações de Sistema */}
      <Card>
        <CardHeader>
          <CardTitle>Status do Sistema</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-2"></div>
              <p className="text-sm font-medium">Banco de Dados</p>
              <p className="text-xs text-gray-500">Online</p>
            </div>
            <div className="text-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-2"></div>
              <p className="text-sm font-medium">Autenticação</p>
              <p className="text-xs text-gray-500">Funcionando</p>
            </div>
            <div className="text-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-2"></div>
              <p className="text-sm font-medium">Storage</p>
              <p className="text-xs text-gray-500">Disponível</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
