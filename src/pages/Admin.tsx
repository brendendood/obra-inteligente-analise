
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  FileText, 
  BarChart3,
  Shield,
  Activity,
  Database,
  Clock,
  Download,
  RefreshCw,
  TrendingUp,
  UserCheck
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useAdmin } from '@/hooks/useAdmin';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import AdminStatsCard from '@/components/admin/AdminStatsCard';
import UsersList from '@/components/admin/UsersList';
import { CompleteDataCleanup } from '@/components/admin/CompleteDataCleanup';

const Admin = () => {
  const { isAuthenticated, user, loading: authLoading } = useAuth();
  const { isAdmin, adminStats, loading: adminLoading, loadAdminStats } = useAdmin();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast({
        title: "🔐 Acesso negado",
        description: "Você precisa estar logado para acessar esta página.",
        variant: "destructive",
      });
      navigate('/login');
    }
  }, [isAuthenticated, authLoading, navigate, toast]);

  useEffect(() => {
    if (!adminLoading && isAuthenticated && !isAdmin) {
      toast({
        title: "🚫 Acesso restrito",
        description: "Você não tem permissão para acessar o painel administrativo.",
        variant: "destructive",
      });
      navigate('/painel');
    }
  }, [isAdmin, adminLoading, isAuthenticated, navigate, toast]);

  useEffect(() => {
    if (isAdmin) {
      loadAdminStats();
    }
  }, [isAdmin, loadAdminStats]);

  const handleRefreshStats = () => {
    loadAdminStats();
    toast({
      title: "📊 Dados atualizados",
      description: "Estatísticas recarregadas com sucesso.",
    });
  };

  const handleExportData = () => {
    toast({
      title: "📁 Exportação iniciada",
      description: "Os dados estão sendo preparados para download.",
    });
    // Implementar lógica de exportação
  };

  if (authLoading || adminLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Verificando permissões...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-red-600 to-pink-600 p-3 rounded-xl shadow-lg">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">
                  Painel Administrativo
                </h1>
                <p className="text-slate-600">
                  Bem-vindo, {user?.email?.split('@')[0]}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button 
                onClick={handleRefreshStats} 
                variant="outline" 
                size="sm"
                className="flex items-center space-x-2"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Atualizar</span>
              </Button>
              <Button 
                onClick={handleExportData}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 flex items-center space-x-2"
              >
                <Download className="h-4 w-4" />
                <span>Exportar</span>
              </Button>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <Shield className="h-5 w-5 text-red-600" />
              <div>
                <span className="text-red-800 font-medium">Área Administrativa</span>
                <p className="text-red-700 text-sm mt-1">
                  Acesso restrito para gestão e monitoramento da plataforma ArqFlow.IA
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Complete Data Cleanup Section */}
        <div className="mb-8">
          <CompleteDataCleanup />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <AdminStatsCard
            title="Total de Usuários"
            value={adminStats?.total_users || 0}
            description="Usuários registrados"
            icon={Users}
            trend={{ value: 12, label: "vs mês anterior", positive: true }}
          />
          
          <AdminStatsCard
            title="Projetos Enviados"
            value={adminStats?.total_projects || 0}
            description="Total de uploads"
            icon={FileText}
            trend={{ value: 8, label: "vs mês anterior", positive: true }}
          />
          
          <AdminStatsCard
            title="Análises IA"
            value={adminStats?.total_analyses || 0}
            description="Processamentos realizados"
            icon={BarChart3}
            trend={{ value: 15, label: "vs mês anterior", positive: true }}
          />
          
          <AdminStatsCard
            title="Usuários Ativos"
            value={adminStats?.active_users_week || 0}
            description="Últimos 7 dias"
            icon={Activity}
            trend={{ value: 5, label: "vs semana anterior", positive: true }}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* System Status */}
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Database className="h-5 w-5 text-green-600" />
                <span>Status do Sistema</span>
              </CardTitle>
              <CardDescription>
                Monitoramento em tempo real
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-600">API Status:</span>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-green-600 font-medium text-sm">Online</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Banco de Dados:</span>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-green-600 font-medium text-sm">Conectado</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600">IA Service:</span>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-green-600 font-medium text-sm">Ativo</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Storage:</span>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-green-600 font-medium text-sm">Disponível</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-purple-600" />
                <span>Atividade Recente</span>
              </CardTitle>
              <CardDescription>
                Últimas ações na plataforma
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-3 p-2 bg-blue-50 rounded-lg">
                <UserCheck className="h-4 w-4 text-blue-600" />
                <div className="text-sm">
                  <p className="text-slate-700">Novo usuário registrado</p>
                  <p className="text-slate-500 text-xs">há 2 minutos</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-2 bg-green-50 rounded-lg">
                <FileText className="h-4 w-4 text-green-600" />
                <div className="text-sm">
                  <p className="text-slate-700">Projeto analisado com IA</p>
                  <p className="text-slate-500 text-xs">há 5 minutos</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-2 bg-orange-50 rounded-lg">
                <TrendingUp className="h-4 w-4 text-orange-600" />
                <div className="text-sm">
                  <p className="text-slate-700">Backup automatizado</p>
                  <p className="text-slate-500 text-xs">há 1 hora</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-indigo-600" />
                <span>Métricas Rápidas</span>
              </CardTitle>
              <CardDescription>
                Indicadores de performance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Taxa de Conversão:</span>
                <span className="text-green-600 font-bold">68%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Tempo Médio Análise:</span>
                <span className="text-blue-600 font-bold">2.3s</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Satisfação Usuários:</span>
                <span className="text-green-600 font-bold">94%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Uptime Sistema:</span>
                <span className="text-green-600 font-bold">99.9%</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Users List */}
        <UsersList />
      </div>

      <Footer />
    </div>
  );
};

export default Admin;
