
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { GeolocationTester } from './GeolocationTester';
import { 
  Users, 
  UserCheck, 
  Calendar, 
  TrendingUp,
  RefreshCw,
  AlertCircle,
  MapPin
} from 'lucide-react';

interface DashboardStats {
  total_users: number;
  total_projects: number;
  active_subscriptions: number;
  monthly_revenue: number;
  new_users_this_month: number;
  ai_usage_this_month: number;
  planDistribution?: {
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
      console.log('📊 DASHBOARD: Carregando estatísticas via RPC corrigida...');

      // Usar a função RPC corrigida
      const { data: rpcData, error: rpcError } = await supabase.rpc('get_admin_dashboard_stats');
      
      if (rpcError) {
        console.error('❌ DASHBOARD: Erro na RPC:', rpcError);
        throw rpcError;
      }

      if (!rpcData || rpcData.length === 0) {
        console.warn('⚠️ DASHBOARD: RPC retornou dados vazios');
        throw new Error('Nenhum dado retornado da função RPC');
      }

      const rpcStats = rpcData[0];
      console.log('✅ DASHBOARD: Dados RPC recebidos:', rpcStats);

      // Buscar distribuição de planos diretamente da tabela users
      const { data: usersData } = await supabase
        .from('users')
        .select('plan_code');

      const planDistribution = usersData?.reduce((acc: any, user: any) => {
        const plan = user.plan_code || 'free';
        acc[plan] = (acc[plan] || 0) + 1;
        return acc;
      }, {}) || {};

      const dashboardStats: DashboardStats = {
        total_users: Number(rpcStats.total_users) || 0,
        total_projects: Number(rpcStats.total_projects) || 0,
        active_subscriptions: Number(rpcStats.active_subscriptions) || 0,
        monthly_revenue: Number(rpcStats.monthly_revenue) || 0,
        new_users_this_month: Number(rpcStats.new_users_this_month) || 0,
        ai_usage_this_month: Number(rpcStats.ai_usage_this_month) || 0,
        planDistribution: {
          free: planDistribution.free || 0,
          pro: planDistribution.pro || 0,
          enterprise: planDistribution.enterprise || 0
        }
      };

      setStats(dashboardStats);
      console.log('✅ DASHBOARD: Estatísticas processadas:', dashboardStats);
      
    } catch (error) {
      console.error('💥 DASHBOARD: Erro ao carregar estatísticas:', error);
      setError(error instanceof Error ? error.message : 'Erro desconhecido');
      
      toast({
        title: "Erro ao carregar dashboard",
        description: "Não foi possível carregar as estatísticas. Tentando novamente...",
        variant: "destructive",
      });

      // Fallback: definir valores padrão
      setStats({
        total_users: 0,
        total_projects: 0,
        active_subscriptions: 0,
        monthly_revenue: 0,
        new_users_this_month: 0,
        ai_usage_this_month: 0,
        planDistribution: { free: 0, pro: 0, enterprise: 0 }
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
            <div className="text-2xl font-bold">{stats.total_users}</div>
            <p className="text-xs text-gray-500 mt-1">
              Usuários registrados na plataforma
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total de Projetos
            </CardTitle>
            <UserCheck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_projects}</div>
            <p className="text-xs text-gray-500 mt-1">
              Projetos criados na plataforma
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Novos Usuários (Mês)
            </CardTitle>
            <Calendar className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.new_users_this_month}</div>
            <p className="text-xs text-gray-500 mt-1">
              Cadastros este mês
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Receita Mensal
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {stats.monthly_revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Receita deste mês
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
                <Badge variant="outline">{stats.planDistribution?.free || 0} usuários</Badge>
                <span className="text-sm text-gray-500">
                  {stats.total_users > 0 
                    ? ((stats.planDistribution?.free || 0) / stats.total_users * 100).toFixed(1)
                    : '0'
                  }%
                </span>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Pro</span>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="border-blue-200 text-blue-700">
                  {stats.planDistribution?.pro || 0} usuários
                </Badge>
                <span className="text-sm text-gray-500">
                  {stats.total_users > 0 
                    ? ((stats.planDistribution?.pro || 0) / stats.total_users * 100).toFixed(1)
                    : '0'
                  }%
                </span>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Enterprise</span>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="border-purple-200 text-purple-700">
                  {stats.planDistribution?.enterprise || 0} usuários
                </Badge>
                <span className="text-sm text-gray-500">
                  {stats.total_users > 0 
                    ? ((stats.planDistribution?.enterprise || 0) / stats.total_users * 100).toFixed(1)
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

      {/* Teste de Geolocalização */}
      <div className="flex justify-center">
        <GeolocationTester />
      </div>
    </div>
  );
};
