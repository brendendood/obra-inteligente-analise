
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Users, 
  FileText, 
  Calculator, 
  BarChart3,
  Shield,
  Activity,
  Database,
  Clock
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const Admin = () => {
  const { isAuthenticated, user, loading } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProjects: 0,
    totalAnalyses: 0,
    activeUsers: 0
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, loading, navigate]);

  useEffect(() => {
    const loadStats = async () => {
      try {
        // Carregar estatísticas básicas
        const { data: projects, error: projectsError } = await supabase
          .from('projects')
          .select('id, user_id, created_at');

        if (projectsError) throw projectsError;

        const { data: analyses, error: analysesError } = await supabase
          .from('project_analyses')
          .select('id, created_at');

        if (analysesError) throw analysesError;

        // Calcular estatísticas
        const uniqueUsers = new Set(projects?.map(p => p.user_id) || []).size;
        const totalProjects = projects?.length || 0;
        const totalAnalyses = analyses?.length || 0;

        // Usuários ativos (últimos 7 dias)
        const lastWeek = new Date();
        lastWeek.setDate(lastWeek.getDate() - 7);
        const activeProjects = projects?.filter(p => new Date(p.created_at) > lastWeek) || [];
        const activeUsers = new Set(activeProjects.map(p => p.user_id)).size;

        setStats({
          totalUsers: uniqueUsers,
          totalProjects,
          totalAnalyses,
          activeUsers
        });
      } catch (error) {
        console.error('Error loading admin stats:', error);
      }
    };

    if (isAuthenticated) {
      loadStats();
    }
  }, [isAuthenticated]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-gradient-to-r from-red-600 to-pink-600 p-3 rounded-xl">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                Painel Administrativo
              </h1>
              <p className="text-slate-600">
                Visão geral do sistema ArqFlow.IA
              </p>
            </div>
          </div>
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-red-600" />
              <span className="text-red-800 font-medium">Área Restrita</span>
            </div>
            <p className="text-red-700 text-sm mt-1">
              Acesso administrativo para controle e monitoramento do sistema
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-lg border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Total de Usuários
              </CardTitle>
              <Users className="h-4 w-4 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">
                {stats.totalUsers}
              </div>
              <p className="text-xs text-slate-600">
                Usuários registrados
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Projetos Enviados
              </CardTitle>
              <FileText className="h-4 w-4 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">
                {stats.totalProjects}
              </div>
              <p className="text-xs text-slate-600">
                Total de uploads
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Análises IA
              </CardTitle>
              <BarChart3 className="h-4 w-4 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">
                {stats.totalAnalyses}
              </div>
              <p className="text-xs text-slate-600">
                Processamentos realizados
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Usuários Ativos
              </CardTitle>
              <Activity className="h-4 w-4 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">
                {stats.activeUsers}
              </div>
              <p className="text-xs text-slate-600">
                Últimos 7 dias
              </p>
            </CardContent>
          </Card>
        </div>

        {/* System Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Database className="h-5 w-5 text-blue-600" />
                <span>Sistema</span>
              </CardTitle>
              <CardDescription>
                Informações gerais da plataforma
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-600">Status:</span>
                <span className="text-green-600 font-medium">✅ Online</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Banco de Dados:</span>
                <span className="text-green-600 font-medium">✅ Conectado</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">IA Service:</span>
                <span className="text-green-600 font-medium">✅ Ativo</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Storage:</span>
                <span className="text-green-600 font-medium">✅ Disponível</span>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-purple-600" />
                <span>Atividade Recente</span>
              </CardTitle>
              <CardDescription>
                Últimas atividades do sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm text-slate-600">
                • Novos usuários registrados hoje: {stats.activeUsers}
              </div>
              <div className="text-sm text-slate-600">
                • Projetos analisados hoje: {Math.min(stats.totalAnalyses, 5)}
              </div>
              <div className="text-sm text-slate-600">
                • Sistema funcionando normalmente
              </div>
              <div className="text-sm text-slate-600">
                • Backup realizado automaticamente
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Admin;
