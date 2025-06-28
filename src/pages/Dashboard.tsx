
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { AppLayout } from '@/components/layout/AppLayout';
import { useDashboardData } from '@/hooks/useDashboardData';
import { EnhancedBreadcrumb } from '@/components/navigation/EnhancedBreadcrumb';
import { SmartLoading } from '@/components/ui/smart-loading';
import DashboardLoadingState from '@/components/dashboard/DashboardLoadingState';
import DashboardContent from '@/components/dashboard/DashboardContent';
import { useProjectStore } from '@/stores/projectStore';
import { SmartGreeting } from '@/components/dashboard/SmartGreeting';

const Dashboard = () => {
  const { isAuthenticated, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  // ÚNICO ponto de carregamento de projetos - apenas o Zustand store
  const { projects, isLoading: isLoadingProjects } = useProjectStore();
  
  const { stats } = useDashboardData();

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

  return (
    <AppLayout>
      <div className="flex flex-col space-y-8 w-full min-w-0">
        <div className="flex items-center justify-between">
          <EnhancedBreadcrumb />
          <SmartLoading 
            isLoading={isLoadingProjects} 
            hasData={projects.length > 0}
            successText={`${projects.length} projetos carregados`}
            loadingText="Carregando projetos..."
          />
        </div>
        
        {/* Header clean e minimalista com saudação inteligente */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8 w-full">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="min-w-0 flex-1">
              <SmartGreeting userName={userName} />
              <p className="text-base sm:text-lg text-gray-600">
                Gerencie seus projetos de construção com IA
              </p>
            </div>
          </div>
        </div>

        {/* Conteúdo principal - Layout vertical linear */}
        <div className="w-full">
          <DashboardContent
            stats={stats}
            projects={projects}
            isDataLoading={isLoadingProjects}
          />
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
