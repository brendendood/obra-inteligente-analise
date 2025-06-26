
import { EnhancedSkeleton } from '@/components/ui/enhanced-skeleton';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { EnhancedQuickActions } from '@/components/dashboard/EnhancedQuickActions';
import DashboardRecentProjects from '@/components/dashboard/DashboardRecentProjects';
import { InsightsDashboard } from '@/components/dashboard/InsightsDashboard';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { SidebarQuickActions } from '@/components/dashboard/SidebarQuickActions';
import { ProjectProgressChart } from '@/components/dashboard/ProjectProgressChart';
import { ProjectTypesDistribution } from '@/components/dashboard/ProjectTypesDistribution';
import { AIInsights } from '@/components/dashboard/AIInsights';

interface DashboardContentProps {
  stats: any;
  projects: any[];
  isDataLoading: boolean;
}

const DashboardContent = ({
  stats,
  projects,
  isDataLoading
}: DashboardContentProps) => {
  if (isDataLoading) {
    return (
      <div className="space-y-4 sm:space-y-6 px-2 sm:px-4 lg:px-0">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <EnhancedSkeleton variant="text" className="h-6 sm:h-8 w-full sm:w-48" />
          <EnhancedSkeleton variant="text" className="h-4 sm:h-5 w-full sm:w-32" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {[...Array(8)].map((_, i) => (
            <EnhancedSkeleton key={i} variant="card" className="h-32 sm:h-40" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8 max-w-none min-h-screen py-0 px-2 sm:px-4 lg:px-0">
      {/* Cards de estatísticas principais */}
      <div className="w-full">
        <StatsCards stats={stats} />
      </div>

      {/* Dashboard com resumo de insights */}
      <div className="w-full">
        <InsightsDashboard stats={stats} />
      </div>

      {/* Layout principal com duas colunas responsivas */}
      <div className="flex flex-col xl:flex-row gap-4 sm:gap-6 lg:gap-8 w-full">
        {/* Coluna principal - projetos recentes e seções adicionais */}
        <div className="flex-1 w-full xl:w-3/4 space-y-4 sm:space-y-6 lg:space-y-8 min-w-0">
          {/* Projetos Recentes */}
          <div className="w-full">
            <DashboardRecentProjects projects={projects} isLoading={isDataLoading} />
          </div>
          
          {/* Gráfico de Progresso dos Projetos */}
          <div className="w-full">
            <ProjectProgressChart projects={projects} />
          </div>
          
          {/* Grid com duas seções lado a lado - responsivo */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 w-full">
            <div className="min-w-0">
              <ProjectTypesDistribution stats={stats} />
            </div>
            <div className="min-w-0">
              <AIInsights projects={projects} />
            </div>
          </div>
        </div>
        
        {/* Coluna lateral - stack em mobile, sidebar em desktop */}
        <div className="w-full xl:w-1/4 xl:min-w-[280px] xl:max-w-[320px] flex flex-col gap-4 sm:gap-6">
          {/* Ações Rápidas */}
          <div className="flex-shrink-0 w-full">
            <SidebarQuickActions />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;
