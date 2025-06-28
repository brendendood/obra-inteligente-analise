
import { FinancialInsightsCard } from './metrics/FinancialInsightsCard';
import { PerformanceMetricsCard } from './metrics/PerformanceMetricsCard';
import { PredictiveAnalyticsCard } from './metrics/PredictiveAnalyticsCard';
import { QualityMetricsCard } from './metrics/QualityMetricsCard';

interface DashboardStatsGridProps {
  stats: any;
  avgCostPerSqm: number | null;
  avgProjectDuration: number | null;
  riskLevel: 'Baixo' | 'Médio' | 'Alto';
  advancedMetrics: {
    financial: {
      totalInvestment: number;
      avgCostPerSqm: number | null;
      costVariation: number | null;
      budgetEfficiency: number | null;
      highestCostProject: { name: string; cost: number } | null;
      lowestCostProject: { name: string; cost: number } | null;
    };
    performance: {
      avgProcessingTime: number | null;
      processingEfficiency: number;
      avgProjectDuration: number | null;
      onTimeDeliveryRate: number;
      bottleneckPhase: string | null;
    };
    predictive: {
      riskLevel: 'Baixo' | 'Médio' | 'Alto';
      riskFactors: string[];
      upcomingDeadlines: number;
      budgetAlerts: number;
      qualityScore: number;
    };
    quality: {
      completionRate: number;
      dataQualityScore: number;
      revisionRate: number;
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
        Análise Inteligente dos Projetos
      </h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full px-2 sm:px-0">
        {/* Métricas Financeiras */}
        <FinancialInsightsCard financial={advancedMetrics.financial} />
        
        {/* Métricas de Performance */}
        <PerformanceMetricsCard performance={advancedMetrics.performance} />
        
        {/* Análise Preditiva */}
        <PredictiveAnalyticsCard predictive={advancedMetrics.predictive} />
        
        {/* Qualidade dos Dados */}
        <QualityMetricsCard quality={advancedMetrics.quality} />
      </div>
    </div>
  );
};
