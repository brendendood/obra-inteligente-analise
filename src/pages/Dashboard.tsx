
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useProject } from '@/contexts/ProjectContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import DashboardWelcome from '@/components/dashboard/DashboardWelcome';
import DashboardStats from '@/components/dashboard/DashboardStats';
import ProjectsGrid from '@/components/dashboard/ProjectsGrid';
import QuickActionsGrid from '@/components/dashboard/QuickActionsGrid';
import GettingStartedCard from '@/components/dashboard/GettingStartedCard';

const Dashboard = () => {
  const { isAuthenticated, user, loading } = useAuth();
  const { projects, loadUserProjects } = useProject();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, loading, navigate]);

  useEffect(() => {
    if (isAuthenticated) {
      loadUserProjects();
    }
  }, [isAuthenticated, loadUserProjects]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Carregando...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <DashboardWelcome user={user!} />
        
        <DashboardStats projects={projects} />

        {projects.length > 0 ? (
          <ProjectsGrid projects={projects} />
        ) : (
          <GettingStartedCard />
        )}

        <QuickActionsGrid />
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
