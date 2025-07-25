
import jsPDF from 'jspdf';
import 'jspdf-autotable';

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

export class BasePDFGenerator {
  protected doc: jsPDF;
  protected pageWidth: number;
  protected pageHeight: number;
  protected margin: number = 20;

  constructor() {
    console.log('🔧 Inicializando BasePDFGenerator...');
    try {
      this.doc = new jsPDF();
      console.log('✅ jsPDF inicializado com sucesso');
      this.pageWidth = this.doc.internal.pageSize.getWidth();
      this.pageHeight = this.doc.internal.pageSize.getHeight();
      console.log('📐 Dimensões da página:', { width: this.pageWidth, height: this.pageHeight });
    } catch (error) {
      console.error('❌ Erro ao inicializar jsPDF:', error);
      throw error;
    }
  }

  protected addHeader(options: PDFExportOptions): number {
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

  protected addFooter(): void {
    const footerY = this.pageHeight - 20;
    
    this.doc.setFontSize(8);
    this.doc.setTextColor(128, 128, 128);
    this.doc.text('Gerado por MadenAI - Plataforma de Gestão de Obras', this.margin, footerY);
    this.doc.text(`www.madenai.com | Página ${this.doc.getCurrentPageInfo().pageNumber}`, this.pageWidth - 80, footerY);
  }

  protected checkPageBreak(currentY: number): number {
    if (currentY > this.pageHeight - 60) {
      this.doc.addPage();
      return 30;
    }
    return currentY;
  }

  protected outputPDF(): Uint8Array {
    return this.doc.output('arraybuffer') as Uint8Array;
  }
}
