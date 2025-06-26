
import { EnhancedSkeleton } from '@/components/ui/enhanced-skeleton';
import { StatsCards } from '@/components/dashboard/StatsCards';
import DashboardRecentProjects from '@/components/dashboard/DashboardRecentProjects';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { SidebarQuickActions } from '@/components/dashboard/SidebarQuickActions';

interface DashboardContentProps {
  stats: any;
  projects: any[];
  isDataLoading: boolean;
}

const DashboardContent = ({ stats, projects, isDataLoading }: DashboardContentProps) => {
  if (isDataLoading) {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <EnhancedSkeleton key={i} variant="card" className="h-32" />
          ))}
        </div>
        <EnhancedSkeleton variant="card" className="h-96" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Cards de estatísticas principais */}
      <StatsCards stats={stats} />

      {/* Layout principal com duas colunas */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Coluna principal - projetos recentes */}
        <div className="flex-1 lg:w-3/4">
          <DashboardRecentProjects projects={projects} isLoading={isDataLoading} />
        </div>
        
        {/* Coluna lateral */}
        <div className="lg:w-1/4 min-w-[300px] flex flex-col gap-6">
          {/* Atividade Recente */}
          <div className="flex-1 min-h-[400px]">
            <RecentActivity projects={projects} />
          </div>
          
          {/* Ações Rápidas */}
          <div className="flex-shrink-0">
            <SidebarQuickActions />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;
