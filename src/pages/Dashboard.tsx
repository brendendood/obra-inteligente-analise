
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { AppLayout } from '@/components/layout/AppLayout';
import { useDashboardData } from '@/hooks/useDashboardData';
import { EnhancedBreadcrumb } from '@/components/navigation/EnhancedBreadcrumb';
import DashboardLoadingState from '@/components/dashboard/DashboardLoadingState';
import DashboardContent from '@/components/dashboard/DashboardContent';
import { useProjectStore } from '@/stores/projectStore';
import { SmartGreeting } from '@/components/dashboard/SmartGreeting';

const Dashboard = () => {
  const { isAuthenticated, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  // CACHE INTELIGENTE: Usa o store otimizado
  const { projects, isLoading: isLoadingProjects, fetchProjects } = useProjectStore();
  const { stats } = useDashboardData();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login');
      return;
    }
  }, [isAuthenticated, authLoading, navigate]);

  // CARREGAMENTO INTELIGENTE: Só carrega se necessário
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      console.log('🎯 DASHBOARD: Usuário autenticado, iniciando carga inteligente...');
      fetchProjects(); // Cache inteligente não fará chamada desnecessária
    }
  }, [isAuthenticated, authLoading, fetchProjects]);

  // Loading state simplificado
  if (authLoading) {
    return <DashboardLoadingState />;
  }

  if (!isAuthenticated) {
    return null;
  }

  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Usuário';

  return (
    <AppLayout>
      <div className="flex flex-col space-y-6 w-full min-w-0 max-w-7xl mx-auto">
        {/* Header com breadcrumb */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 sm:p-8 w-full">
          <div className="flex items-center justify-between w-full mb-6">
            <EnhancedBreadcrumb />
          </div>
          
          <div className="min-w-0 flex-1">
            <SmartGreeting userName={userName} />
            <p className="text-base sm:text-lg text-gray-600">
              Gerencie seus projetos de construção com IA
            </p>
          </div>
        </div>

        {/* Conteúdo principal */}
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
