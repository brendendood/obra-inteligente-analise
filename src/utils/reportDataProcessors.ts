
import { ChartDataItem, EngagementDataItem, AIUsageDataItem } from '@/types/adminReports';

export const generateChartData = (data: any[], valueField: string, dateField: string): ChartDataItem[] => {
  const groupedData = data.reduce((acc, item) => {
    const date = new Date(item[dateField]).toLocaleDateString('pt-BR');
    acc[date] = (acc[date] || 0) + Number(item[valueField] || 0);
    return acc;
  }, {});

  return Object.entries(groupedData).map(([date, value]) => ({
    date,
    value: value as number,
  }));
};

export const generateEngagementData = (users: any[]): EngagementDataItem[] => {
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return {
      date: date.toLocaleDateString('pt-BR'),
      activeUsers: Math.floor(Math.random() * 50) + 10,
      newUsers: Math.floor(Math.random() * 15) + 2,
    };
  }).reverse();

  return last30Days;
};

export const generateAIUsageData = (aiData: any[]): AIUsageDataItem[] => {
  const features = ['budget', 'schedule', 'chat', 'analysis'];
  
  return features.map(feature => ({
    feature,
    usage: aiData.filter(d => d.feature_type === feature).length,
    cost: aiData
      .filter(d => d.feature_type === feature)
      .reduce((sum, d) => sum + Number(d.cost_usd || 0), 0),
  }));
};

export const calculateMetrics = (revenueData: any[], usersData: any[], aiData: any[]) => {
  const totalRevenue = (revenueData || []).reduce((sum, payment) => sum + Number(payment.amount), 0);
  const activeUsers = (usersData || []).length;
  const aiCostMonth = (aiData || []).reduce((sum, usage) => sum + Number(usage.cost_usd || 0), 0);
  const aiUsageCount = (aiData || []).length;

  // Calcular crescimento (simulado - seria baseado em período anterior)
  const revenueGrowth = Math.random() * 20 - 10; // -10% a +10%
  const userGrowth = Math.random() * 15; // 0% a +15%

  // Taxa de conversão
  const paidUsers = (usersData || []).filter(u => {
    const subscription = u.user_subscriptions as any;
    return subscription && Array.isArray(subscription) && subscription[0]?.plan !== 'free';
  }).length;
  const conversionRate = activeUsers > 0 ? (paidUsers / activeUsers) * 100 : 0;

  return {
    totalRevenue,
    revenueGrowth,
    activeUsers,
    userGrowth,
    aiCostMonth,
    aiCostTrend: aiCostMonth > 100 ? 'up' as const : 'stable' as const,
    aiUsageCount,
    conversionRate,
  };
};

export const generatePredictiveData = (totalRevenue: number) => ({
  predictedRevenue: totalRevenue * 1.15,
  riskProjects: Math.floor(Math.random() * 5),
  recommendations: [
    'Focar em conversão de usuários gratuitos',
    'Otimizar custos de IA com caching',
    'Implementar alertas de retenção'
  ]
});
