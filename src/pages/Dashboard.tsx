
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { AppLayout } from '@/components/layout/AppLayout';
import { useDashboardData } from '@/hooks/useDashboardData';
import { EnhancedBreadcrumb } from '@/components/navigation/EnhancedBreadcrumb';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import { SmartLoading } from '@/components/ui/smart-loading';
import DashboardLoadingState from '@/components/dashboard/DashboardLoadingState';
import DashboardWelcomeHeader from '@/components/dashboard/DashboardWelcomeHeader';
import DashboardContent from '@/components/dashboard/DashboardContent';

const Dashboard = () => {
  const { isAuthenticated, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { preferences, addRecentProject } = useUserPreferences();
  const [showContent, setShowContent] = useState(false);
  
  const {
    projects,
    stats,
    isLoadingProjects,
    forceRefresh
  } = useDashboardData();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login');
      return;
    }
    
    // Delay mínimo para evitar flashing
    if (!authLoading && isAuthenticated) {
      const timer = setTimeout(() => {
        setShowContent(true);
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, authLoading, navigate]);

  // Estados de loading mais estáveis
  const isInitialLoading = authLoading || !showContent;
  const isDataLoading = showContent && isAuthenticated && isLoadingProjects;

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
      <div className="space-y-8 animate-fade-in">
        <div className="flex items-center justify-between">
          <EnhancedBreadcrumb />
          <SmartLoading 
            isLoading={isDataLoading} 
            hasData={projects.length > 0}
            successText={`${projects.length} projetos carregados`}
            loadingText="Carregando projetos..."
          />
        </div>
        
        {/* Header com boas-vindas MadenAI */}
        <DashboardWelcomeHeader
          userName={userName}
          greeting={greeting}
          onRefresh={forceRefresh}
          isLoading={isDataLoading}
        />

        {/* Conteúdo principal */}
        <DashboardContent
          stats={stats}
          projects={projects}
          isDataLoading={isDataLoading}
        />
      </div>
    </AppLayout>
  );
};

export default Dashboard;
