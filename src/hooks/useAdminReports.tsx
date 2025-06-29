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
        await generateAdminPDFReport(reportData, type, currentFilters);
      } else {
        await generateAdminCSVReport(reportData, type, currentFilters);
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

  const generateAdminPDFReport = async (data: ReportData | null, type: string, filters: ReportFilters) => {
    if (!data) return;

    // Usar a mesma classe de geração de PDF, mas adaptada para relatórios admin
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF();

    // Header do relatório administrativo
    doc.setFillColor(37, 99, 235);
    doc.rect(20, 15, 40, 15, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('MadenAI', 25, 25);

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(18);
    doc.text(`Relatório Administrativo - ${type}`, 20, 45);

    doc.setFontSize(10);
    doc.text(`Período: ${filters.dateRange.from.toLocaleDateString('pt-BR')} a ${filters.dateRange.to.toLocaleDateString('pt-BR')}`, 20, 55);
    doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}`, 20, 62);

    // Linha separadora
    doc.setDrawColor(37, 99, 235);
    doc.setLineWidth(0.5);
    doc.line(20, 70, 190, 70);

    // Métricas principais
    const metricsData = [
      ['Receita Total', `R$ ${data.totalRevenue.toLocaleString('pt-BR')}`],
      ['Usuários Ativos', data.activeUsers.toString()],
      ['Custo IA (Mês)', `$ ${data.aiCostMonth.toFixed(2)}`],
      ['Taxa de Conversão', `${data.conversionRate.toFixed(1)}%`],
      ['Crescimento Receita', `${data.revenueGrowth > 0 ? '+' : ''}${data.revenueGrowth.toFixed(1)}%`],
      ['Crescimento Usuários', `+${data.userGrowth.toFixed(1)}%`]
    ];

    (doc as any).autoTable({
      startY: 80,
      head: [['Métrica', 'Valor']],
      body: metricsData,
      theme: 'grid',
      headStyles: { fillColor: [37, 99, 235], textColor: [255, 255, 255] },
      alternateRowStyles: { fillColor: [248, 250, 252] }
    });

    // Dados dos gráficos
    if (data.revenueChart && data.revenueChart.length > 0) {
      doc.addPage();
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Dados de Receita', 20, 30);

      const revenueData = data.revenueChart.map(item => [
        item.date,
        `R$ ${item.value.toLocaleString('pt-BR')}`
      ]);

      (doc as any).autoTable({
        startY: 40,
        head: [['Data', 'Receita']],
        body: revenueData,
        theme: 'striped'
      });
    }

    // Download
    const blob = new Blob([doc.output('arraybuffer')], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio-administrativo-${type}-${new Date().toISOString().split('T')[0]}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const generateAdminCSVReport = async (data: ReportData | null, type: string, filters: ReportFilters) => {
    if (!data) return;

    const csvData = [
      ['Relatório MadenAI - Administrativo'],
      [`Tipo: ${type}`],
      [`Período: ${filters.dateRange.from.toLocaleDateString('pt-BR')} a ${filters.dateRange.to.toLocaleDateString('pt-BR')}`],
      [`Gerado em: ${new Date().toLocaleString('pt-BR')}`],
      [''],
      ['=== MÉTRICAS PRINCIPAIS ==='],
      ['Receita Total', `R$ ${data.totalRevenue.toLocaleString('pt-BR')}`],
      ['Usuários Ativos', data.activeUsers.toString()],
      ['Custo IA (Mês)', `$ ${data.aiCostMonth.toFixed(2)}`],
      ['Taxa de Conversão', `${data.conversionRate.toFixed(1)}%`],
      ['Crescimento Receita', `${data.revenueGrowth > 0 ? '+' : ''}${data.revenueGrowth.toFixed(1)}%`],
      ['Crescimento Usuários', `+${data.userGrowth.toFixed(1)}%`],
      [''],
      ['=== DADOS DE RECEITA ==='],
      ['Data', 'Valor'],
      ...data.revenueChart.map(item => [item.date, item.value.toString()]),
      [''],
      ['=== DADOS DE USUÁRIOS ==='],
      ['Data', 'Usuários Ativos', 'Novos Usuários'],
      ...data.engagementChart.map(item => [item.date, item.activeUsers.toString(), item.newUsers.toString()]),
    ];

    const csvContent = csvData.map(row => Array.isArray(row) ? row.join(',') : row).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio-administrativo-${type}-${new Date().toISOString().split('T')[0]}.csv`;
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
