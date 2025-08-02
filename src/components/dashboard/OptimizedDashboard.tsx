import { memo } from 'react';
import { EnhancedBreadcrumb } from '@/components/navigation/EnhancedBreadcrumb';
import { SmartGreeting } from '@/components/dashboard/SmartGreeting';
import { ArchitectQuote } from '@/components/dashboard/ArchitectQuote';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { EnhancedProjectsSection } from '@/components/dashboard/EnhancedProjectsSection';
import { DashboardStatsGrid } from '@/components/dashboard/DashboardStatsGrid';
import { MonthlyProductivityChart } from '@/components/dashboard/MonthlyProductivityChart';
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
    <div className="flex flex-col space-y-8 w-full min-w-0 max-w-7xl mx-auto p-6">
      {/* Header Section */}
      <div className="bg-card border border-border rounded-apple p-8 w-full">
        <div className="flex items-center justify-between w-full mb-6">
          <EnhancedBreadcrumb />
        </div>
        
        <div className="min-w-0 flex-1">
          <SmartGreeting userName={userName} />
          <ArchitectQuote />
        </div>
      </div>

      {/* Content Sections */}
      <div className="w-full space-y-8">
        {/* 1. Ações Rápidas */}
        <QuickActions />
        
        {/* 2. Hub de Projetos */}
        <EnhancedProjectsSection
          projects={projects}
          isLoading={isLoadingProjects}
          onDeleteProject={confirmDelete}
        />
        
        {/* 3. Métricas Avançadas */}
        <DashboardStatsGrid 
          advancedMetrics={advancedMetrics}
        />
        
        {/* 4. Gráfico de Produtividade */}
        <MonthlyProductivityChart data={advancedMetrics.monthlyTrends} />
      </div>

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