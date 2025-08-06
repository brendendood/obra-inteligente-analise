
import { FinancialInsightsCard } from './metrics/FinancialInsightsCard';
import { ProjectMetricsCard } from './metrics/ProjectMetricsCard';
import { ProjectStatusCard } from './metrics/ProjectStatusCard';

interface DashboardStatsGridProps {
  advancedMetrics: {
    financial: {
      totalInvestment: number;
      avgCostPerSqm: number | null;
    };
    projectMetrics: {
      totalArea: number;
      avgCostPerProject: number | null;
      projectCount: number;
    };
    projectStatus: {
      projectsWithBudget: number;
      lastSubmissionDate: string | null;
      totalProjects: number;
    };
  };
}

export const DashboardStatsGrid = ({ 
  advancedMetrics
}: DashboardStatsGridProps) => {
  return (
    <div className="w-full min-w-0">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 px-2 sm:px-0">
        Análise dos Projetos
      </h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full px-1 sm:px-0">
        {/* Métricas Financeiras */}
        <FinancialInsightsCard financial={advancedMetrics.financial} />
        
        {/* Métricas dos Projetos */}
        <ProjectMetricsCard projectMetrics={advancedMetrics.projectMetrics} />
        
        {/* Status dos Projetos */}
        <ProjectStatusCard projectStatus={advancedMetrics.projectStatus} />
      </div>
    </div>
  );
};
