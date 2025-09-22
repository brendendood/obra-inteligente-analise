
import { useEffect, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { AppLayout } from '@/components/layout/AppLayout';
import DashboardLoadingState from '@/components/dashboard/DashboardLoadingState';
import { OptimizedDashboard } from '@/components/dashboard/OptimizedDashboard';
import { useUnifiedProjectStore } from '@/stores/unifiedProjectStore';
import { useImpersonation } from '@/contexts/ImpersonationContext';
import { ImpersonationBanner } from '@/components/admin/ImpersonationBanner';
import { useUnifiedProjectRealtime } from '@/hooks/useUnifiedProjectRealtime';
import ProjectList from '@/components/ui/project-list';

// Memoized components for better performance
const MemoizedOptimizedDashboard = memo(OptimizedDashboard);

const Dashboard = memo(() => {
  const { isAuthenticated, user, loading: authLoading } = useAuth();
  const { isImpersonating, impersonationData } = useImpersonation();
  const navigate = useNavigate();
  
  // Initialize project store
  const { projects, isLoading: isLoadingProjects, error, fetchProjects, forceRefresh } = useUnifiedProjectStore();
  const { isRealtimeConnected } = useUnifiedProjectRealtime();

  // Handle authentication redirect
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, authLoading, navigate]);

  // Auto-fetch projects when user is authenticated
  useEffect(() => {
    if (isAuthenticated && !authLoading && user) {
      console.log('🚀 DASHBOARD: Usuário autenticado, carregando projetos...');
      fetchProjects();
    }
  }, [isAuthenticated, authLoading, user, fetchProjects]);
  
  // Debug log para monitorar estado dos projetos
  useEffect(() => {
    console.log('📈 DASHBOARD: Estado dos projetos atualizado:', {
      projectsCount: projects.length,
      isLoading: isLoadingProjects,
      error,
      isRealtimeConnected
    });
  }, [projects.length, isLoadingProjects, error, isRealtimeConnected]);

  // Early returns for performance
  if (authLoading) {
    return <DashboardLoadingState />;
  }

  if (!isAuthenticated) {
    return null;
  }

  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Usuário';

  return (
    <div className="min-h-screen">
      {/* Impersonation Banner */}
      {isImpersonating && impersonationData && (
        <ImpersonationBanner
          impersonatedUser={{
            id: impersonationData.targetUser.id,
            name: impersonationData.targetUser.name,
            email: impersonationData.targetUser.email,
          }}
          sessionId={impersonationData.sessionId}
          adminId={impersonationData.adminId}
        />
      )}
      
      <AppLayout>
        <MemoizedOptimizedDashboard
          userName={userName}
          projects={projects}
          isLoadingProjects={isLoadingProjects}
          error={error}
          onRetry={forceRefresh}
        />
        <div className="mt-8">
          <ProjectList />
        </div>
      </AppLayout>
    </div>
  );
});

Dashboard.displayName = 'Dashboard';

export default Dashboard;
