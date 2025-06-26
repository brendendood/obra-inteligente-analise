
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, FileSpreadsheet, FileText, Database } from 'lucide-react';
import { BudgetData } from '@/utils/budgetGenerator';
import { exportToExcel, exportToPDF, exportToCSV } from '@/utils/exportUtils';
import { useToast } from '@/hooks/use-toast';

interface BudgetExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  budgetData: BudgetData | null;
  projectName?: string;
}

export const BudgetExportDialog = ({ open, onOpenChange, budgetData, projectName = 'Projeto' }: BudgetExportDialogProps) => {
  const { toast } = useToast();

  const handleExport = async (format: 'excel' | 'pdf' | 'csv') => {
    if (!budgetData) return;

    try {
      switch (format) {
        case 'excel':
          exportToExcel(budgetData, projectName);
          toast({
            title: "✅ Excel exportado!",
            description: "Arquivo Excel baixado com sucesso.",
          });
          break;
        case 'pdf':
          exportToPDF(budgetData, projectName);
          toast({
            title: "✅ PDF exportado!",
            description: "Arquivo PDF baixado com sucesso.",
          });
          break;
        case 'csv':
          exportToCSV(budgetData, projectName);
          toast({
            title: "✅ CSV exportado!",
            description: "Arquivo CSV baixado com sucesso.",
          });
          break;
      }
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "❌ Erro na exportação",
        description: "Não foi possível exportar o arquivo.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Exportar Orçamento</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Escolha o formato para exportar o orçamento de <strong>{projectName}</strong>:
          </p>
          
          <div className="space-y-3">
            <Button
              onClick={() => handleExport('excel')}
              className="w-full justify-start bg-green-600 hover:bg-green-700"
              disabled={!budgetData}
            >
              <FileSpreadsheet className="h-4 w-4 mr-3" />
              <div className="text-left">
                <div className="font-medium">Excel (.xlsx)</div>
                <div className="text-xs opacity-90">Planilha editável com fórmulas</div>
              </div>
            </Button>

            <Button
              onClick={() => handleExport('pdf')}
              className="w-full justify-start bg-red-600 hover:bg-red-700"
              disabled={!budgetData}
            >
              <FileText className="h-4 w-4 mr-3" />
              <div className="text-left">
                <div className="font-medium">PDF (.pdf)</div>
                <div className="text-xs opacity-90">Documento formatado para impressão</div>
              </div>
            </Button>

            <Button
              onClick={() => handleExport('csv')}
              className="w-full justify-start bg-blue-600 hover:bg-blue-700"
              disabled={!budgetData}
            >
              <Database className="h-4 w-4 mr-3" />
              <div className="text-left">
                <div className="font-medium">CSV (.csv)</div>
                <div className="text-xs opacity-90">Dados tabulares para análise</div>
              </div>
            </Button>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
