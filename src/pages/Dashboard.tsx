
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { AppLayout } from '@/components/layout/AppLayout';
import { WelcomeSection } from '@/components/dashboard/WelcomeSection';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { RecentProjects } from '@/components/dashboard/RecentProjects';
import { EmptyState } from '@/components/dashboard/EmptyState';
import { DeleteAllDialog } from '@/components/dashboard/DeleteAllDialog';
import { useDashboardData } from '@/hooks/useDashboardData';

const Dashboard = () => {
  const { isAuthenticated, user, loading } = useAuth();
  const [showDeleteAll, setShowDeleteAll] = useState(false);
  const navigate = useNavigate();
  
  const {
    projects,
    stats,
    isLoadingProjects,
    loadProjects,
    handleDeleteAllProjects
  } = useDashboardData();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, loading, navigate]);

  useEffect(() => {
    if (isAuthenticated) {
      loadProjects();
    }
  }, [isAuthenticated]);

  const handleDeleteAll = () => {
    setShowDeleteAll(true);
  };

  const handleConfirmDelete = async () => {
    await handleDeleteAllProjects();
    setShowDeleteAll(false);
  };

  if (loading || isLoadingProjects) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Usuário';

  return (
    <AppLayout>
      <div className="space-y-8">
        <WelcomeSection 
          userName={userName}
          hasProjects={projects.length > 0}
          onDeleteAll={handleDeleteAll}
        />

        <StatsCards stats={stats} />

        <QuickActions />

        {projects.length > 0 ? (
          <RecentProjects projects={projects} />
        ) : (
          <EmptyState />
        )}

        <DeleteAllDialog
          open={showDeleteAll}
          onOpenChange={setShowDeleteAll}
          onConfirm={handleConfirmDelete}
        />
      </div>
    </AppLayout>
  );
};

export default Dashboard;
