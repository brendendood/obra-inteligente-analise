
import { useState } from 'react';
import { useProjectDetail } from '@/contexts/ProjectDetailContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Download, Eye, ExternalLink, FileSpreadsheet, BarChart3, Calendar, FileCode } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const ProjectSpecificDocumentsPage = () => {
  const { project, isLoading, error } = useProjectDetail();
  const { projectId } = useParams<{ projectId: string }>();
  const { toast } = useToast();
  const [loadingDocument, setLoadingDocument] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando documentos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Erro ao carregar projeto</h3>
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-16">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Projeto não encontrado</h3>
        <p className="text-gray-600">Não foi possível carregar os dados do projeto.</p>
      </div>
    );
  }

  const getPdfUrl = () => {
    if (!project?.file_path) return null;
    
    const { data } = supabase.storage
      .from('project-files')
      .getPublicUrl(project.file_path);
    
    return data?.publicUrl || null;
  };

  const handleDownloadWithLoading = async (docId: string, downloadFn: () => void) => {
    try {
      setLoadingDocument(docId);
      await downloadFn();
      toast({
        title: "Download iniciado",
        description: "O arquivo será baixado em instantes.",
      });
    } catch (error) {
      toast({
        title: "Erro no download",
        description: "Não foi possível baixar o arquivo. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoadingDocument(null);
    }
  };

  const exportAnalysisData = () => {
    if (!project?.analysis_data) return;
    
    const analysisJson = {
      project_name: project.name,
      analysis_data: project.analysis_data,
      export_date: new Date().toISOString(),
      project_id: project.id
    };
    
    const blob = new Blob([JSON.stringify(analysisJson, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `analise-${project.name}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const viewAnalysisData = () => {
    if (!project?.analysis_data) return;
    
    const analysisWindow = window.open('', '_blank');
    if (analysisWindow) {
      analysisWindow.document.write(`
        <html>
          <head>
            <title>Análise Técnica - ${project.name}</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; line-height: 1.6; }
              pre { background: #f5f5f5; padding: 15px; border-radius: 8px; overflow-x: auto; }
              h1 { color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px; }
            </style>
          </head>
          <body>
            <h1>Análise Técnica - ${project.name}</h1>
            <p><strong>Data de exportação:</strong> ${new Date().toLocaleString('pt-BR')}</p>
            <h2>Dados da Análise:</h2>
            <pre>${JSON.stringify(project.analysis_data, null, 2)}</pre>
          </body>
        </html>
      `);
    }
  };

  const documents = [
    {
      id: 'original',
      name: 'Projeto Original',
      type: 'PDF',
      description: `${project.name}.pdf`,
      icon: FileText,
      color: 'text-red-500',
      bgColor: 'bg-red-50',
      available: !!project.file_path,
      actions: [
        { 
          label: 'Visualizar', 
          icon: Eye, 
          action: () => handleDownloadWithLoading('original', () => window.open(getPdfUrl(), '_blank'))
        },
        { 
          label: 'Download', 
          icon: Download, 
          action: () => handleDownloadWithLoading('original', () => {
            const link = document.createElement('a');
            link.href = getPdfUrl() || '';
            link.download = `${project.name}.pdf`;
            link.click();
          })
        }
      ]
    },
    {
      id: 'analysis',
      name: 'Análise Técnica',
      type: 'JSON',
      description: 'Dados da análise IA do projeto',
      icon: BarChart3,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
      available: !!project.analysis_data,
      actions: [
        { 
          label: 'Visualizar', 
          icon: Eye, 
          action: () => handleDownloadWithLoading('analysis', viewAnalysisData)
        },
        { 
          label: 'Exportar', 
          icon: Download, 
          action: () => handleDownloadWithLoading('analysis', exportAnalysisData)
        }
      ]
    },
    {
      id: 'budget',
      name: 'Orçamento SINAPI',
      type: 'Excel',
      description: 'Planilha de orçamento detalhado',
      icon: FileSpreadsheet,
      color: 'text-green-500',
      bgColor: 'bg-green-50',
      available: false,
      actions: [
        { 
          label: 'Gerar', 
          icon: ExternalLink, 
          action: () => window.location.href = `/projeto/${projectId}/orcamento` 
        }
      ]
    },
    {
      id: 'schedule',
      name: 'Cronograma da Obra',
      type: 'Excel',
      description: 'Timeline detalhada das etapas',
      icon: Calendar,
      color: 'text-orange-500',
      bgColor: 'bg-orange-50',
      available: false,
      actions: [
        { 
          label: 'Gerar', 
          icon: ExternalLink, 
          action: () => window.location.href = `/projeto/${projectId}/cronograma` 
        }
      ]
    },
    {
      id: 'report',
      name: 'Relatório Final',
      type: 'PDF',
      description: 'Compilação completa do projeto',
      icon: FileCode,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50',
      available: false,
      actions: [
        { 
          label: 'Em breve', 
          icon: FileText, 
          action: () => toast({
            title: "Em desenvolvimento",
            description: "Esta funcionalidade estará disponível em breve.",
          })
        }
      ]
    }
  ];

  return (
    <div className="space-y-4 md:space-y-6 px-4 md:px-0">
      {/* Header - Mobile Optimized */}
      <div className="flex flex-col space-y-2 md:space-y-0">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900 truncate">
          Documentos - {project.name}
        </h1>
        <p className="text-sm md:text-base text-gray-600">
          Downloads e relatórios específicos deste projeto
        </p>
      </div>

      {/* Documents Grid - Mobile Responsive */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {documents.map((doc) => (
          <Card key={doc.id} className={`transition-all duration-200 hover:shadow-lg ${
            doc.available ? 'border-gray-200' : 'border-gray-100 bg-gray-50'
          }`}>
            <CardHeader className="pb-2 md:pb-3 p-4 md:p-6">
              <CardTitle className="flex items-start justify-between">
                <div className="flex items-center space-x-2 md:space-x-3 min-w-0 flex-1">
                  <div className={`p-2 md:p-3 rounded-lg ${doc.bgColor} flex-shrink-0`}>
                    <doc.icon className={`h-5 w-5 md:h-6 md:w-6 ${doc.color}`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-sm md:text-base text-gray-900 truncate">
                      {doc.name}
                    </h3>
                    <p className="text-xs md:text-sm text-gray-500">{doc.type}</p>
                  </div>
                </div>
                
                <div className="flex-shrink-0 ml-2">
                  {doc.available ? (
                    <Badge className="bg-green-100 text-green-800 text-xs">
                      Disponível
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="text-xs">
                      Indisponível
                    </Badge>
                  )}
                </div>
              </CardTitle>
            </CardHeader>
            
            <CardContent className="p-4 md:p-6 pt-0">
              <p className="text-xs md:text-sm text-gray-600 mb-3 md:mb-4 line-clamp-2">
                {doc.description}
              </p>
              
              {/* Action Buttons - Mobile Optimized */}
              <div className="flex flex-col sm:flex-row gap-2">
                {doc.actions.map((action, actionIndex) => (
                  <Button
                    key={actionIndex}
                    variant={doc.available ? "default" : "outline"}
                    size="sm"
                    onClick={action.action}
                    disabled={
                      loadingDocument === doc.id || 
                      (!doc.available && action.label !== 'Gerar' && action.label !== 'Em breve')
                    }
                    className={`flex items-center justify-center gap-1 h-8 md:h-9 text-xs md:text-sm ${
                      !doc.available && action.label !== 'Gerar' && action.label !== 'Em breve' 
                        ? 'opacity-50 cursor-not-allowed' 
                        : ''
                    }`}
                  >
                    {loadingDocument === doc.id ? (
                      <div className="animate-spin rounded-full h-3 w-3 md:h-4 md:w-4 border-2 border-b-transparent border-current"></div>
                    ) : (
                      <action.icon className="h-3 w-3 md:h-4 md:w-4" />
                    )}
                    <span className="truncate">{action.label}</span>
                  </Button>
                ))}
              </div>
              
              {/* Helper Text */}
              {!doc.available && doc.name.includes('Orçamento') && (
                <p className="text-xs text-gray-500 mt-2">
                  💡 Vá para a aba Orçamento para gerar este documento
                </p>
              )}
              
              {!doc.available && doc.name.includes('Cronograma') && (
                <p className="text-xs text-gray-500 mt-2">
                  💡 Vá para a aba Cronograma para gerar este documento
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Info Card - Mobile Responsive */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4 md:p-6">
          <div className="flex items-start space-x-2 md:space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
              <FileText className="h-4 w-4 md:h-5 md:w-5 text-blue-600" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-blue-900 mb-2 text-sm md:text-base">
                Sobre os Documentos do Projeto
              </h3>
              <ul className="text-xs md:text-sm text-blue-800 space-y-1">
                <li>• <strong>Projeto Original:</strong> Arquivo PDF enviado inicialmente</li>
                <li>• <strong>Análise Técnica:</strong> Dados extraídos pela IA sobre o projeto</li>
                <li>• <strong>Orçamento SINAPI:</strong> Gerado conforme tabela oficial de preços</li>
                <li>• <strong>Cronograma:</strong> Timeline baseada na complexidade do projeto</li>
                <li>• <strong>Relatório Final:</strong> Compilação completa (em desenvolvimento)</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectSpecificDocumentsPage;
