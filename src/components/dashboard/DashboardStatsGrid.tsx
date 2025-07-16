
import { FinancialInsightsCard } from './metrics/FinancialInsightsCard';
import { PerformanceMetricsCard } from './metrics/PerformanceMetricsCard';
import { QualityMetricsCard } from './metrics/QualityMetricsCard';

interface DashboardStatsGridProps {
  advancedMetrics: {
    financial: {
      totalInvestment: number;
      avgCostPerSqm: number | null;
    };
    performance: {
      avgProcessingTime: number | null;
      processingEfficiency: number;
      avgProjectDuration: number | null;
    };
    quality: {
      completionRate: number;
      dataQualityScore: number;
      avgAccuracy: number;
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
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full px-2 sm:px-0">
        {/* Métricas Financeiras */}
        <FinancialInsightsCard financial={advancedMetrics.financial} />
        
        {/* Métricas de Performance */}
        <PerformanceMetricsCard performance={advancedMetrics.performance} />
        
        {/* Qualidade dos Dados */}
        <QualityMetricsCard quality={advancedMetrics.quality} />
      </div>
    </div>
  );
};
