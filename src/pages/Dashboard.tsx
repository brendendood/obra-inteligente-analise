
import { useEffect, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { AppLayout } from '@/components/layout/AppLayout';
import DashboardLoadingState from '@/components/dashboard/DashboardLoadingState';
import DashboardContent from '@/components/dashboard/DashboardContent';
import DashboardWelcomeHeader from '@/components/dashboard/DashboardWelcomeHeader';
import { useDashboardData } from '@/hooks/useDashboardData';
import { useUnifiedProjectStore } from '@/stores/unifiedProjectStore';
import { useImpersonation } from '@/contexts/ImpersonationContext';
import { ImpersonationBanner } from '@/components/admin/ImpersonationBanner';
import { useUnifiedProjectRealtime } from '@/hooks/useUnifiedProjectRealtime';

const MemoizedDashboardContent = memo(DashboardContent);
const MemoizedDashboardWelcomeHeader = memo(DashboardWelcomeHeader);

const Dashboard = memo(() => {
  const { isAuthenticated, user, loading: authLoading } = useAuth();
  const { isImpersonating, impersonationData } = useImpersonation();
  const navigate = useNavigate();
  
  // Initialize dashboard data
  const { projects, stats, isDataLoading, forceRefresh } = useDashboardData();
  const { isRealtimeConnected } = useUnifiedProjectRealtime();

  // Handle authentication redirect
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, authLoading, navigate]);

  // Debug log para monitorar estado dos projetos
  useEffect(() => {
    console.log('📈 DASHBOARD: Estado dos dados atualizado:', {
      projectsCount: projects.length,
      isLoading: isDataLoading,
      isRealtimeConnected
    });
  }, [projects.length, isDataLoading, isRealtimeConnected]);

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
        <div className="space-y-6">
          <MemoizedDashboardWelcomeHeader
            userName={userName}
            greeting={`Bem-vindo, ${userName}!`}
            onRefresh={forceRefresh}
            isLoading={isDataLoading}
          />
          
          <MemoizedDashboardContent
            stats={stats}
            projects={projects}
            isDataLoading={isDataLoading}
            onRetry={forceRefresh}
          />
        </div>
      </AppLayout>
    </div>
  );
});

Dashboard.displayName = 'Dashboard';

export default Dashboard;
