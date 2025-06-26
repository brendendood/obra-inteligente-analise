
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Download, FileText, Table, FileSpreadsheet } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { exportScheduleToPDF, exportScheduleToExcel, exportScheduleToCSV } from '@/utils/scheduleExportUtils';
import { ScheduleData } from '@/types/project';

interface ScheduleExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  scheduleData: ScheduleData;
}

export const ScheduleExportDialog = ({ open, onOpenChange, scheduleData }: ScheduleExportDialogProps) => {
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const exportFormats = [
    {
      id: 'pdf',
      name: 'PDF Cronograma',
      description: 'Cronograma completo em PDF profissional',
      icon: FileText,
      color: 'bg-red-100 text-red-700 border-red-200'
    },
    {
      id: 'excel',
      name: 'Excel Planilha',
      description: 'Planilha Excel com múltiplas abas e análises',
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
    if (!scheduleData) {
      toast({
        title: "❌ Erro",
        description: "Nenhum cronograma disponível para exportar.",
        variant: "destructive",
      });
      return;
    }

    setIsExporting(true);

    try {
      const fileName = `Cronograma_${scheduleData.projectName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}`;
      
      switch (format) {
        case 'pdf':
          await exportScheduleToPDF(scheduleData, fileName);
          break;
          
        case 'excel':
          await exportScheduleToExcel(scheduleData, fileName);
          break;
          
        case 'csv':
          await exportScheduleToCSV(scheduleData, fileName);
          break;
          
        default:
          throw new Error('Formato não suportado');
      }

      toast({
        title: "✅ Exportação concluída!",
        description: `Cronograma exportado em formato ${format.toUpperCase()}.`,
      });

      onOpenChange(false);
    } catch (error) {
      console.error('Erro na exportação:', error);
      toast({
        title: "❌ Erro na exportação",
        description: "Não foi possível exportar o cronograma. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Download className="h-5 w-5 mr-2 text-blue-600" />
            Exportar Cronograma
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="text-sm text-gray-600 mb-4">
            Escolha o formato para exportar o cronograma de <strong>{scheduleData?.projectName}</strong>:
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
                <Badge variant="outline" className="text-xs">Cronograma</Badge>
                <Badge variant="outline" className="text-xs">Custos</Badge>
                <Badge variant="outline" className="text-xs">Crítico</Badge>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
