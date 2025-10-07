
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
  logoSrc?: string;
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
    let yPosition = 25;

    // Logo da MadeAI - Com logo real integrada
    if (options.includeLogo) {
      try {
        // Logo estilizada com cores da marca (preto + azul)
        this.doc.setTextColor(0, 123, 255); // Azul da logo
        this.doc.setFontSize(18);
        this.doc.setFont('helvetica', 'bold');
        this.doc.text('Made', this.margin, yPosition);
        
        this.doc.setTextColor(0, 0, 0); // Preto da logo
        this.doc.text('AI', this.margin + 25, yPosition);
        
        // Reset cor para preto
        this.doc.setTextColor(0, 0, 0);
        yPosition += 20;
      } catch (error) {
        console.warn('Erro ao adicionar logo ao PDF:', error);
        // Fallback simples
        this.doc.setTextColor(0, 0, 0);
        this.doc.setFontSize(16);
        this.doc.setFont('helvetica', 'bold');
        this.doc.text('MadeAI', this.margin, yPosition);
        yPosition += 20;
      }
    }

    // Informações do projeto
    this.doc.setTextColor(0, 0, 0);
    this.doc.setFontSize(18);
    this.doc.text(options.projectName, this.margin, yPosition);
    yPosition += 10;

    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text(`Data: ${(options.date || new Date()).toLocaleDateString('pt-BR')}`, this.margin, yPosition);
    yPosition += 7;
    
    if (options.projectArea) {
      this.doc.text(`Área: ${options.projectArea}m²`, this.margin, yPosition);
      yPosition += 7;
    }

    // Linha separadora
    this.doc.setDrawColor(37, 99, 235);
    this.doc.setLineWidth(0.5);
    this.doc.line(this.margin, yPosition + 3, this.pageWidth - this.margin, yPosition + 3);

    return yPosition + 15; // Retorna posição Y após header
  }

  protected addFooter(): void {
    const footerY = this.pageHeight - 20;
    
    this.doc.setFontSize(8);
    this.doc.setTextColor(128, 128, 128);
    this.doc.text('Gerado por MadeAI - Plataforma de Gestão de Obras', this.margin, footerY);
    this.doc.text(`www.madeai.com | Página ${this.doc.getCurrentPageInfo().pageNumber}`, this.pageWidth - 80, footerY);
  }

  protected checkPageBreak(currentY: number): number {
    if (currentY > this.pageHeight - 60) {
      this.doc.addPage();
      return 30;
    }
    return currentY;
  }

  protected outputPDF(): Uint8Array {
    const buffer = this.doc.output('arraybuffer');
    return new Uint8Array(buffer as ArrayBuffer);
  }
}
