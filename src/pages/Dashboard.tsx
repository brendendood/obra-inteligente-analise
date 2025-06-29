
import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useProjectStore } from '@/stores/projectStore';
import { 
  Building2, 
  FileText, 
  TrendingUp, 
  Calendar,
  Plus,
  BarChart,
  Clock,
  CheckCircle
} from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { projects, fetchProjects, isLoading } = useProjectStore();
  const [stats, setStats] = useState({
    totalProjects: 0,
    analyzedProjects: 0,
    inProgress: 0,
    completedThisMonth: 0
  });

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  useEffect(() => {
    if (projects.length > 0) {
      const analyzedCount = projects.filter(p => p.analysis_data).length;
      const inProgressCount = projects.filter(p => !p.analysis_data).length;
      const thisMonth = new Date();
      thisMonth.setDate(1);
      const completedThisMonth = projects.filter(p => 
        p.analysis_data && new Date(p.created_at) >= thisMonth
      ).length;

      setStats({
        totalProjects: projects.length,
        analyzedProjects: analyzedCount,
        inProgress: inProgressCount,
        completedThisMonth
      });
    }
  }, [projects]);

  const recentProjects = projects.slice(0, 3);
  const completionRate = stats.totalProjects > 0 ? (stats.analyzedProjects / stats.totalProjects) * 100 : 0;

  if (isLoading) {
    return (
      <AppLayout>
        <div className="min-h-screen bg-gray-50/30 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando dashboard...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="min-h-screen bg-gray-50/30">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Bem-vindo, {user?.email?.split('@')[0] || 'Usuário'}! 👋
              </h1>
              <p className="text-gray-600 mt-1">
                Aqui está um resumo dos seus projetos e atividades recentes
              </p>
            </div>
            <Button
              onClick={() => navigate('/upload')}
              className="bg-blue-600 hover:bg-blue-700 text-white h-11 px-6 font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
            >
              <Plus className="h-4 w-4 mr-2" />
              Novo Projeto
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Projetos</CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalProjects}</div>
                <p className="text-xs text-muted-foreground">Projetos criados</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Projetos Analisados</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.analyzedProjects}</div>
                <p className="text-xs text-muted-foreground">Análises concluídas</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Em Progresso</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.inProgress}</div>
                <p className="text-xs text-muted-foreground">Aguardando análise</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Este Mês</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.completedThisMonth}</div>
                <p className="text-xs text-muted-foreground">Projetos finalizados</p>
              </CardContent>
            </Card>
          </div>

          {/* Progress and Recent Projects */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Progress Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart className="h-5 w-5 text-blue-600" />
                  Taxa de Conclusão
                </CardTitle>
                <CardDescription>
                  Progresso geral dos seus projetos
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Projetos Concluídos</span>
                    <span>{Math.round(completionRate)}%</span>
                  </div>
                  <Progress value={completionRate} className="h-2" />
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span>Analisados: {stats.analyzedProjects}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span>Pendentes: {stats.inProgress}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Projects */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-purple-600" />
                  Projetos Recentes
                </CardTitle>
                <CardDescription>
                  Seus últimos projetos criados
                </CardDescription>
              </CardHeader>
              <CardContent>
                {recentProjects.length > 0 ? (
                  <div className="space-y-4">
                    {recentProjects.map((project) => (
                      <div key={project.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 truncate">{project.name}</h4>
                          <p className="text-sm text-gray-500">
                            {new Date(project.created_at).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={project.analysis_data ? 'default' : 'secondary'}>
                            {project.analysis_data ? 'Analisado' : 'Pendente'}
                          </Badge>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => navigate(`/projeto/${project.id}`)}
                          >
                            Abrir
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">Nenhum projeto ainda</p>
                    <Button onClick={() => navigate('/upload')}>
                      <Plus className="h-4 w-4 mr-2" />
                      Criar Primeiro Projeto
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Ações Rápidas</CardTitle>
              <CardDescription>
                Acesse rapidamente as principais funcionalidades
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                  variant="outline"
                  className="h-16 flex flex-col items-center justify-center space-y-2"
                  onClick={() => navigate('/projetos')}
                >
                  <Building2 className="h-6 w-6" />
                  <span>Ver Todos os Projetos</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-16 flex flex-col items-center justify-center space-y-2"
                  onClick={() => navigate('/ia')}
                >
                  <TrendingUp className="h-6 w-6" />
                  <span>Assistente IA</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-16 flex flex-col items-center justify-center space-y-2"
                  onClick={() => navigate('/upload')}
                >
                  <Plus className="h-6 w-6" />
                  <span>Novo Upload</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
