
import { ReportData, ReportFilters } from '@/types/adminReports';

export const generateAdminPDFReport = async (data: ReportData | null, type: string, filters: ReportFilters) => {
  if (!data) return;

  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF();

  // Header do relatório administrativo
  doc.setFillColor(37, 99, 235);
  doc.rect(20, 15, 40, 15, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('MadeAI', 25, 25);

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

export const generateAdminCSVReport = async (data: ReportData | null, type: string, filters: ReportFilters) => {
  if (!data) return;

  const csvData = [
    ['Relatório MadeAI - Administrativo'],
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
