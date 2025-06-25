
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Download, FileText, Table, FileSpreadsheet } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Generate mock file based on format
      const fileName = `Orcamento_${budgetData.projectName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}`;
      
      let blob: Blob;
      let mimeType: string;
      let extension: string;

      switch (format) {
        case 'pdf':
          // Mock PDF generation
          const pdfContent = generatePDFContent(budgetData);
          blob = new Blob([pdfContent], { type: 'application/pdf' });
          mimeType = 'application/pdf';
          extension = 'pdf';
          break;
          
        case 'excel':
          // Mock Excel generation
          const excelContent = generateExcelContent(budgetData);
          blob = new Blob([excelContent], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
          extension = 'xlsx';
          break;
          
        case 'csv':
          // Real CSV generation
          const csvContent = generateCSVContent(budgetData);
          blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
          mimeType = 'text/csv';
          extension = 'csv';
          break;
          
        default:
          throw new Error('Formato não suportado');
      }

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${fileName}.${extension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

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

  const generateCSVContent = (data: any) => {
    const headers = ['Código', 'Descrição', 'Unidade', 'Quantidade', 'Preço Unitário', 'Total', 'Categoria', 'Ambiente'];
    const rows = data.items.map((item: any) => [
      item.codigo,
      `"${item.descricao}"`,
      item.unidade,
      item.quantidade.toFixed(2),
      item.preco_unitario.toFixed(2),
      item.total.toFixed(2),
      item.categoria,
      item.ambiente
    ]);

    return [
      headers.join(','),
      ...rows.map((row: any[]) => row.join(',')),
      '',
      `Subtotal,,,,,${data.total.toFixed(2)},,`,
      `BDI (${data.bdi}%),,,,,${(data.total_com_bdi - data.total).toFixed(2)},,`,
      `TOTAL GERAL,,,,,${data.total_com_bdi.toFixed(2)},,`
    ].join('\n');
  };

  const generatePDFContent = (data: any) => {
    // Mock PDF content - in real implementation, use a PDF library
    return `Orçamento - ${data.projectName}\nÁrea: ${data.totalArea}m²\nTotal: R$ ${data.total_com_bdi.toFixed(2)}`;
  };

  const generateExcelContent = (data: any) => {
    // Mock Excel content - in real implementation, use a library like xlsx
    return `Orçamento Excel - ${data.projectName}`;
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
