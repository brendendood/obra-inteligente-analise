
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { AppLayout } from '@/components/layout/AppLayout';
import { OnboardingDetector } from '@/components/onboarding/OnboardingDetector';
import { useDashboardData } from '@/hooks/useDashboardData';
import { EnhancedBreadcrumb } from '@/components/navigation/EnhancedBreadcrumb';
import { SmartLoading } from '@/components/ui/smart-loading';
import DashboardLoadingState from '@/components/dashboard/DashboardLoadingState';
import { ProjectCardEnhanced } from '@/components/ui/project-card-enhanced';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { Button } from '@/components/ui/button';
import { Plus, FolderOpen } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Dashboard = () => {
  const { isAuthenticated, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  const {
    projects,
    stats,
    isLoadingProjects,
    forceRefresh
  } = useDashboardData();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login');
      return;
    }
  }, [isAuthenticated, authLoading, navigate]);

  const isInitialLoading = authLoading;

  if (isInitialLoading) {
    return <DashboardLoadingState />;
  }

  if (!isAuthenticated) {
    return null;
  }

  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Usuário';
  const greeting = new Date().getHours() < 12 ? 'Bom dia' : new Date().getHours() < 18 ? 'Boa tarde' : 'Boa noite';

  return (
    <AppLayout>
      <OnboardingDetector>
        <div className="space-y-8 animate-fade-in">
          <div className="flex items-center justify-between">
            <EnhancedBreadcrumb />
            <SmartLoading 
              isLoading={isLoadingProjects} 
              hasData={projects.length > 0}
              successText={`${projects.length} projetos sincronizados`}
              loadingText="Sincronizando projetos..."
            />
          </div>
          
          {/* Welcome Header */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-8 transition-all duration-300 hover:shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {greeting}, {userName} 👋
                </h1>
                <p className="text-lg text-gray-600">
                  Gerencie seus projetos de construção com IA
                </p>
              </div>
              <div className="flex items-center space-x-3">
                {!isLoadingProjects && (
                  <button
                    onClick={forceRefresh}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
                  >
                    🔄 Sincronizar
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <StatsCards stats={stats} />

          {/* Projects Section - Pasta Style */}
          <Card className="border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all duration-300">
            <CardHeader className="pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FolderOpen className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-semibold text-gray-900">
                      Meus Projetos
                    </CardTitle>
                    <p className="text-sm text-gray-500 mt-1">
                      {projects.length} projeto{projects.length !== 1 ? 's' : ''} disponível{projects.length !== 1 ? 'is' : ''}
                    </p>
                  </div>
                </div>
                
                <Button
                  onClick={() => navigate('/upload')}
                  className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 h-12 px-6 font-medium rounded-lg"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Criar Novo Projeto
                </Button>
              </div>
            </CardHeader>
            
            <CardContent>
              {projects.length === 0 ? (
                <div className="text-center py-16 animate-fade-in">
                  <div className="bg-gray-50 rounded-2xl p-12 border-2 border-dashed border-gray-200">
                    <FolderOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Nenhum projeto ainda
                    </h3>
                    <p className="text-gray-500 mb-6 max-w-md mx-auto">
                      Comece criando seu primeiro projeto. Faça upload de plantas, documentos ou dados do seu projeto.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <Button 
                        onClick={() => navigate('/upload')}
                        className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Criar Primeiro Projeto
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
                    {projects.slice(0, 6).map((project, index) => (
                      <div 
                        key={project.id} 
                        className="animate-scale-in"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <ProjectCardEnhanced
                          project={project}
                          showQuickActions={true}
                        />
                      </div>
                    ))}
                  </div>
                  
                  {projects.length > 6 && (
                    <div className="mt-8 text-center">
                      <Button
                        variant="outline"
                        onClick={() => navigate('/projetos')}
                        className="border-gray-300 hover:border-blue-300 hover:bg-blue-50 text-gray-700 hover:text-blue-700 transition-all duration-200"
                      >
                        <FolderOpen className="h-4 w-4 mr-2" />
                        Ver Todos os Projetos ({projects.length})
                      </Button>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </OnboardingDetector>
    </AppLayout>
  );
};

export default Dashboard;
