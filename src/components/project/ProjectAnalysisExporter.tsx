import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { FileDown, Copy, Download, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { Project } from '@/types/project';

interface ProjectAnalysisExporterProps {
  project: Project;
}

export const ProjectAnalysisExporter = ({ project }: ProjectAnalysisExporterProps) => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const generateAnalysisJSON = () => {
    const analysisData = {
      project_info: {
        id: project.id,
        name: project.name,
        type: project.project_type,
        area: project.total_area,
        location: 'Não informado',
        created_at: project.created_at,
        updated_at: project.updated_at
      },
      technical_analysis: project.analysis_data,
      budget_summary: project.analysis_data?.budget_data ? {
        total_cost: project.analysis_data.budget_data.total_com_bdi,
        cost_per_sqm: project.analysis_data.budget_data.total_com_bdi / project.total_area,
        items_count: project.analysis_data.budget_data.items?.length || 0,
        bdi_percentage: project.analysis_data.budget_data.bdi * 100
      } : null,
      schedule_summary: project.analysis_data?.schedule_data ? {
        total_duration: project.analysis_data.schedule_data.total_duration,
        start_date: project.analysis_data.schedule_data.start_date,
        end_date: project.analysis_data.schedule_data.end_date,
        phases_count: project.analysis_data.schedule_data.phases?.length || 0,
        tasks_count: project.analysis_data.schedule_data.tasks?.length || 0
      } : null,
      exported_at: new Date().toISOString(),
      exported_by: "MadeAI Platform"
    };

    return JSON.stringify(analysisData, null, 2);
  };

  const handleDownloadJSON = async () => {
    setIsExporting(true);
    try {
      const jsonData = generateAnalysisJSON();
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${project.name.replace(/\s+/g, '_')}_analysis_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast({
        title: "✅ JSON Exportado",
        description: `Análise técnica de ${project.name} exportada com sucesso!`,
      });
      setIsOpen(false);
    } catch (error) {
      console.error('Erro ao exportar JSON:', error);
      toast({
        title: "❌ Erro na exportação",
        description: "Não foi possível exportar o arquivo JSON. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopyToClipboard = async () => {
    setIsExporting(true);
    try {
      const jsonData = generateAnalysisJSON();
      await navigator.clipboard.writeText(jsonData);
      
      toast({
        title: "✅ Copiado para área de transferência",
        description: "Dados da análise técnica copiados com sucesso!",
      });
      setIsOpen(false);
    } catch (error) {
      console.error('Erro ao copiar para clipboard:', error);
      toast({
        title: "❌ Erro ao copiar",
        description: "Não foi possível copiar os dados. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="bg-blue-50 border-blue-200 hover:bg-blue-100">
          <FileDown className="h-4 w-4 mr-2" />
          Exportar Análise
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            Exportar Análise Técnica
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-800 font-medium mb-2">
              Projeto: {project.name}
            </p>
            <div className="flex gap-2 flex-wrap">
              {project.total_area && (
                <Badge variant="secondary">{project.total_area}m²</Badge>
              )}
              {project.project_type && (
                <Badge variant="outline">{project.project_type}</Badge>
              )}
            </div>
          </div>

          <p className="text-sm text-gray-600">
            Escolha como deseja exportar a análise técnica completa:
          </p>
          
          <div className="space-y-3">
            <Button
              onClick={handleDownloadJSON}
              className="w-full justify-start bg-green-600 hover:bg-green-700"
              disabled={isExporting}
            >
              <Download className="h-4 w-4 mr-3" />
              <div className="text-left">
                <div className="font-medium">Download JSON (.json)</div>
                <div className="text-xs opacity-90">Arquivo estruturado com toda análise</div>
              </div>
              {isExporting && <div className="ml-auto animate-spin">⏳</div>}
            </Button>

            <Button
              onClick={handleCopyToClipboard}
              className="w-full justify-start bg-blue-600 hover:bg-blue-700"
              disabled={isExporting}
            >
              <Copy className="h-4 w-4 mr-3" />
              <div className="text-left">
                <div className="font-medium">Copiar para Área de Transferência</div>
                <div className="text-xs opacity-90">JSON pronto para colar em outras ferramentas</div>
              </div>
            </Button>
          </div>

          <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded">
            <strong>Dados incluídos:</strong> Informações do projeto, análise técnica completa, 
            resumo do orçamento, cronograma e metadados de exportação.
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isExporting}>
              Cancelar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};