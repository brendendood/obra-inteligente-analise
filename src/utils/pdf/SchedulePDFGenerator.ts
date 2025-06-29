
import { BasePDFGenerator, PDFExportOptions } from './BasePDFGenerator';
import { ScheduleData } from '@/types/project';

export class SchedulePDFGenerator extends BasePDFGenerator {
  async generateSchedulePDF(scheduleData: ScheduleData, options: PDFExportOptions): Promise<Uint8Array> {
    let currentY = this.addHeader(options);

    // Resumo do cronograma
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Cronograma de Execução', this.margin, currentY);
    currentY += 15;

    // Calcular datas de início e fim baseadas nas tarefas
    const startDate = scheduleData.tasks.length > 0 
      ? scheduleData.tasks[0].startDate 
      : new Date().toISOString().split('T')[0];
    
    const endDate = scheduleData.tasks.length > 0 
      ? scheduleData.tasks[scheduleData.tasks.length - 1].endDate 
      : new Date().toISOString().split('T')[0];

    // Informações gerais
    const scheduleInfo = [
      ['Duração Total', `${scheduleData.totalDuration} dias`],
      ['Data de Início', startDate],
      ['Data de Término', endDate],
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
      task.category || 'Geral',
      `${task.duration} dias`,
      new Date(task.startDate).toLocaleDateString('pt-BR'),
      new Date(task.endDate).toLocaleDateString('pt-BR'),
      task.progress ? `${task.progress}%` : '0%'
    ]);

    this.doc.autoTable({
      startY: currentY,
      head: [['Atividade', 'Categoria', 'Duração', 'Início', 'Término', 'Progresso']],
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
    return this.outputPDF();
  }
}
