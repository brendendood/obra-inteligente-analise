import { memo, useState, useEffect } from 'react';
import { EnhancedBreadcrumb } from '@/components/navigation/EnhancedBreadcrumb';
import { WelcomeSection } from '@/components/dashboard/WelcomeSection';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { EnhancedProjectsSection } from '@/components/dashboard/EnhancedProjectsSection';
import { DashboardStatsGrid } from '@/components/dashboard/DashboardStatsGrid';
import { ProjectDeleteConfirmDialog } from '@/components/projects/ProjectDeleteConfirmDialog';
import { useProjectDeletion } from '@/hooks/useProjectDeletion';
import { useAdvancedDashboardMetrics } from '@/hooks/useAdvancedDashboardMetrics';
import { useDashboardGeolocation } from '@/hooks/useDashboardGeolocation';
import { DashboardMobileHeader } from '@/components/dashboard/DashboardMobileHeader';
import { DashboardTabletHeader } from '@/components/dashboard/DashboardTabletHeader';
import { useIsMobile } from '@/hooks/use-mobile';
interface OptimizedDashboardProps {
  userName: string;
  projects: any[];
  isLoadingProjects: boolean;
  error?: string | null;
  onRetry?: () => void;
}
const OptimizedDashboard = memo(({
  userName,
  projects,
  isLoadingProjects,
  error,
  onRetry
}: OptimizedDashboardProps) => {
  // Hook para capturar geolocalização apenas no painel
  useDashboardGeolocation();
  
  // Hook para detectar mobile
  const isMobile = useIsMobile();
  
  // Detectar tablet (telas entre 768px e 1024px)
  const [isTablet, setIsTablet] = useState(false);
  
  // Estado para menu mobile
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Detectar tablet na montagem do componente
  useEffect(() => {
    const checkTablet = () => {
      const width = window.innerWidth;
      setIsTablet(width >= 768 && width <= 1024);
    };
    
    checkTablet();
    window.addEventListener('resize', checkTablet);
    return () => window.removeEventListener('resize', checkTablet);
  }, []);

  // Hook para gerenciar exclusão de projetos
  const {
    projectToDelete,
    isDeleting,
    confirmDelete,
    cancelDelete,
    executeDelete
  } = useProjectDeletion();

  // Métricas avançadas baseadas nos projetos
  const advancedMetrics = useAdvancedDashboardMetrics(projects);
  return (
    <div className="flex flex-col space-y-8 w-full max-w-7xl mx-auto px-6 py-2" style={{ paddingLeft: '23px', paddingRight: '23px' }}>
      {/* Header Mobile com botão de menu */}
      {isMobile && (
        <DashboardMobileHeader 
          isMenuOpen={isMobileMenuOpen}
          onToggleMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        />
      )}
      
      {/* Header Tablet */}
      {isTablet && (
        <DashboardTabletHeader userName={userName} />
      )}
      
      {/* Breadcrumb Section */}
      <div className="w-full mb-6">
        <EnhancedBreadcrumb />
      </div>

      {/* Welcome Section com frases de arquitetos e sistema de indicação */}
      <WelcomeSection userName={userName} onRefresh={onRetry} isLoading={isLoadingProjects} />

      {/* Content Sections */}
      <div className="w-full space-y-8">
        {/* 1. Ações Rápidas */}
        <QuickActions />
        
        {/* 2. Hub de Projetos */}
        <EnhancedProjectsSection projects={projects} isLoading={isLoadingProjects} onDeleteProject={confirmDelete} />
        
        {/* 3. Métricas Avançadas */}
        <DashboardStatsGrid advancedMetrics={advancedMetrics} />
      </div>

      {/* Dialog de Confirmação de Exclusão */}
      <ProjectDeleteConfirmDialog project={projectToDelete} isOpen={!!projectToDelete} isDeleting={isDeleting} onConfirm={executeDelete} onCancel={cancelDelete} />
    </div>
  );
});
OptimizedDashboard.displayName = 'OptimizedDashboard';
export { OptimizedDashboard };