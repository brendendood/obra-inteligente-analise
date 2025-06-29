import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { saveAs } from 'file-saver';
import { ScheduleTask, ScheduleData } from '@/types/project';

export const exportScheduleToPDF = async (data: ScheduleData, fileName: string) => {
  const pdf = new jsPDF();
  
  // Header com Logo Maden IA
  pdf.setFillColor(59, 130, 246); // Azul MadenAI
  pdf.rect(0, 0, 210, 40, 'F');
  
  // Logo e título
  pdf.setFontSize(24);
  pdf.setTextColor(255, 255, 255);
  pdf.setFont('helvetica', 'bold');
  pdf.text('MadenAI', 105, 20, { align: 'center' });
  
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Sistema Inteligente de Gestão de Obras', 105, 30, { align: 'center' });
  
  // Título do documento
  pdf.setFontSize(20);
  pdf.setTextColor(40, 40, 40);
  pdf.setFont('helvetica', 'bold');
  pdf.text('CRONOGRAMA FÍSICO-FINANCEIRO', 105, 55, { align: 'center' });
  
  // Informações do projeto
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Projeto: ${data.projectName}`, 20, 70);
  pdf.text(`Área Total: ${data.totalArea}m²`, 20, 80);
  pdf.text(`Duração Total: ${data.totalDuration} dias`, 110, 70);
  pdf.text(`Custo Total: R$ ${data.totalCost.toLocaleString('pt-BR')}`, 110, 80);
  pdf.text(`Data de Geração: ${new Date().toLocaleDateString('pt-BR')}`, 20, 90);
  
  // Linha separadora
  pdf.setDrawColor(59, 130, 246);
  pdf.setLineWidth(0.5);
  pdf.line(20, 95, 190, 95);

  // Prepare table data
  const tableColumns = ['#', 'Etapa', 'Início', 'Fim', 'Duração', 'Custo', 'Status', 'Responsável'];
  const tableRows = data.tasks.map((task, index) => [
    (index + 1).toString(),
    task.name.length > 35 ? task.name.substring(0, 35) + '...' : task.name,
    new Date(task.startDate).toLocaleDateString('pt-BR'),
    new Date(task.endDate).toLocaleDateString('pt-BR'),
    `${task.duration}d`,
    `R$ ${task.cost.toLocaleString('pt-BR')}`,
    getStatusLabel(task.status),
    task.assignee?.name?.substring(0, 15) || 'N/A'
  ]);

  // Add table using autoTable
  autoTable(pdf, {
    head: [tableColumns],
    body: tableRows,
    startY: 105,
    styles: {
      fontSize: 8,
      cellPadding: 2,
    },
    headStyles: {
      fillColor: [59, 130, 246],
      textColor: 255,
      fontStyle: 'bold'
    },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center' }, // #
      1: { cellWidth: 45 }, // Etapa
      2: { cellWidth: 18, halign: 'center' }, // Início
      3: { cellWidth: 18, halign: 'center' }, // Fim
      4: { cellWidth: 15, halign: 'center' }, // Duração
      5: { cellWidth: 25, halign: 'right' }, // Custo
      6: { cellWidth: 20, halign: 'center' }, // Status
      7: { cellWidth: 25 }, // Responsável
    }
  });

  // Critical Path section
  const finalY = (pdf as any).lastAutoTable.finalY + 15;
  
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(59, 130, 246);
  pdf.text('CAMINHO CRÍTICO:', 20, finalY);
  
  const criticalTasks = data.tasks.filter(task => data.criticalPath.includes(task.id));
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(40, 40, 40);
  
  criticalTasks.forEach((task, index) => {
    if (finalY + 20 + (index * 6) > 280) { // Nova página se necessário
      pdf.addPage();
      pdf.text(`${index + 1}. ${task.name}`, 20, 20);
    } else {
      pdf.text(`${index + 1}. ${task.name}`, 20, finalY + 20 + (index * 6));
    }
  });

  // Footer
  const pageCount = pdf.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    pdf.setPage(i);
    pdf.setFontSize(8);
    pdf.setTextColor(128, 128, 128);
    pdf.text(`Página ${i} de ${pageCount}`, 105, 290, { align: 'center' });
    pdf.text('Gerado por MadenAI - Sistema Inteligente de Gestão de Obras', 105, 295, { align: 'center' });
  }

  // Save PDF
  pdf.save(`${fileName}.pdf`);
};

export const exportScheduleToExcel = async (data: ScheduleData, fileName: string) => {
  const workbook = XLSX.utils.book_new();
  
  // Sheet 1: Cronograma Detalhado
  const scheduleData = [
    ['MADEN IA - SISTEMA INTELIGENTE DE GESTÃO DE OBRAS'],
    ['CRONOGRAMA FÍSICO-FINANCEIRO'],
    [''],
    ['Projeto:', data.projectName],
    ['Área Total:', `${data.totalArea}m²`],
    ['Duração Total:', `${data.totalDuration} dias`],
    ['Custo Total:', `R$ ${data.totalCost.toLocaleString('pt-BR')}`],
    ['Data de Geração:', new Date().toLocaleDateString('pt-BR')],
    [''],
    ['#', 'Etapa', 'Data Início', 'Data Fim', 'Duração (dias)', 'Custo (R$)', 'Status', 'Categoria', 'Responsável'],
    ...data.tasks.map((task, index) => [
      index + 1,
      task.name,
      task.startDate,
      task.endDate,
      task.duration.toString(),
      task.cost.toString(),
      getStatusLabel(task.status),
      task.category,
      task.assignee?.name || 'Não atribuído'
    ])
  ];

  const scheduleSheet = XLSX.utils.aoa_to_sheet(scheduleData);
  
  // Styling para header
  scheduleSheet['A1'] = { 
    v: 'MADEN IA - SISTEMA INTELIGENTE DE GESTÃO DE OBRAS', 
    s: { font: { bold: true, sz: 14 }, fill: { fgColor: { rgb: "3B82F6" } } }
  };
  scheduleSheet['A2'] = { 
    v: 'CRONOGRAMA FÍSICO-FINANCEIRO', 
    s: { font: { bold: true, sz: 12 } }
  };

  // Set column widths
  scheduleSheet['!cols'] = [
    { wch: 5 },  // #
    { wch: 40 }, // Etapa
    { wch: 12 }, // Data Início
    { wch: 12 }, // Data Fim
    { wch: 15 }, // Duração
    { wch: 15 }, // Custo
    { wch: 15 }, // Status
    { wch: 20 }, // Categoria
    { wch: 20 }  // Responsável
  ];

  // Merge cells for title
  scheduleSheet['!merges'] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 8 } }, // Title
    { s: { r: 1, c: 0 }, e: { r: 1, c: 8 } }  // Subtitle
  ];

  XLSX.utils.book_append_sheet(workbook, scheduleSheet, 'Cronograma');

  // Sheet 2: Resumo por Categoria
  const categoryData = [
    ['RESUMO POR CATEGORIA - MADEN IA'],
    [''],
    ['Categoria', 'Qtd Etapas', 'Duração Total (dias)', 'Custo Total (R$)', 'Percentual do Custo']
  ];

  const categories = data.tasks.reduce((acc: any, task) => {
    if (!acc[task.category]) {
      acc[task.category] = { count: 0, duration: 0, cost: 0 };
    }
    acc[task.category].count += 1;
    acc[task.category].duration += task.duration;
    acc[task.category].cost += task.cost;
    return acc;
  }, {});

  Object.entries(categories).forEach(([category, values]: [string, any]) => {
    const percentage = (values.cost / data.totalCost * 100).toFixed(1);
    categoryData.push([
      category,
      values.count.toString(),
      values.duration.toString(),
      values.cost.toString(),
      `${percentage}%`
    ]);
  });

  const summarySheet = XLSX.utils.aoa_to_sheet(categoryData);
  summarySheet['!cols'] = [
    { wch: 25 }, // Categoria
    { wch: 15 }, // Quantidade
    { wch: 20 }, // Duração
    { wch: 18 }, // Custo
    { wch: 18 }  // Percentual
  ];

  XLSX.utils.book_append_sheet(workbook, summarySheet, 'Resumo por Categoria');

  // Sheet 3: Caminho Crítico
  const criticalData = [
    ['CAMINHO CRÍTICO - MADEN IA'],
    [''],
    ['Ordem', 'Etapa', 'Data Início', 'Data Fim', 'Duração', 'Custo']
  ];

  const criticalTasks = data.tasks.filter(task => data.criticalPath.includes(task.id));
  criticalTasks.forEach((task, index) => {
    criticalData.push([
      (index + 1).toString(),
      task.name,
      task.startDate,
      task.endDate,
      task.duration.toString(),
      task.cost.toString()
    ]);
  });

  const criticalSheet = XLSX.utils.aoa_to_sheet(criticalData);
  criticalSheet['!cols'] = [
    { wch: 8 },  // Ordem
    { wch: 40 }, // Etapa
    { wch: 12 }, // Data Início
    { wch: 12 }, // Data Fim
    { wch: 12 }, // Duração
    { wch: 15 }  // Custo
  ];

  XLSX.utils.book_append_sheet(workbook, criticalSheet, 'Caminho Crítico');

  // Generate and save Excel file
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  saveAs(blob, `${fileName}.xlsx`);
};

export const exportScheduleToCSV = async (data: ScheduleData, fileName: string) => {
  // UTF-8 BOM for proper Excel encoding
  const BOM = '\uFEFF';
  
  const headers = ['#', 'Etapa', 'Data Início', 'Data Fim', 'Duração (dias)', 'Custo (R$)', 'Status', 'Categoria', 'Responsável'];
  const rows = data.tasks.map((task, index) => [
    (index + 1).toString(),
    `"${task.name.replace(/"/g, '""')}"`,
    task.startDate,
    task.endDate,
    task.duration.toString(),
    task.cost.toFixed(2).replace('.', ','),
    getStatusLabel(task.status),
    task.category,
    `"${(task.assignee?.name || 'Não atribuído').replace(/"/g, '""')}"`
  ]);

  const csvContent = [
    'MADEN IA - CRONOGRAMA FÍSICO-FINANCEIRO;;;;;;;;;',
    `Projeto: ${data.projectName};;;;;;;;;`,
    `Data: ${new Date().toLocaleDateString('pt-BR')};;;;;;;;;`,
    '',
    headers.join(';'),
    ...rows.map((row: string[]) => row.join(';')),
    '',
    `Resumo:;;;;;;;;;`,
    `Total de Etapas;${data.tasks.length};;;;;;;`,
    `Duração Total;${data.totalDuration} dias;;;;;;;`,
    `Custo Total;R$ ${data.totalCost.toFixed(2).replace('.', ',')};;;;;;;`
  ].join('\n');

  const blob = new Blob([BOM + csvContent], {
    type: 'text/csv;charset=utf-8;'
  });
  
  saveAs(blob, `${fileName}.csv`);
};

const getStatusLabel = (status: string) => {
  const labels = {
    planned: 'Planejado',
    in_progress: 'Em Andamento',
    completed: 'Concluído'
  };
  return labels[status as keyof typeof labels] || status;
};

// Re-export types for backward compatibility
export type { ScheduleTask, ScheduleData };
