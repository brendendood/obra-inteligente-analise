
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ReportFilters, ReportData } from '@/types/adminReports';
import { 
  generateChartData, 
  generateEngagementData, 
  generateAIUsageData,
  calculateMetrics,
  generatePredictiveData
} from '@/utils/reportDataProcessors';

export function useReportDataLoader() {
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const loadReportData = async (filters: ReportFilters): Promise<ReportData | null> => {
    try {
      setLoading(true);
      console.log('📊 REPORTS: Carregando dados dos relatórios...');

      // Carregar dados de receita
      const { data: revenueData } = await supabase
        .from('payments')
        .select('amount, created_at, status')
        .gte('created_at', filters.dateRange.from.toISOString())
        .lte('created_at', filters.dateRange.to.toISOString())
        .eq('status', 'completed');

      // Carregar dados de usuários com plan_code
      const { data: usersData } = await supabase
        .from('user_profiles')
        .select(`
          created_at,
          user_id
        `);

      // Carregar dados de IA
      const { data: aiData } = await supabase
        .from('ai_usage_metrics')
        .select('cost_usd, tokens_used, created_at, feature_type')
        .gte('created_at', filters.dateRange.from.toISOString())
        .lte('created_at', filters.dateRange.to.toISOString());

      // Processar dados
      const metrics = calculateMetrics(revenueData || [], usersData || [], aiData || []);

      // Preparar dados para gráficos
      const revenueChart = generateChartData(revenueData || [], 'amount', 'created_at');
      const engagementChart = generateEngagementData(usersData || []);
      const aiUsageChart = generateAIUsageData(aiData || []);

      // Insights preditivos
      const predictiveData = generatePredictiveData(metrics.totalRevenue);

      const reportData: ReportData = {
        ...metrics,
        revenueChart,
        engagementChart,
        aiUsageChart,
        predictiveData,
      };

      console.log('✅ REPORTS: Dados carregados com sucesso');
      return reportData;
    } catch (error) {
      console.error('❌ REPORTS: Erro ao carregar dados:', error);
      toast({
        title: "Erro ao carregar relatórios",
        description: "Não foi possível carregar os dados dos relatórios",
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    loadReportData,
  };
}
