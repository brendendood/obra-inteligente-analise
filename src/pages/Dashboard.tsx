
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
import { useProjectStateManager } from '@/hooks/useProjectStateManager';
import { useProjectStore } from '@/stores/projectStore';

const Dashboard = () => {
  const { isAuthenticated, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { preferences, addRecentProject } = useUserPreferences();
  
  // Estado do Zustand
  const { projects, isLoading: isLoadingProjects, fetchProjects } = useProjectStore();
  
  // Usar o novo hook para gerenciamento de estado
  const { validateCurrentProject } = useProjectStateManager({
    autoLoadFromUrl: false, // Dashboard não precisa carregar projeto específico
    validateOnMount: true
  });
  
  const {
    stats,
    forceRefresh
  } = useDashboardData();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login');
      return;
    }
  }, [isAuthenticated, authLoading, navigate]);

  // Carregar projetos do Zustand quando dashboard carregar 
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      console.log('🏠 DASHBOARD: Inicializando carregamento de projetos...');
      fetchProjects();
    }
  }, [isAuthenticated, authLoading, fetchProjects]);

  // Validar projeto atual quando dashboard carregar
  useEffect(() => {
    if (!isLoadingProjects && projects.length > 0) {
      validateCurrentProject();
    }
  }, [isLoadingProjects, projects.length, validateCurrentProject]);

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
        
        {/* Header clean e minimalista */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8 w-full">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 truncate">
                {greeting}, {userName}
              </h1>
              <p className="text-base sm:text-lg text-gray-600">
                Gerencie seus projetos de construção com IA
              </p>
            </div>
            {!isLoadingProjects && (
              <button
                onClick={forceRefresh}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium flex-shrink-0"
              >
                Atualizar
              </button>
            )}
          </div>
        </div>

        {/* Conteúdo principal - Layout vertical linear */}
        <div className="w-full">
          <DashboardContent
            stats={stats}
            projects={projects} // Passando os projetos do Zustand
            isDataLoading={isLoadingProjects}
          />
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
