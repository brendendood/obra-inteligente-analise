
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { AppLayout } from '@/components/layout/AppLayout';
import { useDashboardData } from '@/hooks/useDashboardData';
import { EnhancedBreadcrumb } from '@/components/navigation/EnhancedBreadcrumb';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import { SmartLoading } from '@/components/ui/smart-loading';
import DashboardLoadingState from '@/components/dashboard/DashboardLoadingState';
import DashboardContent from '@/components/dashboard/DashboardContent';

const Dashboard = () => {
  const { isAuthenticated, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { preferences, addRecentProject } = useUserPreferences();
  
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
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <EnhancedBreadcrumb />
          <SmartLoading 
            isLoading={isLoadingProjects} 
            hasData={projects.length > 0}
            successText={`${projects.length} projetos carregados`}
            loadingText="Carregando projetos..."
          />
        </div>
        
        {/* Header clean e minimalista */}
        <div className="bg-white border border-gray-200 rounded-xl p-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {greeting}, {userName}
              </h1>
              <p className="text-lg text-gray-600">
                Gerencie seus projetos de construção com IA
              </p>
            </div>
            {!isLoadingProjects && (
              <button
                onClick={forceRefresh}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Atualizar
              </button>
            )}
          </div>
        </div>

        {/* Conteúdo principal */}
        <DashboardContent
          stats={stats}
          projects={projects}
          isDataLoading={isLoadingProjects}
        />
      </div>
    </AppLayout>
  );
};

export default Dashboard;
