
import { BasePDFGenerator, PDFExportOptions } from './BasePDFGenerator';
import { BudgetData } from '../budgetGenerator';

export class BudgetPDFGenerator extends BasePDFGenerator {
  async generateBudgetPDF(budgetData: BudgetData, options: PDFExportOptions): Promise<Uint8Array> {
    console.log('📊 Iniciando geração de PDF de orçamento...', { 
      itemsCount: budgetData.items.length, 
      total: budgetData.total,
      projectName: options.projectName 
    });
    
    let currentY = this.addHeader(options);
    console.log('✅ Header adicionado, posição Y:', currentY);

    // Resumo do orçamento
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Resumo do Orçamento', this.margin, currentY);
    currentY += 15;

    // Calcular custo por m² se não existir
    const costPerSqm = options.projectArea ? budgetData.total / options.projectArea : 0;

    // Cards de resumo
    const summaryData = [
      ['Total Geral', `R$ ${budgetData.total.toLocaleString('pt-BR')}`],
      ['Custo por m²', `R$ ${costPerSqm.toLocaleString('pt-BR')}`],
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
      const category = item.categoria || 'Outros';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(item);
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
      currentY = this.checkPageBreak(currentY);
    });

    console.log('📄 Adicionando footer...');
    this.addFooter();
    console.log('💾 Gerando buffer do PDF...');
    const pdfBuffer = this.outputPDF();
    console.log('✅ PDF de orçamento finalizado, tamanho do buffer:', pdfBuffer.length);
    return pdfBuffer;
  }
}
