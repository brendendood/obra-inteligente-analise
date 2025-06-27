
import { useEffect } from 'react';
import { QuickActions } from './QuickActions';
import { StatsCards } from './StatsCards';
import { AdvancedStatsCards } from './AdvancedStatsCards';
import { MonthlyProductivityChart } from './MonthlyProductivityChart';
import { EnhancedProjectsSection } from './EnhancedProjectsSection';
import { ProjectDeleteConfirmDialog } from '@/components/projects/ProjectDeleteConfirmDialog';
import { useProjectStore, useProjectStats } from '@/stores/projectStore';
import { useProjectDeletion } from '@/hooks/useProjectDeletion';
import { useAdvancedDashboardMetrics } from '@/hooks/useAdvancedDashboardMetrics';

interface DashboardContentProps {
  stats: any;
  projects: any[]; // Mantido para compatibilidade, mas não usado
  isDataLoading: boolean; // Mantido para compatibilidade, mas não usado
}

const DashboardContent = ({ stats }: DashboardContentProps) => {
  // Estado do Zustand
  const { 
    projects, 
    isLoading, 
    error, 
    fetchProjects, 
    forceRefresh,
    clearError 
  } = useProjectStore();
  
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

  // Métricas avançadas
  const {
    avgCostPerSqm,
    avgProjectDuration,
    riskLevel,
    monthlyProductivity
  } = useAdvancedDashboardMetrics(projects);

  // Carregar projetos quando o dashboard carregar
  useEffect(() => {
    console.log('🏠 DASHBOARD: Carregando projetos...');
    fetchProjects();
  }, [fetchProjects]);

  // Limpar erro automaticamente
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        clearError();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  const handleRefresh = async () => {
    console.log('🔄 DASHBOARD: Atualizando projetos...');
    await forceRefresh();
  };

  return (
    <div className="flex flex-col space-y-8 w-full min-w-0">
      {/* Stats Cards Originais */}
      <StatsCards stats={stats} />
      
      {/* Novos Cards de Métricas Avançadas */}
      <AdvancedStatsCards 
        avgCostPerSqm={avgCostPerSqm}
        avgProjectDuration={avgProjectDuration}
        riskLevel={riskLevel}
      />
      
      {/* Quick Actions Refinadas */}
      <QuickActions />
      
      {/* Hub de Projetos Centralizado - Largura Total */}
      <div className="w-full">
        <EnhancedProjectsSection
          projects={projects}
          isLoading={isLoading}
          onDeleteProject={confirmDelete}
        />
      </div>
      
      {/* Gráfico de Produtividade - Largura Total */}
      <div className="w-full">
        <MonthlyProductivityChart data={monthlyProductivity} />
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
