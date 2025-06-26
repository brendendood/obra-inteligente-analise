import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Download, FileText, Table, FileSpreadsheet } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { saveAs } from 'file-saver';

interface BudgetExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  budgetData: any;
}

export const BudgetExportDialog = ({ open, onOpenChange, budgetData }: BudgetExportDialogProps) => {
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const exportFormats = [
    {
      id: 'pdf',
      name: 'PDF Relatório',
      description: 'Relatório completo em PDF profissional',
      icon: FileText,
      color: 'bg-red-100 text-red-700 border-red-200'
    },
    {
      id: 'excel',
      name: 'Excel Planilha',
      description: 'Planilha Excel editável com fórmulas',
      icon: FileSpreadsheet,
      color: 'bg-green-100 text-green-700 border-green-200'
    },
    {
      id: 'csv',
      name: 'CSV Dados',
      description: 'Arquivo CSV para importar em outros sistemas',
      icon: Table,
      color: 'bg-blue-100 text-blue-700 border-blue-200'
    }
  ];

  const handleExport = async (format: string) => {
    if (!budgetData) {
      toast({
        title: "❌ Erro",
        description: "Nenhum orçamento disponível para exportar.",
        variant: "destructive",
      });
      return;
    }

    setIsExporting(true);

    try {
      const fileName = `Orcamento_${budgetData.projectName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}`;
      
      switch (format) {
        case 'pdf':
          await generatePDF(budgetData, fileName);
          break;
          
        case 'excel':
          await generateExcel(budgetData, fileName);
          break;
          
        case 'csv':
          await generateCSV(budgetData, fileName);
          break;
          
        default:
          throw new Error('Formato não suportado');
      }

      toast({
        title: "✅ Exportação concluída!",
        description: `Orçamento exportado em formato ${format.toUpperCase()}.`,
      });

      onOpenChange(false);
    } catch (error) {
      console.error('Erro na exportação:', error);
      toast({
        title: "❌ Erro na exportação",
        description: "Não foi possível exportar o orçamento. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const generatePDF = async (data: any, fileName: string) => {
    const pdf = new jsPDF();
    
    // Header
    pdf.setFontSize(20);
    pdf.setTextColor(40, 40, 40);
    pdf.text('ORÇAMENTO DETALHADO', 20, 30);
    
    pdf.setFontSize(12);
    pdf.text(`Projeto: ${data.projectName}`, 20, 45);
    pdf.text(`Área Total: ${data.totalArea}m²`, 20, 55);
    pdf.text(`Data: ${new Date().toLocaleDateString('pt-BR')}`, 20, 65);
    
    // Prepare table data
    const tableColumns = ['Código', 'Descrição', 'Unid.', 'Qtd.', 'Preço Unit.', 'Total'];
    const tableRows = data.items.map((item: any) => [
      item.codigo,
      item.descricao.length > 40 ? item.descricao.substring(0, 40) + '...' : item.descricao,
      item.unidade,
      item.quantidade.toFixed(2),
      `R$ ${item.preco_unitario.toFixed(2)}`,
      `R$ ${item.total.toFixed(2)}`
    ]);

    // Add table using autoTable
    autoTable(pdf, {
      head: [tableColumns],
      body: tableRows,
      startY: 80,
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
        1: { cellWidth: 50 }, // Descrição
        4: { halign: 'right' }, // Preço Unit.
        5: { halign: 'right' }  // Total
      }
    });

    // Summary
    const finalY = (pdf as any).lastAutoTable.finalY + 20;
    
    pdf.setFontSize(12);
    pdf.setFont(undefined, 'bold');
    pdf.text(`Subtotal: R$ ${data.total.toFixed(2)}`, 20, finalY);
    pdf.text(`BDI (${data.bdi}%): R$ ${(data.total_com_bdi - data.total).toFixed(2)}`, 20, finalY + 10);
    pdf.text(`TOTAL GERAL: R$ ${data.total_com_bdi.toFixed(2)}`, 20, finalY + 20);

    // Save PDF
    pdf.save(`${fileName}.pdf`);
  };

  const generateExcel = async (data: any, fileName: string) => {
    const workbook = XLSX.utils.book_new();
    
    // Sheet 1: Orçamento Detalhado
    const budgetData = [
      ['ORÇAMENTO DETALHADO'],
      [''],
      ['Projeto:', data.projectName],
      ['Área Total:', `${data.totalArea}m²`],
      ['Data:', new Date().toLocaleDateString('pt-BR')],
      [''],
      ['Código', 'Descrição', 'Unidade', 'Quantidade', 'Preço Unitário', 'Total', 'Categoria'],
      ...data.items.map((item: any) => [
        item.codigo,
        item.descricao,
        item.unidade,
        item.quantidade,
        item.preco_unitario,
        item.total,
        item.categoria
      ]),
      [''],
      ['', '', '', '', 'Subtotal:', data.total],
      ['', '', '', '', `BDI (${data.bdi}%):`, data.total_com_bdi - data.total],
      ['', '', '', '', 'TOTAL GERAL:', data.total_com_bdi]
    ];

    const budgetSheet = XLSX.utils.aoa_to_sheet(budgetData);
    
    // Format cells
    budgetSheet['A1'] = { t: 's', v: 'ORÇAMENTO DETALHADO', s: { font: { bold: true, sz: 16 } } };
    
    // Set column widths
    budgetSheet['!cols'] = [
      { wch: 15 }, // Código
      { wch: 50 }, // Descrição
      { wch: 10 }, // Unidade
      { wch: 12 }, // Quantidade
      { wch: 15 }, // Preço Unitário
      { wch: 15 }, // Total
      { wch: 20 }  // Categoria
    ];

    XLSX.utils.book_append_sheet(workbook, budgetSheet, 'Orçamento');

    // Sheet 2: Resumo por Categoria
    const categoryData = [
      ['RESUMO POR CATEGORIA'],
      [''],
      ['Categoria', 'Quantidade de Itens', 'Valor Total', 'Percentual']
    ];

    const categories = data.items.reduce((acc: any, item: any) => {
      if (!acc[item.categoria]) {
        acc[item.categoria] = { count: 0, total: 0 };
      }
      acc[item.categoria].count += 1;
      acc[item.categoria].total += item.total;
      return acc;
    }, {});

    Object.entries(categories).forEach(([category, values]: [string, any]) => {
      const percentage = (values.total / data.total * 100).toFixed(1);
      categoryData.push([
        category,
        values.count,
        values.total,
        `${percentage}%`
      ]);
    });

    const summarySheet = XLSX.utils.aoa_to_sheet(categoryData);
    summarySheet['!cols'] = [
      { wch: 25 }, // Categoria
      { wch: 20 }, // Quantidade
      { wch: 15 }, // Valor Total
      { wch: 12 }  // Percentual
    ];

    XLSX.utils.book_append_sheet(workbook, summarySheet, 'Resumo');

    // Generate and save Excel file
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, `${fileName}.xlsx`);
  };

  const generateCSV = async (data: any, fileName: string) => {
    // UTF-8 BOM for proper Excel encoding
    const BOM = '\uFEFF';
    
    const headers = ['Código', 'Descrição', 'Unidade', 'Quantidade', 'Preço Unitário', 'Total', 'Categoria'];
    const rows = data.items.map((item: any) => [
      item.codigo,
      `"${item.descricao.replace(/"/g, '""')}"`, // Escape quotes
      item.unidade,
      item.quantidade.toFixed(2).replace('.', ','), // Brazilian decimal format
      item.preco_unitario.toFixed(2).replace('.', ','),
      item.total.toFixed(2).replace('.', ','),
      item.categoria
    ]);

    const csvContent = [
      headers.join(';'),
      ...rows.map((row: any[]) => row.join(';')),
      '',
      `;;;Subtotal;${data.total.toFixed(2).replace('.', ',')};;`,
      `;;;BDI (${data.bdi}%);${(data.total_com_bdi - data.total).toFixed(2).replace('.', ',')};;`,
      `;;;TOTAL GERAL;${data.total_com_bdi.toFixed(2).replace('.', ',')};;`
    ].join('\n');

    const blob = new Blob([BOM + csvContent], {
      type: 'text/csv;charset=utf-8;'
    });
    
    saveAs(blob, `${fileName}.csv`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Download className="h-5 w-5 mr-2 text-blue-600" />
            Exportar Orçamento
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="text-sm text-gray-600 mb-4">
            Escolha o formato para exportar o orçamento de <strong>{budgetData?.projectName}</strong>:
          </div>

          {exportFormats.map((format) => {
            const IconComponent = format.icon;
            return (
              <Button
                key={format.id}
                variant="outline"
                className="w-full h-auto p-4 flex items-start space-x-3 hover:bg-gray-50"
                onClick={() => handleExport(format.id)}
                disabled={isExporting}
              >
                <div className={`p-2 rounded-lg ${format.color}`}>
                  <IconComponent className="h-5 w-5" />
                </div>
                <div className="flex-1 text-left">
                  <div className="font-medium text-gray-900">{format.name}</div>
                  <div className="text-sm text-gray-500 mt-1">{format.description}</div>
                </div>
              </Button>
            );
          })}

          {isExporting && (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-sm text-gray-600">Preparando exportação...</p>
            </div>
          )}

          <div className="pt-4 border-t">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Dados inclusos:</span>
              <div className="flex space-x-2">
                <Badge variant="outline" className="text-xs">Itens</Badge>
                <Badge variant="outline" className="text-xs">Totais</Badge>
                <Badge variant="outline" className="text-xs">BDI</Badge>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
