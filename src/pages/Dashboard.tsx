
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
import { useImpersonation } from '@/contexts/ImpersonationContext';
import { ImpersonationBanner } from '@/components/admin/ImpersonationBanner';

// Memoized components for better performance
const MemoizedBreadcrumb = memo(EnhancedBreadcrumb);
const MemoizedGreeting = memo(SmartGreeting);
const MemoizedDashboardContent = memo(DashboardContent);

const Dashboard = memo(() => {
  const { isAuthenticated, user, loading: authLoading } = useAuth();
  const { isImpersonating, impersonationData } = useImpersonation();
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
            </div>
            
            <div className="min-w-0 flex-1">
              <MemoizedGreeting userName={userName} />
              <p className="text-base sm:text-lg text-gray-600">
                Gerencie seus projetos de construção com IA
              </p>
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
    </div>
  );
});

Dashboard.displayName = 'Dashboard';

export default Dashboard;
