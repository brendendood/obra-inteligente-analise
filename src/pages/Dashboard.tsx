import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { AppLayout } from '@/components/layout/AppLayout';
import { useDashboardData } from '@/hooks/useDashboardData';
import { EnhancedBreadcrumb } from '@/components/navigation/EnhancedBreadcrumb';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { EnhancedQuickActions } from '@/components/dashboard/EnhancedQuickActions';
import { AnimatedProjectCard } from '@/components/ui/animated-card';
import { EnhancedSkeleton } from '@/components/ui/enhanced-skeleton';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import { Plus } from 'lucide-react';
import { SmartLoading } from '@/components/ui/smart-loading';

const Dashboard = () => {
  const { isAuthenticated, user, loading } = useAuth();
  const navigate = useNavigate();
  const { preferences, addRecentProject } = useUserPreferences();
  
  const {
    projects,
    stats,
    isLoadingProjects,
    forceRefresh
  } = useDashboardData();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, loading, navigate]);

  const handleProjectClick = (projectId: string) => {
    addRecentProject(projectId);
    navigate(`/projeto/${projectId}`);
  };

  if (loading || isLoadingProjects) {
    return (
      <AppLayout>
        <div className="space-y-8 animate-fade-in">
          <div className="flex items-center justify-between">
            <EnhancedSkeleton variant="text" lines={2} className="h-20 w-1/2" />
            <SmartLoading 
              isLoading={true} 
              hasData={false}
              loadingText="Carregando dashboard..."
              showProgress={true}
              progress={isLoadingProjects ? 50 : 75}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <EnhancedSkeleton key={i} variant="card" />
            ))}
          </div>
          <EnhancedSkeleton variant="card" className="h-40" />
        </div>
      </AppLayout>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Usuário';
  const greeting = new Date().getHours() < 12 ? 'Bom dia' : new Date().getHours() < 18 ? 'Boa tarde' : 'Boa noite';

  return (
    <AppLayout>
      <div className="space-y-8 animate-fade-in">
        <div className="flex items-center justify-between">
          <EnhancedBreadcrumb />
          <SmartLoading 
            isLoading={isLoadingProjects} 
            hasData={projects.length > 0}
            loadingText="Sincronizando..."
            successText={`${projects.length} projetos carregados`}
          />
        </div>
        
        {/* Header com boas-vindas animado */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {greeting}, {userName}! 👋
              </h1>
              <p className="text-gray-600 text-lg">
                Bem-vindo ao seu painel de controle. Gerencie seus projetos de forma inteligente.
              </p>
            </div>
            <button
              onClick={forceRefresh}
              className="text-blue-600 hover:text-blue-700 p-2 rounded-lg hover:bg-blue-50 transition-colors"
              title="Atualizar dados"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        </div>

        {/* Cards de estatísticas */}
        <StatsCards stats={stats} />

        {/* Ações rápidas melhoradas */}
        <EnhancedQuickActions />

        {/* Grade de projetos recentes com animações */}
        {projects.length > 0 ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Projetos Recentes</h2>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500">
                  Última atualização: {new Date().toLocaleTimeString('pt-BR', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </span>
                <button 
                  onClick={() => navigate('/projetos')}
                  className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  Ver todos os {projects.length} projetos →
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {projects.slice(0, 8).map((project, index) => (
                <div
                  key={project.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <AnimatedProjectCard
                    project={project}
                    onClick={() => handleProjectClick(project.id)}
                  />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-16 animate-fade-in">
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
              <button 
                onClick={() => navigate('/upload')}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-2 mx-auto"
              >
                <Plus className="h-4 w-4" />
                <span>Enviar Primeiro Projeto</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Dashboard;
