
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useDashboardData } from '@/hooks/useDashboardData';
import { Plus, FolderOpen, Calendar, BarChart3, Activity } from 'lucide-react';

const Dashboard = () => {
  const { isAuthenticated, user, loading } = useAuth();
  const navigate = useNavigate();
  
  const {
    projects,
    stats,
    isLoadingProjects
  } = useDashboardData();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, loading, navigate]);

  if (loading || isLoadingProjects) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando dashboard...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Usuário';

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Header com boas-vindas */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Olá, {userName}! 👋
          </h1>
          <p className="text-gray-600 text-lg">
            Bem-vindo ao seu painel de controle. Gerencie seus projetos de forma inteligente.
          </p>
        </div>

        {/* Cards de estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total de Projetos
              </CardTitle>
              <FolderOpen className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stats.totalProjects}</div>
              <p className="text-xs text-gray-500">
                Projetos no sistema
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Área Total
              </CardTitle>
              <BarChart3 className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {stats.totalArea.toFixed(0)}m²
              </div>
              <p className="text-xs text-gray-500">
                Área construída total
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Projetos Recentes
              </CardTitle>
              <Calendar className="h-4 w-4 text-indigo-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stats.recentProjects}</div>
              <p className="text-xs text-gray-500">
                Últimos 7 dias
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Tempo Economizado
              </CardTitle>
              <Activity className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stats.timeSaved}h</div>
              <p className="text-xs text-gray-500">
                Com automação IA
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Ações rápidas */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-xl text-gray-900">Ações Rápidas</CardTitle>
            <CardDescription className="text-gray-600">
              Inicie um novo projeto ou gerencie os existentes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button 
                onClick={() => navigate('/upload')}
                className="h-20 flex flex-col items-center justify-center space-y-2 bg-blue-600 hover:bg-blue-700"
                size="lg"
              >
                <Plus className="h-6 w-6" />
                <span>Novo Projeto</span>
              </Button>
              
              <Button 
                onClick={() => navigate('/projetos')}
                variant="outline"
                className="h-20 flex flex-col items-center justify-center space-y-2 border-gray-200 hover:bg-gray-50"
                size="lg"
              >
                <FolderOpen className="h-6 w-6" />
                <span>Ver Todos os Projetos</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Grade de projetos recentes */}
        {projects.length > 0 ? (
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="text-xl text-gray-900">Projetos Recentes</CardTitle>
              <CardDescription className="text-gray-600">
                Seus últimos projetos enviados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {projects.slice(0, 6).map((project) => (
                  <Card 
                    key={project.id}
                    className="cursor-pointer hover:shadow-md transition-shadow border border-gray-200"
                    onClick={() => navigate(`/projeto/${project.id}`)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {project.name}
                        </h3>
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          {project.analysis_data ? 'Analisado' : 'Processando'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500 mb-2">
                        {new Date(project.created_at).toLocaleDateString('pt-BR')}
                      </p>
                      {project.total_area && (
                        <p className="text-sm text-gray-600">
                          Área: {project.total_area.toFixed(0)}m²
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {projects.length > 6 && (
                <div className="mt-4 text-center">
                  <Button 
                    onClick={() => navigate('/projetos')}
                    variant="outline"
                  >
                    Ver Todos os {projects.length} Projetos
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card className="border-0 shadow-md text-center py-12">
            <CardContent>
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plus className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Nenhum projeto ainda
                </h3>
                <p className="text-gray-600 mb-6">
                  Comece enviando seu primeiro projeto PDF para análise com IA.
                </p>
                <Button 
                  onClick={() => navigate('/upload')}
                  className="bg-blue-600 hover:bg-blue-700"
                  size="lg"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Enviar Primeiro Projeto
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
};

export default Dashboard;
