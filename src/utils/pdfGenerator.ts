
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import html2canvas from 'html2canvas';
import { BudgetData } from './budgetGenerator';
import { ScheduleData } from '@/types/project';

// Extend jsPDF type to include autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

export interface PDFExportOptions {
  projectName: string;
  projectArea?: number;
  clientName?: string;
  date?: Date;
  includeHeader?: boolean;
  includeLogo?: boolean;
}

export class MadenAIPDFGenerator {
  private doc: jsPDF;
  private pageWidth: number;
  private pageHeight: number;
  private margin: number = 20;

  constructor() {
    this.doc = new jsPDF();
    this.pageWidth = this.doc.internal.pageSize.getWidth();
    this.pageHeight = this.doc.internal.pageSize.getHeight();
  }

  private addHeader(options: PDFExportOptions) {
    // Logo da MadenAI (simulado)
    this.doc.setFillColor(37, 99, 235); // Azul MadenAI
    this.doc.rect(this.margin, 15, 40, 15, 'F');
    
    this.doc.setTextColor(255, 255, 255);
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('MadenAI', this.margin + 5, 25);

    // Informações do projeto
    this.doc.setTextColor(0, 0, 0);
    this.doc.setFontSize(18);
    this.doc.text(options.projectName, this.margin, 45);

    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text(`Data: ${(options.date || new Date()).toLocaleDateString('pt-BR')}`, this.margin, 55);
    
    if (options.projectArea) {
      this.doc.text(`Área: ${options.projectArea}m²`, this.margin, 62);
    }

    // Linha separadora
    this.doc.setDrawColor(37, 99, 235);
    this.doc.setLineWidth(0.5);
    this.doc.line(this.margin, 70, this.pageWidth - this.margin, 70);

    return 80; // Retorna posição Y após header
  }

  private addFooter() {
    const footerY = this.pageHeight - 20;
    
    this.doc.setFontSize(8);
    this.doc.setTextColor(128, 128, 128);
    this.doc.text('Gerado por MadenAI - Plataforma de Gestão de Obras', this.margin, footerY);
    this.doc.text(`www.madenai.com | Página ${this.doc.getCurrentPageInfo().pageNumber}`, this.pageWidth - 80, footerY);
  }

  async generateBudgetPDF(budgetData: BudgetData, options: PDFExportOptions): Promise<Uint8Array> {
    let currentY = this.addHeader(options);

    // Resumo do orçamento
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Resumo do Orçamento', this.margin, currentY);
    currentY += 15;

    // Cards de resumo
    const summaryData = [
      ['Total Geral', `R$ ${budgetData.total.toLocaleString('pt-BR')}`],
      ['Custo por m²', `R$ ${budgetData.cost_per_sqm.toLocaleString('pt-BR')}`],
      ['Itens Inclusos', budgetData.items.length.toString()],
      ['Data de Referência SINAPI', budgetData.data_referencia]
    ];

    this.doc.autoTable({
      startY: currentY,
      head: [['Métrica', 'Valor']],
      body: summaryData,
      theme: 'grid',
      headStyles: { fillColor: [37, 99, 235], textColor: [255, 255, 255] },
      alternateRowStyles: { fillColor: [248, 250, 252] },
      margin: { left: this.margin, right: this.margin }
    });

    currentY = (this.doc as any).lastAutoTable.finalY + 20;

    // Detalhamento por categoria
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Detalhamento por Categoria', this.margin, currentY);
    currentY += 15;

    // Agrupar itens por categoria
    const itemsByCategory = budgetData.items.reduce((acc: any, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    }, {});

    Object.entries(itemsByCategory).forEach(([category, items]: [string, any[]]) => {
      // Título da categoria
      this.doc.setFontSize(12);
      this.doc.setFont('helvetica', 'bold');
      this.doc.text(category, this.margin, currentY);
      currentY += 10;

      // Tabela de itens da categoria
      const categoryItems = items.map(item => [
        item.description,
        item.unit,
        item.quantity.toString(),
        `R$ ${item.unit_cost.toLocaleString('pt-BR')}`,
        `R$ ${item.total_cost.toLocaleString('pt-BR')}`
      ]);

      this.doc.autoTable({
        startY: currentY,
        head: [['Descrição', 'Unid.', 'Qtd.', 'Valor Unit.', 'Total']],
        body: categoryItems,
        theme: 'striped',
        headStyles: { fillColor: [75, 85, 99], textColor: [255, 255, 255], fontSize: 9 },
        bodyStyles: { fontSize: 8 },
        columnStyles: {
          0: { cellWidth: 80 },
          1: { cellWidth: 20, halign: 'center' },
          2: { cellWidth: 20, halign: 'center' },
          3: { cellWidth: 30, halign: 'right' },
          4: { cellWidth: 30, halign: 'right' }
        },
        margin: { left: this.margin, right: this.margin }
      });

      currentY = (this.doc as any).lastAutoTable.finalY + 15;

      // Verificar se precisa de nova página
      if (currentY > this.pageHeight - 60) {
        this.doc.addPage();
        currentY = 30;
      }
    });

    this.addFooter();
    return this.doc.output('arraybuffer') as Uint8Array;
  }

