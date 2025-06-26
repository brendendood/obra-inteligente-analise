
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { saveAs } from 'file-saver';
import { ScheduleTask, ScheduleData } from '@/types/project';

// Extend jsPDF type to include autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

export const exportScheduleToPDF = async (data: ScheduleData, fileName: string) => {
  const pdf = new jsPDF();
  
  // Header
  pdf.setFontSize(20);
  pdf.setTextColor(40, 40, 40);
  pdf.text('CRONOGRAMA FÍSICO-FINANCEIRO', 20, 30);
  
  pdf.setFontSize(12);
  pdf.text(`Projeto: ${data.projectName}`, 20, 45);
  pdf.text(`Área Total: ${data.totalArea}m²`, 20, 55);
  pdf.text(`Duração Total: ${data.totalDuration} dias`, 20, 65);
  pdf.text(`Custo Total: R$ ${data.totalCost.toLocaleString('pt-BR')}`, 20, 75);
  pdf.text(`Data: ${new Date().toLocaleDateString('pt-BR')}`, 20, 85);
  
  // Prepare table data
  const tableColumns = ['Etapa', 'Início', 'Fim', 'Duração', 'Custo', 'Status', 'Responsável'];
  const tableRows = data.tasks.map((task) => [
    task.name.length > 30 ? task.name.substring(0, 30) + '...' : task.name,
    new Date(task.startDate).toLocaleDateString('pt-BR'),
    new Date(task.endDate).toLocaleDateString('pt-BR'),
    `${task.duration} dias`,
    `R$ ${task.cost.toLocaleString('pt-BR')}`,
    getStatusLabel(task.status),
    task.assignee?.name || 'Não atribuído'
  ]);

  // Add table
  pdf.autoTable({
    head: [tableColumns],
    body: tableRows,
    startY: 100,
    styles: {
      fontSize: 8,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: [41, 128, 185],
      textColor: 255,
      fontStyle: 'bold'
    },
    columnStyles: {
      0: { cellWidth: 40 }, // Etapa
      4: { halign: 'right' }, // Custo
    }
  });

  // Critical Path section
  const finalY = (pdf as any).lastAutoTable.finalY + 20;
  
  pdf.setFontSize(14);
  pdf.setFont(undefined, 'bold');
  pdf.text('CAMINHO CRÍTICO:', 20, finalY);
  
  const criticalTasks = data.tasks.filter(task => data.criticalPath.includes(task.id));
  pdf.setFontSize(10);
  pdf.setFont(undefined, 'normal');
  
  criticalTasks.forEach((task, index) => {
    pdf.text(`${index + 1}. ${task.name}`, 20, finalY + 15 + (index * 8));
  });

  // Summary
  const summaryY = finalY + 15 + (criticalTasks.length * 8) + 20;
  pdf.setFontSize(12);
  pdf.setFont(undefined, 'bold');
  pdf.text(`Total de Etapas: ${data.tasks.length}`, 20, summaryY);
  pdf.text(`Duração Total: ${data.totalDuration} dias`, 20, summaryY + 10);
  pdf.text(`Custo Total: R$ ${data.totalCost.toLocaleString('pt-BR')}`, 20, summaryY + 20);

  // Save PDF
  pdf.save(`${fileName}.pdf`);
};

export const exportScheduleToExcel = async (data: ScheduleData, fileName: string) => {
  const workbook = XLSX.utils.book_new();
  
  // Sheet 1: Cronograma Detalhado
  const scheduleData = [
    ['CRONOGRAMA FÍSICO-FINANCEIRO'],
    [''],
    ['Projeto:', data.projectName],
    ['Área Total:', `${data.totalArea}m²`],
    ['Duração Total:', `${data.totalDuration} dias`],
    ['Custo Total:', `R$ ${data.totalCost.toLocaleString('pt-BR')}`],
    ['Data:', new Date().toLocaleDateString('pt-BR')],
    [''],
    ['Etapa', 'Data Início', 'Data Fim', 'Duração (dias)', 'Custo (R$)', 'Status', 'Categoria', 'Responsável'],
    ...data.tasks.map((task) => [
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
  
  // Set column widths
  scheduleSheet['!cols'] = [
    { wch: 35 }, // Etapa
    { wch: 12 }, // Data Início
    { wch: 12 }, // Data Fim
    { wch: 15 }, // Duração
    { wch: 15 }, // Custo
    { wch: 15 }, // Status
    { wch: 20 }, // Categoria
    { wch: 20 }  // Responsável
  ];

  XLSX.utils.book_append_sheet(workbook, scheduleSheet, 'Cronograma');

  // Sheet 2: Resumo por Categoria
  const categoryData = [
    ['RESUMO POR CATEGORIA'],
    [''],
    ['Categoria', 'Quantidade de Etapas', 'Duração Total (dias)', 'Custo Total (R$)', 'Percentual do Custo']
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
    { wch: 20 }, // Quantidade
    { wch: 20 }, // Duração
    { wch: 18 }, // Custo
    { wch: 18 }  // Percentual
  ];

  XLSX.utils.book_append_sheet(workbook, summarySheet, 'Resumo');

  // Sheet 3: Caminho Crítico
  const criticalData = [
    ['CAMINHO CRÍTICO'],
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
    { wch: 35 }, // Etapa
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
  
  const headers = ['Etapa', 'Data Início', 'Data Fim', 'Duração (dias)', 'Custo (R$)', 'Status', 'Categoria', 'Responsável'];
  const rows = data.tasks.map((task) => [
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
    headers.join(';'),
    ...rows.map((row: string[]) => row.join(';')),
    '',
    `Resumo do Projeto:;;;;;;;;`,
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
