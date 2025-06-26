
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { BudgetData } from './budgetGenerator';

export const exportToExcel = (budgetData: BudgetData, projectName: string) => {
  const ws = XLSX.utils.json_to_sheet(budgetData.items.map(item => ({
    'Código': item.codigo,
    'Descrição': item.descricao,
    'Quantidade': item.quantidade,
    'Unidade': item.unidade,
    'Preço Unitário': `R$ ${item.preco_unitario.toFixed(2)}`,
    'Total': `R$ ${item.total.toFixed(2)}`,
    'Categoria': item.categoria,
    'Ambiente': item.ambiente
  })));

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Orçamento');
  
  const filename = `Orcamento_${projectName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.xlsx`;
  XLSX.writeFile(wb, filename);
};

export const exportToPDF = (budgetData: BudgetData, projectName: string) => {
  const doc = new jsPDF();
  
  // Título
  doc.setFontSize(16);
  doc.text(`Orçamento - ${projectName}`, 20, 20);
  
  // Informações gerais
  doc.setFontSize(12);
  doc.text(`Data: ${budgetData.data_referencia}`, 20, 35);
  doc.text(`Área Total: ${budgetData.totalArea}m²`, 20, 45);
  doc.text(`Subtotal: R$ ${budgetData.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, 20, 55);
  doc.text(`BDI (${(budgetData.bdi * 100).toFixed(0)}%): R$ ${(budgetData.total_com_bdi - budgetData.total).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, 20, 65);
  doc.text(`Total: R$ ${budgetData.total_com_bdi.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, 20, 75);

  // Tabela
  const tableData = budgetData.items.map(item => [
    item.codigo,
    item.descricao,
    item.quantidade.toString(),
    item.unidade,
    `R$ ${item.preco_unitario.toFixed(2)}`,
    `R$ ${item.total.toFixed(2)}`
  ]);

  (doc as any).autoTable({
    head: [['Código', 'Descrição', 'Qtd.', 'Un.', 'Preço Unit.', 'Total']],
    body: tableData,
    startY: 85,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [52, 152, 219] }
  });

  const filename = `Orcamento_${projectName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(filename);
};

export const exportToCSV = (budgetData: BudgetData, projectName: string) => {
  const headers = ['Código', 'Descrição', 'Quantidade', 'Unidade', 'Preço Unitário', 'Total', 'Categoria', 'Ambiente'];
  const csvData = [
    headers,
    ...budgetData.items.map(item => [
      item.codigo,
      item.descricao,
      item.quantidade.toString(),
      item.unidade,
      item.preco_unitario.toFixed(2),
      item.total.toFixed(2),
      item.categoria,
      item.ambiente
    ])
  ];

  const csvContent = csvData.map(row => row.join(',')).join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `Orcamento_${projectName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
};
