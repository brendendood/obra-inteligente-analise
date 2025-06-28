
import { useEffect } from 'react';
import { QuickActions } from './QuickActions';
import { DashboardStatsGrid } from './DashboardStatsGrid';
import { MonthlyProductivityChart } from './MonthlyProductivityChart';
import { EnhancedProjectsSection } from './EnhancedProjectsSection';
import { ProjectDeleteConfirmDialog } from '@/components/projects/ProjectDeleteConfirmDialog';
import { useProjectStore, useProjectStats } from '@/stores/projectStore';
import { useProjectDeletion } from '@/hooks/useProjectDeletion';
import { useAdvancedDashboardMetrics } from '@/hooks/useAdvancedDashboardMetrics';

interface DashboardContentProps {
  stats: any;
  projects: any[];
  isDataLoading: boolean;
}

const DashboardContent = ({ stats }: DashboardContentProps) => {
  // Usar apenas os dados do Zustand - SEM fazer novas requisições
  const { projects, isLoading, error, clearError } = useProjectStore();
  
  // Estatísticas dos projetos
  const { recentProjects } = useProjectStats();
  
  // Hook para gerenciar exclusão
  const {
    projectToDelete,
    isDeleting,
    confirmDelete,
    cancelDelete,
    executeDelete,
  } = useProjectDeletion();

  // Métricas avançadas completas
  const advancedMetrics = useAdvancedDashboardMetrics(projects);

  // Limpar erro automaticamente
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        clearError();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  return (
    <div className="flex flex-col space-y-8 w-full min-w-0">
      {/* 1. AÇÕES RÁPIDAS - Primeiro lugar */}
      <QuickActions />
      
      {/* 2. HUB DE PROJETOS - Segundo lugar */}
      <div className="w-full">
        <EnhancedProjectsSection
          projects={projects}
          isLoading={isLoading}
          onDeleteProject={confirmDelete}
        />
      </div>
      
      {/* 3. MÉTRICAS AVANÇADAS - Terceiro lugar */}
      <DashboardStatsGrid 
        stats={stats}
        avgCostPerSqm={advancedMetrics.financial.avgCostPerSqm}
        avgProjectDuration={advancedMetrics.performance.avgProjectDuration}
        riskLevel={advancedMetrics.predictive.riskLevel}
        advancedMetrics={advancedMetrics}
      />
      
      {/* 4. GRÁFICO DE PRODUTIVIDADE - Por último */}
      <div className="w-full">
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
};

export default DashboardContent;
