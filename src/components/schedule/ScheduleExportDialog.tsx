
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FileText, FileSpreadsheet, Database, Clock } from 'lucide-react';
import { ScheduleData } from '@/types/project';
import { generateProjectPDF, PDFExportOptions } from '@/utils/pdf';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

interface ScheduleExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  scheduleData: ScheduleData | null;
  projectName?: string;
  projectArea?: number;
}

export const ScheduleExportDialog = ({ 
  open, 
  onOpenChange, 
  scheduleData, 
  projectName = 'Projeto',
  projectArea 
}: ScheduleExportDialogProps) => {
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async (format: 'pdf' | 'excel' | 'csv') => {
    if (!scheduleData) return;

    setIsExporting(true);

    try {
      if (format === 'pdf') {
        const options: PDFExportOptions = {
          projectName,
          projectArea,
          date: new Date(),
          includeHeader: true,
          includeLogo: true
        };

        await generateProjectPDF('schedule', { schedule: scheduleData }, options);
        
        toast({
          title: "✅ PDF Exportado",
          description: `Cronograma de ${projectName} exportado com sucesso!`,
        });
      } else {
        toast({
          title: "🚧 Em desenvolvimento",
          description: `Exportação ${format.toUpperCase()} estará disponível em breve!`,
          variant: "default",
        });
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
          <DialogTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-600" />
            Exportar Cronograma
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Escolha o formato para exportar o cronograma de <strong>{projectName}</strong>:
          </p>
          
          <div className="space-y-3">
            <Button
              onClick={() => handleExport('pdf')}
              className="w-full justify-start bg-red-600 hover:bg-red-700"
              disabled={!scheduleData || isExporting}
            >
              <FileText className="h-4 w-4 mr-3" />
              <div className="text-left">
                <div className="font-medium">PDF Profissional (.pdf)</div>
                <div className="text-xs opacity-90">Cronograma detalhado com caminho crítico</div>
              </div>
              {isExporting && <div className="ml-auto animate-spin">⏳</div>}
            </Button>

            <Button
              onClick={() => handleExport('excel')}
              className="w-full justify-start bg-green-600 hover:bg-green-700"
              disabled={!scheduleData || isExporting}
            >
              <FileSpreadsheet className="h-4 w-4 mr-3" />
              <div className="text-left">
                <div className="font-medium">Excel (.xlsx)</div>
                <div className="text-xs opacity-90">Planilha editável de Gantt</div>
              </div>
            </Button>

            <Button
              onClick={() => handleExport('csv')}
              className="w-full justify-start bg-blue-600 hover:bg-blue-700"
              disabled={!scheduleData || isExporting}
            >
              <Database className="h-4 w-4 mr-3" />
              <div className="text-left">
                <div className="font-medium">CSV (.csv)</div>
                <div className="text-xs opacity-90">Dados das atividades para análise</div>
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
