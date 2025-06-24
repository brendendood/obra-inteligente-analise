
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useAdmin } from '@/hooks/useAdmin';
import { useProject } from '@/contexts/ProjectContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import DashboardWelcome from '@/components/dashboard/DashboardWelcome';
import DashboardStats from '@/components/dashboard/DashboardStats';
import CurrentProjectCard from '@/components/dashboard/CurrentProjectCard';
import QuickActionsGrid from '@/components/dashboard/QuickActionsGrid';
import GettingStartedCard from '@/components/dashboard/GettingStartedCard';

const Dashboard = () => {
  const { isAuthenticated, user, loading } = useAuth();
  const { isAdmin } = useAdmin();
  const { currentProject, loadUserProjects } = useProject();
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
      <div className="min-h-screen bg-background dark:bg-[#0d0d0d] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background dark:bg-[#0d0d0d]">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DashboardWelcome user={user!} isAdmin={isAdmin} />
        
        <DashboardStats currentProject={currentProject} />

        {currentProject && (
          <CurrentProjectCard currentProject={currentProject} />
        )}

        <QuickActionsGrid currentProject={currentProject} />

        {!currentProject && <GettingStartedCard />}
      </div>

      <Footer />
    </div>
  );
};

export default Dashboard;
