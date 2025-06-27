
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface PDFHeaderConfig {
  title: string;
  subtitle: string;
  projectName: string;
  exportDate?: string;
}

export const createPDFWithMadenAIBrand = (config: PDFHeaderConfig): jsPDF => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  
  // Configurações de cores
  const colors = {
    primary: '#2563eb', // Blue-600
    secondary: '#64748b', // Slate-500
    light: '#f7f7f7', // Light gray
    dark: '#3b3b3b', // Dark gray
    border: '#eaeaea' // Light border
  };

  // Header com logo e informações do projeto
  doc.setFillColor(colors.primary);
  doc.rect(0, 0, pageWidth, 35, 'F');
  
  // Logo da MadenAI (texto estilizado)
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('MadenAI', 20, 22);
  
  // Nome do projeto (lado direito)
  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  const projectText = `Projeto: ${config.projectName}`;
  const projectTextWidth = doc.getTextWidth(projectText);
  doc.text(projectText, pageWidth - projectTextWidth - 20, 22);
  
  // Subtítulo do relatório
  doc.setTextColor(colors.dark);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text(config.title, 20, 50);
  
  // Subtítulo secundário
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(colors.secondary);
  doc.text(config.subtitle, 20, 62);
  
  // Data de exportação
  const exportDate = config.exportDate || new Date().toLocaleDateString('pt-BR');
  doc.text(`Data da exportação: ${exportDate}`, 20, 74);
  
  // Linha separadora
  doc.setDrawColor(colors.border);
  doc.setLineWidth(0.5);
  doc.line(20, 80, pageWidth - 20, 80);
  
  // Rodapé
  const addFooter = () => {
    const footerY = pageHeight - 20;
    doc.setFontSize(8);
    doc.setTextColor(colors.secondary);
    doc.text('Exportado com tecnologia MadenAI', 20, footerY);
    
    // Número da página
    const pageNum = `Página ${doc.getCurrentPageInfo().pageNumber}`;
    const pageNumWidth = doc.getTextWidth(pageNum);
    doc.text(pageNum, pageWidth - pageNumWidth - 20, footerY);
  };
  
  // Adicionar rodapé à página atual
  addFooter();
  
  // Override do método addPage para incluir rodapé automaticamente
  const originalAddPage = doc.addPage.bind(doc);
  doc.addPage = function() {
    const result = originalAddPage();
    addFooter();
    return result;
  };
  
  return doc;
};

export const createStyledTable = (
  doc: jsPDF, 
  headers: string[], 
  data: (string | number)[][],
  startY: number = 90
) => {
  const colors = {
    headerBg: '#f7f7f7',
    headerText: '#3b3b3b',
    border: '#eaeaea'
  };

  autoTable(doc, {
    head: [headers],
    body: data,
    startY: startY,
    styles: {
      fontSize: 9,
      cellPadding: 8,
      lineColor: colors.border,
      lineWidth: 0.1,
    },
    headStyles: {
      fillColor: colors.headerBg,
      textColor: colors.headerText,
      fontStyle: 'bold',
      fontSize: 10,
    },
    bodyStyles: {
      textColor: colors.headerText,
    },
    columnStyles: {
      // Números alinhados à direita (assumindo que as últimas colunas são números)
      [headers.length - 1]: { halign: 'right' },
      [headers.length - 2]: headers.length > 2 ? { halign: 'right' } : {},
    },
    alternateRowStyles: {
      fillColor: '#fafafa'
    },
    margin: { left: 20, right: 20 },
  });

  return (doc as any).lastAutoTable.finalY;
};

export const addSummarySection = (
  doc: jsPDF,
  title: string,
  summaryData: { label: string; value: string }[],
  startY: number
) => {
  const colors = {
    dark: '#3b3b3b',
    secondary: '#64748b'
  };

  // Título da seção
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(colors.dark);
  doc.text(title, 20, startY);
  
  let currentY = startY + 15;
  
  // Dados do resumo
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  
  summaryData.forEach((item, index) => {
    doc.setTextColor(colors.secondary);
    doc.text(item.label, 25, currentY);
    
    doc.setTextColor(colors.dark);
    doc.setFont('helvetica', 'bold');
    const valueWidth = doc.getTextWidth(item.value);
    doc.text(item.value, doc.internal.pageSize.width - valueWidth - 25, currentY);
    doc.setFont('helvetica', 'normal');
    
    currentY += 10;
  });
  
  return currentY + 10;
};
