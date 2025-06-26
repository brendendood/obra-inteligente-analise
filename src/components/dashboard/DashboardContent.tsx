
import { EnhancedSkeleton } from '@/components/ui/enhanced-skeleton';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { EnhancedQuickActions } from '@/components/dashboard/EnhancedQuickActions';
import DashboardRecentProjects from '@/components/dashboard/DashboardRecentProjects';
import { InsightsDashboard } from '@/components/dashboard/InsightsDashboard';

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
    <div className="space-y-8">
      {/* Cards de estatísticas principais */}
      <StatsCards stats={stats} />

      {/* Dashboard expandido com insights */}
      <InsightsDashboard stats={stats} />

      {/* Ações rápidas melhoradas */}
      <EnhancedQuickActions />

      {/* Grade de projetos recentes */}
      <DashboardRecentProjects projects={projects} isLoading={isDataLoading} />
    </div>
  );
};

export default DashboardContent;
