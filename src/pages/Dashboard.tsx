
import { useEffect, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { AppLayout } from '@/components/layout/AppLayout';
import { useDashboardData } from '@/hooks/useDashboardData';
import { EnhancedBreadcrumb } from '@/components/navigation/EnhancedBreadcrumb';
import DashboardLoadingState from '@/components/dashboard/DashboardLoadingState';
import DashboardContent from '@/components/dashboard/DashboardContent';
import { useOptimizedProjectStore } from '@/stores/optimizedProjectStore';
import { SmartGreeting } from '@/components/dashboard/SmartGreeting';
import { ArchitectQuote } from '@/components/dashboard/ArchitectQuote';
import { useImpersonation } from '@/contexts/ImpersonationContext';
import { ImpersonationBanner } from '@/components/admin/ImpersonationBanner';
import { useProjectRealtime } from '@/hooks/useProjectRealtime';
import { useProjectSyncManager } from '@/hooks/useProjectSyncManager';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { SyncStatusIndicator } from '@/components/common/SyncStatusIndicator';

// Memoized components for better performance
const MemoizedBreadcrumb = memo(EnhancedBreadcrumb);
const MemoizedGreeting = memo(SmartGreeting);
const MemoizedArchitectQuote = memo(ArchitectQuote);
const MemoizedDashboardContent = memo(DashboardContent);

const Dashboard = memo(() => {
  const { isAuthenticated, user, loading: authLoading } = useAuth();
  const { isImpersonating, impersonationData } = useImpersonation();
  const navigate = useNavigate();
  
  // Initialize all sync systems
  const { projects, isLoading: isLoadingProjects, error, fetchProjects, forceRefresh } = useOptimizedProjectStore();
  const { isRealtimeConnected } = useProjectRealtime();
  const { isFullyConnected } = useNetworkStatus();
  const { forceSyncAll } = useProjectSyncManager();
  const { stats } = useDashboardData();

  // Handle authentication redirect
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login');
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
        <div className="flex flex-col space-y-6 w-full min-w-0 max-w-7xl mx-auto">
          {/* Memoized header */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 sm:p-8 w-full">
            <div className="flex items-center justify-between w-full mb-6">
              <MemoizedBreadcrumb />
              <SyncStatusIndicator />
            </div>
            
            <div className="min-w-0 flex-1">
              <MemoizedGreeting userName={userName} />
              <MemoizedArchitectQuote />
            </div>
          </div>

          {/* Memoized content */}
          <div className="w-full">
            <MemoizedDashboardContent
              stats={stats}
              projects={projects}
              isDataLoading={isLoadingProjects}
              error={error}
              onRetry={forceRefresh}
            />
          </div>
        </div>
      </AppLayout>
    </div>
  );
});

Dashboard.displayName = 'Dashboard';

export default Dashboard;
