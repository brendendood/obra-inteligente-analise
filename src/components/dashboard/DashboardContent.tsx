
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
    <div className="space-y-6 max-w-none min-h-screen">
      {/* Cards de estatísticas principais */}
      <StatsCards stats={stats} />

      {/* Dashboard com resumo de insights */}
      <InsightsDashboard stats={stats} />

      {/* Layout principal com duas colunas */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Coluna principal - projetos recentes e seções adicionais */}
        <div className="flex-1 lg:w-3/4 space-y-6">
          {/* Projetos Recentes */}
          <DashboardRecentProjects projects={projects} isLoading={isDataLoading} />
          
          {/* Gráfico de Progresso dos Projetos */}
          <ProjectProgressChart projects={projects} />
          
          {/* Grid com duas seções lado a lado */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ProjectTypesDistribution stats={stats} />
            <AIInsights projects={projects} />
          </div>
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
          
          {/* Dicas MadenAI */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Dicas MadenAI</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <span className="text-blue-600">💡</span>
                <p className="text-sm text-gray-700">Use a IA para analisar seus projetos automaticamente</p>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-green-600">📊</span>
                <p className="text-sm text-gray-700">Acompanhe estatísticas em tempo real</p>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-purple-600">⚡</span>
                <p className="text-sm text-gray-700">Gere orçamentos precisos em segundos</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;
