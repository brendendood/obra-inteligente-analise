
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
    <div className="space-y-6 max-w-none">
      {/* Cards de estatísticas principais */}
      <StatsCards stats={stats} />

      {/* Dashboard com resumo de insights */}
      <InsightsDashboard stats={stats} />

      {/* Layout principal - duas colunas com melhor distribuição */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Coluna principal - projetos recentes (3/4 do espaço) */}
        <div className="lg:col-span-3">
          <DashboardRecentProjects projects={projects} isLoading={isDataLoading} />
        </div>
        
        {/* Coluna lateral - atividade e ações (1/4 do espaço, mas melhor aproveitado) */}
        <div className="lg:col-span-1 space-y-6 flex flex-col">
          <div className="flex-1">
            <RecentActivity projects={projects} />
          </div>
          <div className="flex-shrink-0">
            <EnhancedQuickActions />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;
