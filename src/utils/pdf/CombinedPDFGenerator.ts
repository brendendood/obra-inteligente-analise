
import { BasePDFGenerator, PDFExportOptions } from './BasePDFGenerator';
import { BudgetPDFGenerator } from './BudgetPDFGenerator';
import { SchedulePDFGenerator } from './SchedulePDFGenerator';
import { BudgetData } from '../budgetGenerator';
import { ScheduleData } from '@/types/project';

export class CombinedPDFGenerator extends BasePDFGenerator {
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

    // Calcular custo por m² se não existir
    const costPerSqm = options.projectArea ? budgetData.total / options.projectArea : 0;

    // Calcular datas de início e fim baseadas nas tarefas
    const startDate = scheduleData.tasks.length > 0 
      ? scheduleData.tasks[0].startDate 
      : new Date().toISOString().split('T')[0];
    
    const endDate = scheduleData.tasks.length > 0 
      ? scheduleData.tasks[scheduleData.tasks.length - 1].endDate 
      : new Date().toISOString().split('T')[0];

    // Resumo executivo
    const executiveSummary = [
      ['Orçamento Total', `R$ ${budgetData.total.toLocaleString('pt-BR')}`],
      ['Custo por m²', `R$ ${costPerSqm.toLocaleString('pt-BR')}`],
      ['Prazo de Execução', `${scheduleData.totalDuration} dias`],
      ['Início Previsto', startDate],
      ['Término Previsto', endDate]
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
    const budgetGenerator = new BudgetPDFGenerator();
    await budgetGenerator.generateBudgetPDF(budgetData, { ...options, includeHeader: false });

    // Nova página para cronograma
    this.doc.addPage();
    const scheduleGenerator = new SchedulePDFGenerator();
    await scheduleGenerator.generateSchedulePDF(scheduleData, { ...options, includeHeader: false });

    this.addFooter();
    return this.outputPDF();
  }
}
