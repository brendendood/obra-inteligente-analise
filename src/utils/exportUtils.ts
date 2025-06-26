
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { BudgetData } from './budgetGenerator';

export const exportToExcel = (budgetData: BudgetData, projectName: string) => {
  try {
    // Criar planilha principal com dados do orçamento
    const mainData = [
      ['ORÇAMENTO DETALHADO - MADENAI'],
      [''],
      ['Projeto:', projectName],
      ['Data:', budgetData.data_referencia],
      ['Área Total:', `${budgetData.totalArea}m²`],
      [''],
      ['ITENS DO ORÇAMENTO'],
      ['Código', 'Descrição', 'Quantidade', 'Unidade', 'Preço Unitário (R$)', 'Total (R$)', 'Categoria', 'Ambiente'],
      ...budgetData.items.map(item => [
        item.codigo,
        item.descricao,
        item.quantidade,
        item.unidade,
        item.preco_unitario.toFixed(2),
        item.total.toFixed(2),
        item.categoria,
        item.ambiente
      ]),
      [''],
      ['RESUMO FINANCEIRO'],
      ['Subtotal:', budgetData.total.toFixed(2)],
      [`BDI (${(budgetData.bdi * 100).toFixed(1)}%):`, (budgetData.total_com_bdi - budgetData.total).toFixed(2)],
      ['Total Geral:', budgetData.total_com_bdi.toFixed(2)],
      ['Custo por m²:', (budgetData.total_com_bdi / budgetData.totalArea).toFixed(2)]
    ];

    const ws = XLSX.utils.aoa_to_sheet(mainData);
    
    // Configurar larguras das colunas
    ws['!cols'] = [
      { wch: 12 }, // Código
      { wch: 40 }, // Descrição
      { wch: 12 }, // Quantidade
      { wch: 10 }, // Unidade
      { wch: 15 }, // Preço Unitário
      { wch: 15 }, // Total
      { wch: 18 }, // Categoria
      { wch: 15 }  // Ambiente
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Orçamento');
    
    // Adicionar planilha de resumo por categoria
    const categoryData = [
      ['RESUMO POR CATEGORIA'],
      [''],
      ['Categoria', 'Quantidade de Itens', 'Valor Total (R$)', 'Percentual do Total']
    ];

    const categories = budgetData.items.reduce((acc: any, item) => {
      if (!acc[item.categoria]) {
        acc[item.categoria] = { count: 0, total: 0 };
      }
      acc[item.categoria].count += 1;
      acc[item.categoria].total += item.total;
      return acc;
    }, {});

    Object.entries(categories).forEach(([category, data]: [string, any]) => {
      const percentage = (data.total / budgetData.total * 100).toFixed(1);
      categoryData.push([category, data.count.toString(), data.total.toFixed(2), `${percentage}%`]);
    });

    const categoryWs = XLSX.utils.aoa_to_sheet(categoryData);
    XLSX.utils.book_append_sheet(wb, categoryWs, 'Resumo por Categoria');
    
    const filename = `Orcamento_${projectName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, filename);
    
    return { success: true, filename };
  } catch (error) {
    console.error('Erro ao exportar Excel:', error);
    return { success: false, error: 'Erro ao gerar arquivo Excel' };
  }
};

export const exportToPDF = (budgetData: BudgetData, projectName: string) => {
  try {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(20);
    doc.setTextColor(40, 40, 40);
    doc.text('ORÇAMENTO DETALHADO', 20, 25);
    
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text('MadenAI - Plataforma de Gestão de Projetos', 20, 35);
    
    // Informações do projeto
    doc.setFontSize(14);
    doc.setTextColor(40, 40, 40);
    doc.text(`Projeto: ${projectName}`, 20, 50);
    
    doc.setFontSize(10);
    doc.text(`Data: ${budgetData.data_referencia}`, 20, 60);
    doc.text(`Área Total: ${budgetData.totalArea}m²`, 20, 68);
    doc.text(`Custo por m²: R$ ${(budgetData.total_com_bdi / budgetData.totalArea).toFixed(2)}`, 120, 68);

    // Tabela principal
    const tableData = budgetData.items.map(item => [
      item.codigo,
      item.descricao.substring(0, 35) + (item.descricao.length > 35 ? '...' : ''),
      item.quantidade.toString(),
      item.unidade,
      `R$ ${item.preco_unitario.toFixed(2)}`,
      `R$ ${item.total.toFixed(2)}`
    ]);

    (doc as any).autoTable({
      head: [['Código', 'Descrição', 'Qtd.', 'Un.', 'Preço Unit.', 'Total']],
      body: tableData,
      startY: 80,
      styles: { 
        fontSize: 8,
        cellPadding: 2
      },
      headStyles: { 
        fillColor: [59, 130, 246],
        textColor: 255
      },
      columnStyles: {
        0: { cellWidth: 20 }, // Código
        1: { cellWidth: 60 }, // Descrição
        2: { cellWidth: 15 }, // Quantidade
        3: { cellWidth: 15 }, // Unidade
        4: { cellWidth: 25 }, // Preço
        5: { cellWidth: 25 }  // Total
      }
    });

    // Resumo financeiro
    const finalY = (doc as any).lastAutoTable.finalY + 15;
    
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text('RESUMO FINANCEIRO:', 20, finalY);
    
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.text(`Subtotal: R$ ${budgetData.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, 20, finalY + 10);
    doc.text(`BDI (${(budgetData.bdi * 100).toFixed(1)}%): R$ ${(budgetData.total_com_bdi - budgetData.total).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, 20, finalY + 18);
    
    doc.setFont(undefined, 'bold');
    doc.text(`TOTAL: R$ ${budgetData.total_com_bdi.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, 20, finalY + 28);

    const filename = `Orcamento_${projectName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(filename);
    
    return { success: true, filename };
  } catch (error) {
    console.error('Erro ao exportar PDF:', error);
    return { success: false, error: 'Erro ao gerar arquivo PDF' };
  }
};

export const exportToCSV = (budgetData: BudgetData, projectName: string) => {
  try {
    // UTF-8 BOM for proper Excel encoding
    const BOM = '\uFEFF';
    
    const headers = ['Código', 'Descrição', 'Quantidade', 'Unidade', 'Preço Unitário', 'Total', 'Categoria', 'Ambiente'];
    const rows = budgetData.items.map(item => [
      item.codigo,
      `"${item.descricao.replace(/"/g, '""')}"`,
      item.quantidade.toString(),
      item.unidade,
      item.preco_unitario.toFixed(2).replace('.', ','),
      item.total.toFixed(2).replace('.', ','),
      item.categoria,
      item.ambiente
    ]);

    const csvContent = [
      `Orçamento - ${projectName};;;;;;;;`,
      `Data: ${budgetData.data_referencia};;;;;;;;`,
      `Área Total: ${budgetData.totalArea}m²;;;;;;;;`,
      '',
      headers.join(';'),
      ...rows.map(row => row.join(';')),
      '',
      `Subtotal;R$ ${budgetData.total.toFixed(2).replace('.', ',')};;;;;;;`,
      `BDI (${(budgetData.bdi * 100).toFixed(1)}%);R$ ${(budgetData.total_com_bdi - budgetData.total).toFixed(2).replace('.', ',')};;;;;;;`,
      `Total;R$ ${budgetData.total_com_bdi.toFixed(2).replace('.', ',')};;;;;;;`
    ].join('\n');

    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Orcamento_${projectName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    
    return { success: true, filename: link.download };
  } catch (error) {
    console.error('Erro ao exportar CSV:', error);
    return { success: false, error: 'Erro ao gerar arquivo CSV' };
  }
};
