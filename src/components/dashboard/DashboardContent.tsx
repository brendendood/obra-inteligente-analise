
import { QuickActions } from './QuickActions';
import { DashboardStatsGrid } from './DashboardStatsGrid';
import { EnhancedProjectsSection } from './EnhancedProjectsSection';
import { ProjectDeleteConfirmDialog } from '@/components/projects/ProjectDeleteConfirmDialog';
import { useProjectDeletion } from '@/hooks/useProjectDeletion';
import { useAdvancedDashboardMetrics } from '@/hooks/useAdvancedDashboardMetrics';

interface DashboardContentProps {
  projects: any[];
  isDataLoading: boolean;
  error?: string | null;
  onRetry?: () => void;
}

const DashboardContent = ({ 
  projects, 
  isDataLoading,
  error,
  onRetry 
}: DashboardContentProps) => {
  // Usar apenas os dados recebidos por props - SEM fazer novas requisições ao store
  
  // Hook para gerenciar exclusão
  const {
    projectToDelete,
    isDeleting,
    confirmDelete,
    cancelDelete,
    executeDelete,
  } = useProjectDeletion();

  // Métricas avançadas completas baseadas nos projetos do usuário
  const advancedMetrics = useAdvancedDashboardMetrics(projects);

  // Não fazer auto-clear de erro para evitar loops

  return (
    <div className="flex flex-col space-y-6 w-full min-w-0">
      {/* 1. AÇÕES RÁPIDAS - Agora com migração integrada */}
      <div className="w-full">
        <QuickActions />
      </div>
      
      {/* 2. HUB DE PROJETOS - Segundo lugar */}
      <div className="w-full">
        <EnhancedProjectsSection
          projects={projects}
          isLoading={isDataLoading}
          onDeleteProject={confirmDelete}
        />
      </div>
      
      {/* 3. MÉTRICAS AVANÇADAS - Terceiro lugar */}
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
};

export default DashboardContent;
