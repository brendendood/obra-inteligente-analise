
import { EnhancedSkeleton } from '@/components/ui/enhanced-skeleton';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { EnhancedQuickActions } from '@/components/dashboard/EnhancedQuickActions';
import DashboardRecentProjects from '@/components/dashboard/DashboardRecentProjects';
import { InsightsDashboard } from '@/components/dashboard/InsightsDashboard';
import { RecentActivity } from '@/components/dashboard/RecentActivity';

interface DashboardContentProps {
  stats: any;
  projects: any[];
  isDataLoading: boolean;
}

const DashboardContent = ({ stats, projects, isDataLoading }: DashboardContentProps) => {
  if (isDataLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <EnhancedSkeleton variant="text" className="h-8 w-48" />
          <EnhancedSkeleton variant="text" className="h-5 w-32" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <EnhancedSkeleton key={i} variant="card" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-none">
      {/* Cards de estatísticas principais */}
      <StatsCards stats={stats} />

      {/* Dashboard com apenas resumo de atividade (sem duplicação) */}
      <InsightsDashboard stats={stats} />

      {/* Layout em grid para melhor aproveitamento do espaço */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Coluna principal - projetos recentes (2/3 do espaço) */}
        <div className="xl:col-span-2">
          <DashboardRecentProjects projects={projects} isLoading={isDataLoading} />
        </div>
        
        {/* Coluna lateral - atividade recente (1/3 do espaço) */}
        <div className="xl:col-span-1">
          <div className="space-y-6">
            <RecentActivity projects={projects} />
            
            {/* Ações rápidas movidas para a coluna lateral */}
            <EnhancedQuickActions />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;
