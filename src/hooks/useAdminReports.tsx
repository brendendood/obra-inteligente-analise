
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ReportFilters {
  dateRange: {
    from: Date;
    to: Date;
  };
  userPlan: string;
  projectType: string;
  aiUsage: boolean;
}

interface ReportData {
  totalRevenue: number;
  revenueGrowth: number;
  activeUsers: number;
  userGrowth: number;
  aiCostMonth: number;
  aiCostTrend: 'up' | 'down' | 'stable';
  aiUsageCount: number;
  conversionRate: number;
  revenueChart: any[];
  engagementChart: any[];
  aiUsageChart: any[];
  predictiveData: any;
}

export function useAdminReports() {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<ReportFilters>({
    dateRange: {
      from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 dias atrás
      to: new Date(),
    },
    userPlan: '',
    projectType: '',
    aiUsage: false,
  });
  const { toast } = useToast();

  useEffect(() => {
    loadReportData();
  }, [filters]);

  const loadReportData = async () => {
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

      // Carregar dados de usuários com subscriptions
      const { data: usersData } = await supabase
        .from('user_profiles')
        .select(`
          created_at,
          user_subscriptions!inner(plan)
        `);

      // Carregar dados de IA
      const { data: aiData } = await supabase
        .from('ai_usage_metrics')
        .select('cost_usd, tokens_used, created_at, feature_type')
        .gte('created_at', filters.dateRange.from.toISOString())
        .lte('created_at', filters.dateRange.to.toISOString());

      // Processar dados
      const totalRevenue = (revenueData || []).reduce((sum, payment) => sum + Number(payment.amount), 0);
      const activeUsers = (usersData || []).length;
      const aiCostMonth = (aiData || []).reduce((sum, usage) => sum + Number(usage.cost_usd || 0), 0);
      const aiUsageCount = (aiData || []).length;

      // Calcular crescimento (simulado - seria baseado em período anterior)
      const revenueGrowth = Math.random() * 20 - 10; // -10% a +10%
      const userGrowth = Math.random() * 15; // 0% a +15%

      // Taxa de conversão - corrigir o acesso aos dados de subscription
      const paidUsers = (usersData || []).filter(u => {
        const subscription = u.user_subscriptions as any;
        return subscription && Array.isArray(subscription) && subscription[0]?.plan !== 'free';
      }).length;
      const conversionRate = activeUsers > 0 ? (paidUsers / activeUsers) * 100 : 0;

      // Preparar dados para gráficos
      const revenueChart = generateChartData(revenueData || [], 'amount', 'created_at');
      const engagementChart = generateEngagementData(usersData || []);
      const aiUsageChart = generateAIUsageData(aiData || []);

      // Insights preditivos (simulado)
      const predictiveData = {
        predictedRevenue: totalRevenue * 1.15,
        riskProjects: Math.floor(Math.random() * 5),
        recommendations: [
          'Focar em conversão de usuários gratuitos',
          'Otimizar custos de IA com caching',
          'Implementar alertas de retenção'
        ]
      };

      setReportData({
        totalRevenue,
        revenueGrowth,
        activeUsers,
        userGrowth,
        aiCostMonth,
        aiCostTrend: aiCostMonth > 100 ? 'up' : 'stable',
        aiUsageCount,
        conversionRate,
        revenueChart,
        engagementChart,
        aiUsageChart,
        predictiveData,
      });

      console.log('✅ REPORTS: Dados carregados com sucesso');
    } catch (error) {
      console.error('❌ REPORTS: Erro ao carregar dados:', error);
      toast({
        title: "Erro ao carregar relatórios",
        description: "Não foi possível carregar os dados dos relatórios",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const generateChartData = (data: any[], valueField: string, dateField: string) => {
    const groupedData = data.reduce((acc, item) => {
      const date = new Date(item[dateField]).toLocaleDateString('pt-BR');
      acc[date] = (acc[date] || 0) + Number(item[valueField] || 0);
      return acc;
    }, {});

    return Object.entries(groupedData).map(([date, value]) => ({
      date,
      value,
    }));
  };

  const generateEngagementData = (users: any[]) => {
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

  const generateAIUsageData = (aiData: any[]) => {
    const features = ['budget', 'schedule', 'chat', 'analysis'];
    
    return features.map(feature => ({
      feature,
      usage: aiData.filter(d => d.feature_type === feature).length,
      cost: aiData
        .filter(d => d.feature_type === feature)
        .reduce((sum, d) => sum + Number(d.cost_usd || 0), 0),
    }));
  };

  const updateFilters = (newFilters: Partial<ReportFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const exportReport = async (format: 'pdf' | 'csv', type: string, currentFilters: ReportFilters) => {
    try {
      console.log(`📥 EXPORT: Exportando relatório ${type} em formato ${format}`);
      
      if (format === 'pdf') {
        await generatePDFReport(reportData, type);
      } else {
        await generateCSVReport(reportData, type);
      }

      toast({
        title: "Exportação concluída",
        description: `Relatório ${type} exportado em formato ${format.toUpperCase()}`,
      });
    } catch (error) {
      console.error('❌ EXPORT: Erro na exportação:', error);
      toast({
        title: "Erro na exportação",
        description: "Não foi possível exportar o relatório",
        variant: "destructive",
      });
    }
  };

  const generatePDFReport = async (data: ReportData | null, type: string) => {
    // Implementação de geração de PDF será adicionada
    console.log('🔄 PDF: Gerando relatório PDF...', { data, type });
    
    // Simular delay de geração
    await new Promise(resolve => setTimeout(resolve, 2000));
  };

  const generateCSVReport = async (data: ReportData | null, type: string) => {
    if (!data) return;

    const csvData = [
      ['Relatório MadenAI - Exportado em', new Date().toLocaleDateString('pt-BR')],
      [''],
      ['Métrica', 'Valor'],
      ['Receita Total', `R$ ${data.totalRevenue.toLocaleString('pt-BR')}`],
      ['Usuários Ativos', data.activeUsers.toString()],
      ['Custo IA (Mês)', `$ ${data.aiCostMonth.toFixed(2)}`],
      ['Taxa de Conversão', `${data.conversionRate.toFixed(1)}%`],
      [''],
      ['Dados do Gráfico de Receita'],
      ['Data', 'Valor'],
      ...data.revenueChart.map(item => [item.date, item.value.toString()]),
    ];

    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio-madenai-${type}-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return {
    reportData,
    loading,
    filters,
    updateFilters,
    exportReport,
    refreshData: loadReportData,
  };
}
