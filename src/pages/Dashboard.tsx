
import { useEffect, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { AppLayout } from '@/components/layout/AppLayout';
import DashboardLoadingState from '@/components/dashboard/DashboardLoadingState';
import { OptimizedDashboard } from '@/components/dashboard/OptimizedDashboard';
import { useOptimizedProjectStore } from '@/stores/optimizedProjectStore';
import { useImpersonation } from '@/contexts/ImpersonationContext';
import { ImpersonationBanner } from '@/components/admin/ImpersonationBanner';
import { useProjectRealtime } from '@/hooks/useProjectRealtime';
import { useProjectSyncManager } from '@/hooks/useProjectSyncManager';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { ConnectionManager } from '@/components/dashboard/ConnectionManager';

// Memoized components for better performance
const MemoizedOptimizedDashboard = memo(OptimizedDashboard);

const Dashboard = memo(() => {
  const { isAuthenticated, user, loading: authLoading } = useAuth();
  const { isImpersonating, impersonationData } = useImpersonation();
  const navigate = useNavigate();
  
  // Initialize all sync systems
  const { projects, isLoading: isLoadingProjects, error, fetchProjects, forceRefresh } = useOptimizedProjectStore();
  const { isRealtimeConnected } = useProjectRealtime();
  const { isFullyConnected } = useNetworkStatus();
  const { forceSyncAll } = useProjectSyncManager();

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
      console.log('📊 DASHBOARD: Status da conexão:', { isRealtimeConnected, isFullyConnected });
      fetchProjects();
    }
  }, [isAuthenticated, authLoading, user, fetchProjects]);
  
  // Debug log para monitorar estado dos projetos
  useEffect(() => {
    console.log('📈 DASHBOARD: Estado dos projetos atualizado:', {
      projectsCount: projects.length,
      isLoading: isLoadingProjects,
      error,
      isRealtimeConnected,
      isFullyConnected
    });
  }, [projects.length, isLoadingProjects, error, isRealtimeConnected, isFullyConnected]);

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
      {/* Connection Manager - resolve problemas de conexão e projetos não encontrados */}
      <ConnectionManager />
      
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
      </AppLayout>
    </div>
  );
});

Dashboard.displayName = 'Dashboard';

export default Dashboard;
