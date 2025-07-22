
import { useEffect, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { AppLayout } from '@/components/layout/AppLayout';
import { useDashboardData } from '@/hooks/useDashboardData';
import { EnhancedBreadcrumb } from '@/components/navigation/EnhancedBreadcrumb';
import DashboardLoadingState from '@/components/dashboard/DashboardLoadingState';
import DashboardContent from '@/components/dashboard/DashboardContent';
import { useOptimizedProjectStore } from '@/stores/optimizedProjectStore';
import { SmartGreeting } from '@/components/dashboard/SmartGreeting';

// Memoized components for better performance
const MemoizedBreadcrumb = memo(EnhancedBreadcrumb);
const MemoizedGreeting = memo(SmartGreeting);
const MemoizedDashboardContent = memo(DashboardContent);

const Dashboard = memo(() => {
  const { isAuthenticated, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  // Use optimized store
  const { projects, isLoading: isLoadingProjects, fetchProjects } = useOptimizedProjectStore();
  const { stats } = useDashboardData();

  // Handle authentication redirect
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, authLoading, navigate]);

  // Optimized project fetching
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      console.log('🎯 DASHBOARD: Loading projects with optimized cache...');
      fetchProjects();
    }
  }, [isAuthenticated, authLoading, fetchProjects]);

  // Early returns for performance
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
        {/* Header com Logo */}
        <div className="relative bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/20 border border-gray-200 rounded-xl p-6 sm:p-8 w-full overflow-hidden">
          {/* Background decorativo */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-100/30 to-indigo-100/20 rounded-full blur-3xl -translate-y-32 translate-x-32"></div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between w-full mb-8">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center p-3 shadow-lg shadow-blue-600/25 mr-4">
                  <Zap className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    MadenAI
                  </h1>
                  <p className="text-sm text-gray-600 font-medium">
                    Inteligência Artificial para Construção
                  </p>
                </div>
              </div>
              <MemoizedBreadcrumb />
            </div>
            
            <div className="min-w-0 flex-1">
              <MemoizedGreeting userName={userName} />
              <p className="text-base sm:text-lg text-gray-600 mt-2">
                Gerencie seus projetos de construção com IA
              </p>
            </div>
          </div>
        </div>

        {/* Memoized content */}
        <div className="w-full">
          <MemoizedDashboardContent
            stats={stats}
            projects={projects}
            isDataLoading={isLoadingProjects}
          />
        </div>
      </div>
    </AppLayout>
  );
});

Dashboard.displayName = 'Dashboard';

export default Dashboard;
