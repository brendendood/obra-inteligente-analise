import { memo } from 'react';
import { EnhancedBreadcrumb } from '@/components/navigation/EnhancedBreadcrumb';
import { SmartGreeting } from '@/components/dashboard/SmartGreeting';
import { ArchitectQuote } from '@/components/dashboard/ArchitectQuote';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { EnhancedProjectsSection } from '@/components/dashboard/EnhancedProjectsSection';
import { DashboardStatsGrid } from '@/components/dashboard/DashboardStatsGrid';

import { ProjectDeleteConfirmDialog } from '@/components/projects/ProjectDeleteConfirmDialog';
import { useProjectDeletion } from '@/hooks/useProjectDeletion';
import { useAdvancedDashboardMetrics } from '@/hooks/useAdvancedDashboardMetrics';
import { useDashboardGeolocation } from '@/hooks/useDashboardGeolocation';

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
  
  // Hook para gerenciar exclusão de projetos
  const {
    projectToDelete,
    isDeleting,
    confirmDelete,
    cancelDelete,
    executeDelete,
  } = useProjectDeletion();

  // Métricas avançadas baseadas nos projetos
  const advancedMetrics = useAdvancedDashboardMetrics(projects);

  return (
    <div className="flex flex-col space-y-6 w-full min-w-0 p-4 sm:p-6">
      {/* Header - Simples */}
      <div className="w-full">
        <EnhancedBreadcrumb />
      </div>
      
      {/* Greeting + Quote - Layout Horizontal */}
      <div className="w-full space-y-3">
        <SmartGreeting userName={userName} />
        <ArchitectQuote />
      </div>

      {/* Ações Rápidas */}
      <QuickActions />
      
      {/* Hub de Projetos */}
      <EnhancedProjectsSection
        projects={projects}
        isLoading={isLoadingProjects}
        onDeleteProject={confirmDelete}
      />
      
      {/* Métricas Avançadas */}
      <DashboardStatsGrid 
        advancedMetrics={advancedMetrics}
      />

      {/* Dialog de Confirmação de Exclusão */}
      <ProjectDeleteConfirmDialog
        project={projectToDelete}
        isOpen={!!projectToDelete}
        isDeleting={isDeleting}
        onConfirm={executeDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
});

OptimizedDashboard.displayName = 'OptimizedDashboard';

export { OptimizedDashboard };