  async generateSchedulePDF(scheduleData: ScheduleData, options: PDFExportOptions): Promise<Uint8Array> {
    let currentY = this.addHeader(options);

    // Resumo do cronograma
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Cronograma de Execução', this.margin, currentY);
    currentY += 15;

    // Informações gerais
    const scheduleInfo = [
      ['Duração Total', `${scheduleData.totalDuration} dias`],
      ['Data de Início', scheduleData.startDate],
      ['Data de Término', scheduleData.endDate],
      ['Total de Atividades', scheduleData.tasks.length.toString()]
    ];

    this.doc.autoTable({
      startY: currentY,
      head: [['Informação', 'Valor']],
      body: scheduleInfo,
      theme: 'grid',
      headStyles: { fillColor: [37, 99, 235], textColor: [255, 255, 255] },
      alternateRowStyles: { fillColor: [248, 250, 252] },
      margin: { left: this.margin, right: this.margin }
    });

    currentY = (this.doc as any).lastAutoTable.finalY + 20;

    // Lista de tarefas
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Atividades Detalhadas', this.margin, currentY);
    currentY += 15;

    // Preparar dados das tarefas
    const tasksData = scheduleData.tasks.map(task => [
      task.name,
      task.phase || 'Geral',
      `${task.duration} dias`,
      new Date(task.startDate).toLocaleDateString('pt-BR'),
      new Date(task.endDate).toLocaleDateString('pt-BR'),
      task.progress ? `${task.progress}%` : '0%'
    ]);

    this.doc.autoTable({
      startY: currentY,
      head: [['Atividade', 'Fase', 'Duração', 'Início', 'Término', 'Progresso']],
      body: tasksData,
      theme: 'striped',
      headStyles: { fillColor: [75, 85, 99], textColor: [255, 255, 255], fontSize: 10 },
      bodyStyles: { fontSize: 8 },
      columnStyles: {
        0: { cellWidth: 60 },
        1: { cellWidth: 30 },
        2: { cellWidth: 25, halign: 'center' },
        3: { cellWidth: 25, halign: 'center' },
        4: { cellWidth: 25, halign: 'center' },
        5: { cellWidth: 20, halign: 'center' }
      },
      margin: { left: this.margin, right: this.margin }
    });

    // Caminho crítico se existir
    if (scheduleData.criticalPath && scheduleData.criticalPath.length > 0) {
      currentY = (this.doc as any).lastAutoTable.finalY + 20;
      
      this.doc.setFontSize(12);
      this.doc.setFont('helvetica', 'bold');
      this.doc.text('Caminho Crítico', this.margin, currentY);
      currentY += 10;

      this.doc.setFontSize(10);
      this.doc.setFont('helvetica', 'normal');
      const criticalTasks = scheduleData.criticalPath.join(' → ');
      const splitText = this.doc.splitTextToSize(criticalTasks, this.pageWidth - 2 * this.margin);
      this.doc.text(splitText, this.margin, currentY);
    }

    this.addFooter();
    return this.doc.output('arraybuffer') as Uint8Array;
  }

  async generateCombinedProjectReport(
    budgetData: BudgetData, 
    scheduleData: ScheduleData, 
    options: PDFExportOptions
  ): Promise<Uint8Array> {
    let currentY = this.addHeader(options);

    // Visão geral do projeto
    this.doc.setFontSize(16);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Relatório Completo do Projeto', this.margin, currentY);
    currentY += 20;

    // Resumo executivo
    const executiveSummary = [
      ['Orçamento Total', `R$ ${budgetData.total.toLocaleString('pt-BR')}`],
      ['Custo por m²', `R$ ${budgetData.cost_per_sqm.toLocaleString('pt-BR')}`],
      ['Prazo de Execução', `${scheduleData.totalDuration} dias`],
      ['Início Previsto', scheduleData.startDate],
      ['Término Previsto', scheduleData.endDate]
    ];

    this.doc.autoTable({
      startY: currentY,
      head: [['Resumo Executivo', 'Valor']],
      body: executiveSummary,
      theme: 'grid',
      headStyles: { fillColor: [37, 99, 235], textColor: [255, 255, 255] },
      alternateRowStyles: { fillColor: [248, 250, 252] },
      margin: { left: this.margin, right: this.margin }
    });

    // Nova página para orçamento detalhado
    this.doc.addPage();
    await this.generateBudgetPDF(budgetData, { ...options, includeHeader: false });

    // Nova página para cronograma
    this.doc.addPage();
    await this.generateSchedulePDF(scheduleData, { ...options, includeHeader: false });

    this.addFooter();
    return this.doc.output('arraybuffer') as Uint8Array;
  }
}

export const generateProjectPDF = async (
  type: 'budget' | 'schedule' | 'combined',
  data: { budget?: BudgetData; schedule?: ScheduleData },
  options: PDFExportOptions
): Promise<void> => {
  const generator = new MadenAIPDFGenerator();
  let pdfBuffer: Uint8Array;

  try {
    switch (type) {
      case 'budget':
        if (!data.budget) throw new Error('Budget data is required');
        pdfBuffer = await generator.generateBudgetPDF(data.budget, options);
        break;
      case 'schedule':
        if (!data.schedule) throw new Error('Schedule data is required');
        pdfBuffer = await generator.generateSchedulePDF(data.schedule, options);
        break;
      case 'combined':
        if (!data.budget || !data.schedule) throw new Error('Both budget and schedule data are required');
        pdfBuffer = await generator.generateCombinedProjectReport(data.budget, data.schedule, options);
        break;
      default:
        throw new Error('Invalid PDF type');
    }

    // Download do arquivo
    const blob = new Blob([pdfBuffer], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${options.projectName}-${type}-${new Date().toISOString().split('T')[0]}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    console.log(`✅ PDF ${type} gerado com sucesso para ${options.projectName}`);
  } catch (error) {
    console.error('❌ Erro ao gerar PDF:', error);
    throw error;
  }
};
