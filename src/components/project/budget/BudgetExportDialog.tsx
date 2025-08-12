
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FileSpreadsheet, FileText, Database } from 'lucide-react';
import { BudgetData } from '@/utils/budgetGenerator';
import { generateProjectPDF, PDFExportOptions } from '@/utils/pdf';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

interface BudgetExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  budgetData: BudgetData | null;
  projectName?: string;
  projectArea?: number;
}

export const BudgetExportDialog = ({ 
  open, 
  onOpenChange, 
  budgetData, 
  projectName = 'Projeto',
  projectArea 
}: BudgetExportDialogProps) => {
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async (format: 'excel' | 'pdf' | 'csv') => {
    if (!budgetData) return;

    setIsExporting(true);

    try {
      if (format === 'pdf') {
        console.log('🚀 Iniciando exportação PDF...', { projectName, projectArea, budgetData });
        
        const options: PDFExportOptions = {
          projectName,
          projectArea,
          date: new Date(),
          includeHeader: true,
          includeLogo: true
        };

        console.log('📋 Opções de exportação:', options);
        await generateProjectPDF('budget', { budget: budgetData }, options);
        console.log('🎉 PDF exportado com sucesso!');
        
        toast({
          title: "✅ PDF Exportado",
          description: `Orçamento de ${projectName} exportado com sucesso!`,
        });
      } else if (format === 'excel') {
        // Usar exportUtils para Excel
        const { exportToExcel } = await import('@/utils/exportUtils');
        const result = exportToExcel(budgetData, projectName);
        
        if (result.success) {
          toast({
            title: "✅ Excel Exportado",
            description: `Planilha ${result.filename} baixada com sucesso!`,
          });
        } else {
          throw new Error(result.error);
        }
      } else if (format === 'csv') {
        // Usar exportUtils para CSV
        const { exportToCSV } = await import('@/utils/exportUtils');
        const result = exportToCSV(budgetData, projectName);
        
        if (result.success) {
          toast({
            title: "✅ CSV Exportado",
            description: `Arquivo ${result.filename} baixado com sucesso!`,
          });
        } else {
          throw new Error(result.error);
        }
      }
      
      onOpenChange(false);
    } catch (error) {
      console.error('Erro na exportação:', error);
      toast({
        title: "❌ Erro na exportação",
        description: "Não foi possível exportar o arquivo. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
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
              onClick={() => handleExport('pdf')}
              className="w-full justify-start bg-red-600 hover:bg-red-700"
              disabled={!budgetData || isExporting}
            >
              <FileText className="h-4 w-4 mr-3" />
              <div className="text-left">
                <div className="font-medium">PDF Profissional (.pdf)</div>
                <div className="text-xs opacity-90">Layout MadeAI com logo e formatação</div>
              </div>
              {isExporting && <div className="ml-auto animate-spin">⏳</div>}
            </Button>

            <Button
              onClick={() => handleExport('excel')}
              className="w-full justify-start bg-green-600 hover:bg-green-700"
              disabled={!budgetData || isExporting}
            >
              <FileSpreadsheet className="h-4 w-4 mr-3" />
              <div className="text-left">
                <div className="font-medium">Excel (.xlsx)</div>
                <div className="text-xs opacity-90">Planilha editável com fórmulas</div>
              </div>
            </Button>

            <Button
              onClick={() => handleExport('csv')}
              className="w-full justify-start bg-blue-600 hover:bg-blue-700"
              disabled={!budgetData || isExporting}
            >
              <Database className="h-4 w-4 mr-3" />
              <div className="text-left">
                <div className="font-medium">CSV (.csv)</div>
                <div className="text-xs opacity-90">Dados tabulares para análise</div>
              </div>
            </Button>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isExporting}>
              Cancelar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
